type SectionHeadingProps = {
  label: string;
  title: string;
  className?: string;
};

export function SectionHeading({ label, title, className = "" }: SectionHeadingProps) {
  return (
    <div className={`text-center ${className}`}>
      <p className="font-serif text-xs uppercase tracking-[0.35em] text-gold md:text-sm">
        {label}
      </p>
      <h2 className="mt-3 font-serif text-4xl text-green md:text-5xl lg:text-6xl">
        {title}
      </h2>
      <div className="mx-auto mt-5 h-px w-16 bg-gold/50 md:mt-6 md:w-24" aria-hidden />
    </div>
  );
}
