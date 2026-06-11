type SectionHeadingProps = {
  label: string;
  title: string;
  className?: string;
};

export function SectionHeading({ label, title, className = "" }: SectionHeadingProps) {
  return (
    <div className={`text-center ${className}`}>
      <p className="font-serif text-xs uppercase tracking-[0.35em] text-gold">
        {label}
      </p>
      <h2 className="mt-3 font-serif text-4xl text-green">{title}</h2>
      <div className="mx-auto mt-5 h-px w-16 bg-gold/50" aria-hidden />
    </div>
  );
}
