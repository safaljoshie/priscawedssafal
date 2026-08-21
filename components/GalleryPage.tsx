"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import type {
  GalleryData,
  GalleryEventId,
  GalleryPhoto,
  GalleryReel,
  WeddingData,
} from "@/lib/types";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { formatWeddingDateDisplay } from "@/lib/i18n/nepaliDate";

type TabKey = "all" | GalleryEventId | "reels";

const EVENT_TABS: { key: TabKey; labelKey: "all" | "mehendi" | "weddingDay" | "ganeshSagun" | "reception" | "reels" }[] = [
  { key: "all", labelKey: "all" },
  { key: "mehendi", labelKey: "mehendi" },
  { key: "wedding-day", labelKey: "weddingDay" },
  { key: "ganesh-sagun", labelKey: "ganeshSagun" },
  { key: "reception", labelKey: "reception" },
  { key: "reels", labelKey: "reels" },
];

function PhotoPlaceholder({ color }: { color: string }) {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{
        background: `linear-gradient(135deg, ${color}cc, ${color}44)`,
      }}
    >
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="rgba(255,255,255,0.4)"
        strokeWidth="1.5"
        aria-hidden
      >
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    </div>
  );
}

function Lightbox({
  photo,
  photos,
  onClose,
  onPrev,
  onNext,
  closeLabel,
}: {
  photo: GalleryPhoto;
  photos: GalleryPhoto[];
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  closeLabel: string;
}) {
  const index = photos.findIndex((p) => p.id === photo.id);
  const color = photo.color ?? "#2c3e2d";

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") onPrev();
      if (event.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, onPrev, onNext]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={photo.alt.en}
      className="fixed inset-0 z-[1000] flex flex-col items-center justify-center bg-black/92"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label={closeLabel}
        className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-xl text-white"
      >
        ✕
      </button>

      <div className="absolute left-0 right-0 top-5 text-center text-xs tracking-[0.2em] text-white/50">
        {index + 1} / {photos.length}
      </div>

      <div
        className="relative flex w-[85vw] max-w-[500px] items-center justify-center overflow-hidden rounded-xl"
        style={{ height: photo.portrait ? "70vh" : "50vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {photo.src ? (
          <Image
            src={photo.src}
            alt={photo.alt.en}
            fill
            className="object-contain"
            sizes="500px"
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${color}cc, ${color}44)`,
            }}
          >
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="1"
              aria-hidden
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
        )}
      </div>

      {index > 0 && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }}
          className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/12 text-lg text-white"
          aria-label="Previous"
        >
          ‹
        </button>
      )}
      {index < photos.length - 1 && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/12 text-lg text-white"
          aria-label="Next"
        >
          ›
        </button>
      )}
    </div>
  );
}

function getVideoEmbedUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      const id = parsed.pathname.slice(1);
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }

    if (host === "youtube.com" || host === "m.youtube.com") {
      const id = parsed.searchParams.get("v");
      if (id) return `https://www.youtube.com/embed/${id}`;
      const shorts = parsed.pathname.match(/^\/shorts\/([^/]+)/);
      if (shorts?.[1]) return `https://www.youtube.com/embed/${shorts[1]}`;
      const embed = parsed.pathname.match(/^\/embed\/([^/]+)/);
      if (embed?.[1]) return `https://www.youtube.com/embed/${embed[1]}`;
    }

    if (host === "vimeo.com") {
      const id = parsed.pathname.split("/").filter(Boolean)[0];
      return id ? `https://player.vimeo.com/video/${id}` : null;
    }
  } catch {
    return null;
  }
  return null;
}

