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
  const linkClass = `inline-flex min-h-[44px] items-center justify-center text-xs tracking-[0.15em] text-gold underline-offset-4 transition-colors hover:text-green hover:underline md:text-sm ${
    isNepali ? "font-serif" : "uppercase"
  }`;

  return (
    <div className="mt-4 w-full md:mt-6">
      {/* Mobile — link card instead of iframe */}
      <div className="flex h-[280px] flex-col items-center justify-center rounded-[1.75rem] border-[3px] border-green/25 bg-green/10 px-5 text-center shadow-md md:hidden">
        <p className="font-serif text-lg font-bold text-green">{name}</p>
        <p
          className={`mt-3 text-sm leading-relaxed text-[#1a1a1a]/70 ${
            isNepali ? "font-serif" : ""
          }`}
        >
          {note}
        </p>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={`mt-5 inline-flex min-h-[44px] items-center justify-center rounded-sm border border-gold/35 bg-white px-5 py-3 text-sm font-bold text-green transition-colors hover:border-gold hover:text-wedding ${
            isNepali ? "font-serif" : "uppercase tracking-[0.15em]"
          }`}
        >
          {openSiteLabel}
        </a>
      </div>

      {/* Desktop — embedded preview */}
      <div className="hidden h-[485px] overflow-hidden rounded-[1.75rem] border-[3px] border-[#2c3e2d] bg-[#2c3e2d] shadow-md md:block">
        <div className="flex h-5 items-end justify-center bg-[#2c3e2d] pb-1">
          <div className="h-1 w-12 rounded-full bg-black/40" aria-hidden />
        </div>
        <iframe
          src={url}
          title={`${name} — find hotels in Sauraha`}
          className="h-[460px] w-full border-0 bg-white"
          loading="lazy"
        />
      </div>

      <p className="mt-4 hidden text-center text-xs leading-relaxed text-[#1a1a1a]/60 md:block md:text-sm">
        {note}
      </p>
      <p className="mt-2 hidden text-center md:block">
        <a href={url} target="_blank" rel="noopener noreferrer" className={linkClass}>
          {openSiteLabel} {url.replace(/^https?:\/\//, "")}
        </a>
      </p>
    </div>
  );
}
