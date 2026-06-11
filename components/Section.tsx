type SectionProps = {
  id?: string;
  className?: string;
  innerClassName?: string;
  children: React.ReactNode;
};

export function Section({
  id,
  className = "",
  innerClassName = "",
  children,
}: SectionProps) {
  return (
    <section
      id={id}
      className={`px-6 py-20 md:px-12 md:py-28 lg:px-16 ${className}`}
    >
      <div className={`mx-auto w-full max-w-6xl ${innerClassName}`}>
        {children}
      </div>
    </section>
  );
}
