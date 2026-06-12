type StayPreviewProps = {
  url: string;
  name: string;
  note: string;
  openSiteLabel?: string;
  isNepali?: boolean;
};

export function StayPreview({
  url,
  name,
  note,
  openSiteLabel = "Open",
  isNepali = false,
}: StayPreviewProps) {
  return (
    <div className="mt-4 w-full md:mt-6">
      <div className="h-[440px] overflow-hidden rounded-[1.75rem] border-[3px] border-[#2c3e2d] bg-[#2c3e2d] shadow-md md:h-[485px]">
        <div className="flex h-5 items-end justify-center bg-[#2c3e2d] pb-1">
          <div className="h-1 w-12 rounded-full bg-black/40" aria-hidden />
        </div>
        <iframe
          src={url}
          title={`${name} — find hotels in Sauraha`}
          className="h-[415px] w-full border-0 bg-white md:h-[460px]"
          loading="lazy"
        />
      </div>

      <p className="mt-4 text-center text-xs leading-relaxed text-[#1a1a1a]/60 md:text-sm">
        {note}
      </p>
      <p className="mt-2 text-center">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={`text-xs tracking-[0.15em] text-gold underline-offset-4 transition-colors hover:text-green hover:underline md:text-sm ${
            isNepali ? "font-serif" : "uppercase"
          }`}
        >
          {openSiteLabel} {url.replace(/^https?:\/\//, "")}
        </a>
      </p>
    </div>
  );
}