function VideoModal({
  reel,
  title,
  onClose,
  closeLabel,
  placeholder,
}: {
  reel: GalleryReel;
  title: string;
  onClose: () => void;
  closeLabel: string;
  placeholder: string;
}) {
  const color = reel.color ?? "#2c3e2d";
  const embedUrl = reel.videoUrl ? getVideoEmbedUrl(reel.videoUrl) : null;
  const isDirectVideo = Boolean(
    reel.videoUrl && /\.(mp4|webm|ogg)(\?|$)/i.test(reel.videoUrl)
  );

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/92"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label={closeLabel}
        className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-xl text-white"
      >
        ✕
      </button>
      <div
        className={`flex w-[90vw] max-w-[480px] flex-col items-center justify-center gap-3 overflow-hidden rounded-[14px] ${
          embedUrl ? "aspect-video max-w-[720px]" : "aspect-[9/16]"
        }`}
        style={{ background: color }}
        onClick={(e) => e.stopPropagation()}
      >
        {embedUrl ? (
          <iframe
            src={embedUrl}
            title={title}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : isDirectVideo && reel.videoUrl ? (
          <video
            src={reel.videoUrl}
            controls
            autoPlay
            className="h-full w-full object-contain"
          />
        ) : reel.videoUrl ? (
          <a
            href={reel.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-sm bg-white/15 px-4 py-3 text-sm text-white underline"
          >
            {title} — open video
          </a>
        ) : (
          <>
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/40 bg-white/15">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="white" aria-hidden>
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            </div>
            <div className="px-4 text-center text-[15px] font-medium text-white">
              {title}
            </div>
            <div className="text-xs text-white/60">{placeholder}</div>
          </>
        )}
      </div>
    </div>
  );
}

type Props = {
  gallery: GalleryData;
  wedding: WeddingData;
};

export function GalleryPage({ gallery, wedding }: Props) {
  const { locale, t } = useLanguage();
  const isNepali = locale === "ne";
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [lightboxPhoto, setLightboxPhoto] = useState<GalleryPhoto | null>(null);
  const [videoReel, setVideoReel] = useState<GalleryReel | null>(null);
  const [visibleCount, setVisibleCount] = useState(12);

  const isReels = activeTab === "reels";
  const displayDate = formatWeddingDateDisplay(
    locale,
    wedding.dateDisplay,
    wedding.dateRange
  );
  const city = isNepali ? t.location.city : wedding.location.city;

  const filteredPhotos =
    activeTab === "all"
      ? gallery.photos
      : gallery.photos.filter((p) => p.event === activeTab);

  const visiblePhotos = filteredPhotos.slice(0, visibleCount);

  const eventLabel = (event: GalleryEventId) => {
    const tab = EVENT_TABS.find((item) => item.key === event);
    return tab ? t.gallery.tabs[tab.labelKey] : event;
  };

  const openLightbox = useCallback((photo: GalleryPhoto) => {
    setLightboxPhoto(photo);
  }, []);

  const goNext = useCallback(() => {
    setLightboxPhoto((current) => {
      if (!current) return null;
      const idx = filteredPhotos.findIndex((p) => p.id === current.id);
      if (idx < 0 || idx >= filteredPhotos.length - 1) return current;
      return filteredPhotos[idx + 1];
    });
  }, [filteredPhotos]);

  const goPrev = useCallback(() => {
    setLightboxPhoto((current) => {
      if (!current) return null;
      const idx = filteredPhotos.findIndex((p) => p.id === current.id);
      if (idx <= 0) return current;
      return filteredPhotos[idx - 1];
    });
  }, [filteredPhotos]);

  const handleTabChange = (key: TabKey) => {
    setActiveTab(key);
    setVisibleCount(12);
    setLightboxPhoto(null);
  };

  return (
    <>
      <section className="min-h-screen bg-white">
        <div className="relative overflow-hidden bg-gradient-to-br from-green-dark via-green to-[#3d5c3a] px-5 pb-6 pt-12 text-center md:pt-28">
          <div className="pointer-events-none absolute -right-10 -top-10 h-[150px] w-[150px] rounded-full bg-gold/10" />
          <div className="pointer-events-none absolute -bottom-8 -left-8 h-[100px] w-[100px] rounded-full bg-gold/[0.06]" />

          <p
            className={`mb-2 text-[11px] uppercase tracking-[0.3em] text-gold/80 ${
              isNepali ? "font-serif normal-case tracking-wide" : ""
            }`}
          >
            {t.gallery.label}
          </p>
          <h1 className="font-serif text-[32px] font-normal leading-tight text-white">
            {wedding.couple.bride}{" "}
            <span className="italic text-gold">&</span> {wedding.couple.groom}
          </h1>
          <div className="mx-auto my-3.5 h-px w-10 bg-gold" />
          <p className="text-xs tracking-wide text-white/55">
            {displayDate} · {city}
          </p>

          <div className="mt-5 flex justify-center gap-6 border-t border-white/10 pt-3">
            {[
              {
                n: `${gallery.photos.length}+`,
                l: t.gallery.stats.photos,
              },
              { n: String(gallery.reels.length), l: t.gallery.stats.videos },
              { n: "4", l: t.gallery.stats.events },
            ].map((stat) => (
              <div key={stat.l} className="text-center">
                <div className="font-serif text-[22px] font-medium text-gold">
                  {stat.n}
                </div>
                <div
                  className={`text-[10px] uppercase tracking-[0.15em] text-white/50 ${
                    isNepali ? "font-serif normal-case tracking-wide" : ""
                  }`}
                >
                  {stat.l}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="sticky top-0 z-10 flex overflow-x-auto border-b border-[#e8e8e8] bg-white [-ms-overflow-style:none] [scrollbar-width:none] md:top-[49px] [&::-webkit-scrollbar]:hidden">
          {EVENT_TABS.map((ev) => {
            const active = activeTab === ev.key;
            return (
              <button
                key={ev.key}
                type="button"
                onClick={() => handleTabChange(ev.key)}
                className={`flex shrink-0 items-center gap-1.5 whitespace-nowrap px-3.5 py-3 text-[11px] transition-colors ${
                  isNepali
                    ? "font-serif tracking-wide"
                    : "uppercase tracking-[0.1em]"
                } ${
                  active
                    ? "border-b-2 border-gold font-semibold text-green"
                    : "border-b-2 border-transparent font-normal text-[#999]"
                }`}
              >
                {ev.key === "reels" && (
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden
                  >
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                )}
                {t.gallery.tabs[ev.labelKey]}
              </button>
            );
          })}
        </div>

        <div className="px-2.5 pb-20 pt-3.5 md:px-4">
          {!isReels && activeTab !== "all" && (
            <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-ivory px-3 py-1.5 text-xs text-[#8a6a3a]">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-gold" />
              {eventLabel(activeTab)} · {filteredPhotos.length}{" "}
              {t.gallery.stats.photos.toLowerCase()}
            </div>
          )}

          {!isReels && (
            <>
              {filteredPhotos.length === 0 ? (
                <p className="py-16 text-center text-sm text-[#bbb]">
                  {t.gallery.empty}
                </p>
              ) : (
                <>
                  <div className="columns-2 gap-2">
                    {visiblePhotos.map((photo) => {
                      const color = photo.color ?? "#2c3e2d";
                      const alt =
                        locale === "ne" ? photo.alt.ne : photo.alt.en;
                      return (
                        <button
                          key={photo.id}
                          type="button"
                          onClick={() => openLightbox(photo)}
                          className="relative mb-2 block w-full break-inside-avoid overflow-hidden rounded-[10px]"
                          style={{
                            height: photo.portrait ? 260 : 180,
                            background: color,
                          }}
                          aria-label={alt}
                        >
                          {photo.src || photo.thumb ? (
                            <Image
                              src={photo.thumb || photo.src!}
                              alt={alt}
                              fill
                              className="object-cover"
                              sizes="215px"
                            />
                          ) : (
                            <PhotoPlaceholder color={color} />
                          )}
                          {activeTab === "all" && (
                            <span
                              className={`absolute left-2 top-2 rounded-full bg-black/45 px-2 py-0.5 text-[9px] uppercase tracking-wider text-white/85 backdrop-blur-sm ${
                                isNepali ? "font-serif normal-case tracking-wide" : ""
                              }`}
                            >
                              {eventLabel(photo.event)}
                            </span>
                          )}
                          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 to-transparent to-60%" />
                        </button>
                      );
                    })}
                  </div>

                  {visibleCount < filteredPhotos.length && (
                    <div className="mt-5 text-center">
                      <button
                        type="button"
                        onClick={() => setVisibleCount((v) => v + 12)}
                        className={`rounded-lg border-[1.5px] border-green px-7 py-2.5 text-xs text-green transition-colors hover:bg-green/5 ${
                          isNepali
                            ? "font-serif"
                            : "uppercase tracking-[0.15em]"
                        }`}
                      >
                        {t.gallery.loadMore}
                      </button>
                    </div>
                  )}

                  {visibleCount >= filteredPhotos.length &&
                    filteredPhotos.length > 0 && (
                      <p className="mt-5 text-center text-xs tracking-wide text-[#bbb]">
                        — {t.gallery.allShown.replace("{count}", String(filteredPhotos.length))} —
                      </p>
                    )}
                </>
              )}
            </>
          )}

          {isReels && (
            <>
              <div className="mb-3.5 inline-flex items-center gap-1.5 rounded-full bg-[#f0f2eb] px-3 py-1.5 text-xs text-green">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-green" />
                {t.gallery.reelsCount.replace(
                  "{count}",
                  String(gallery.reels.length)
                )}
              </div>

              {gallery.reels.length === 0 ? (
                <p className="py-16 text-center text-sm text-[#bbb]">
                  {t.gallery.emptyReels}
                </p>
              ) : (
                <div className="flex flex-col gap-2.5">
                  {gallery.reels.map((reel) => {
                    const color = reel.color ?? "#2c3e2d";
                    const title =
                      locale === "ne" ? reel.title.ne : reel.title.en;
                    return (
                      <button
                        key={reel.id}
                        type="button"
                        onClick={() => setVideoReel(reel)}
                        className="flex items-center gap-3 rounded-xl border border-[#ebebeb] bg-[#fafafa] px-3 py-2.5 text-left transition-colors hover:bg-[#f5f5f5]"
                      >
                        <div
                          className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg"
                          style={{
                            background: `linear-gradient(135deg, ${color}cc, ${color}55)`,
                          }}
                        >
                          {reel.thumb ? (
                            <Image
                              src={reel.thumb}
                              alt=""
                              fill
                              className="object-cover"
                              sizes="80px"
                            />
                          ) : null}
                          <div className="relative z-[1] flex h-[34px] w-[34px] items-center justify-center rounded-full border border-white/40 bg-white/20">
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="white"
                              aria-hidden
                            >
                              <polygon points="5 3 19 12 5 21 5 3" />
                            </svg>
                          </div>
                          <span className="absolute bottom-1.5 right-1.5 z-[1] rounded bg-black/55 px-1.5 py-px text-[9px] tracking-wide text-white">
                            {reel.duration}
                          </span>
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="mb-1 text-sm font-medium text-[#1a1a1a]">
                            {title}
                          </div>
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wider ${
                              isNepali ? "font-serif normal-case tracking-wide" : ""
                            }`}
                            style={{
                              background: `${color}18`,
                              color,
                            }}
                          >
                            {eventLabel(reel.event)}
                          </span>
                        </div>

                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#ccc"
                          strokeWidth="2"
                          aria-hidden
                        >
                          <polyline points="9 18 15 12 9 6" />
                        </svg>
                      </button>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {lightboxPhoto && (
        <Lightbox
          photo={lightboxPhoto}
          photos={filteredPhotos}
          onClose={() => setLightboxPhoto(null)}
          onPrev={goPrev}
          onNext={goNext}
          closeLabel={t.gallery.close}
        />
      )}

      {videoReel && (
        <VideoModal
          reel={videoReel}
          title={locale === "ne" ? videoReel.title.ne : videoReel.title.en}
          onClose={() => setVideoReel(null)}
          closeLabel={t.gallery.close}
          placeholder={t.gallery.videoPlaceholder}
        />
      )}
    </>
  );
}
