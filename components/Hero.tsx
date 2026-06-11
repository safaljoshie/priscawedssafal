import Image from "next/image";
import { wedding } from "@/lib/wedding";
import { Countdown } from "./Countdown";
import { Ornament } from "./Divider";

export function Hero() {
  const { couple, dateDisplay, location } = wedding;

  return (
    <section id="home" className="relative bg-ivory">
      <div className="flex items-center justify-center px-6 pt-10 pb-6">
        <Image
          src="/images/save-the-date.png"
          alt={`Save the Date — ${couple.bride} and ${couple.groom}`}
          width={800}
          height={800}
          priority
          sizes="430px"
          className="h-auto w-full max-w-[380px]"
        />
      </div>

      <div className="flex flex-col items-center px-6 py-10 text-center">
        <Ornament />

        <p className="mt-6 font-serif text-xl text-green/90">{dateDisplay}</p>
        <p className="mt-2 text-sm tracking-wide text-[#1a1a1a]/60">
          {location.city}
        </p>

        <Countdown />

        <a
          href="#details"
          className="mt-12 flex flex-col items-center gap-2 text-xs uppercase tracking-[0.25em] text-green/50 transition-colors hover:text-gold"
        >
          <span>Discover more</span>
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            className="animate-bounce"
            aria-hidden
          >
            <path
              d="M10 4v12M5 11l5 5 5-5"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      </div>
    </section>
  );
}
