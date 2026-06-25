"use client";

import Image from "next/image";
import { useState } from "react";
import type {
  FamilyCategory,
  FamilyData,
  FamilyMember,
  FamilySide,
  FamilySideData,
} from "@/lib/types";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { SectionHeading } from "./SectionHeading";

type Side = FamilySide;

const categories: FamilyCategory[] = [
  "parents",
  "siblings",
  "grandparents",
  "extended",
];

function getInitials(name: string, relation: string): string {
  const source = name.trim() || relation.trim();
  if (!source) return "?";
  return source
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function localizeMember(member: FamilyMember, locale: "en" | "ne") {
  if (locale === "en") {
    return {
      name: member.name.trim(),
      relation: member.relation,
      bio: member.bio.trim(),
    };
  }
  return {
    name: member.nameNe?.trim() || member.name.trim(),
    relation: member.relationNe?.trim() || member.relation,
    bio: member.bioNe?.trim() || member.bio.trim(),
  };
}

function ChevronUpIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden
      className="shrink-0"
    >
      <path
        d="M5 13l5-5 5 5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type MemberCardProps = {
  member: FamilyMember;
  index: number;
  isOpen: boolean;
  side: Side;
  onToggle: (index: number) => void;
  onClose: () => void;
};

function MemberCard({
  member,
  index,
  isOpen,
  side,
  onToggle,
  onClose,
}: MemberCardProps) {
  const { locale, t } = useLanguage();
  const isNepali = locale === "ne";
  const { name, relation, bio } = localizeMember(member, locale);
  const displayName = name || relation;
  const hasPhoto = Boolean(member.photo?.trim());
  const accentClass =
    side === "prisca"
      ? "border-gold/30 bg-gold/5"
      : "border-green/25 bg-green/5";

  return (
    <article
      className={`rounded-sm border bg-white text-left shadow-sm transition-all duration-300 ${
        isOpen
          ? `col-span-2 ${accentClass} border-2`
          : "border-gold/15 hover:border-gold/30"
      }`}
    >
      <button
        type="button"
        onClick={() => onToggle(index)}
        className={`w-full p-4 ${isOpen ? "pb-3" : ""}`}
        aria-expanded={isOpen}
      >
        <div
          className={`flex items-center gap-3 ${
            isOpen ? "flex-row text-left" : "flex-col text-center"
          }`}
        >
          <div
            className={`relative shrink-0 overflow-hidden rounded-full border-2 ${
              side === "prisca" ? "border-gold/40" : "border-green/30"
            } ${isOpen ? "h-16 w-16" : "h-14 w-14"}`}
          >
            {hasPhoto ? (
              <Image
                src={member.photo!}
                alt={displayName}
                fill
                className="object-cover"
                sizes="64px"
              />
            ) : (
              <span
                className={`flex h-full w-full items-center justify-center font-serif text-sm font-bold ${
                  side === "prisca" ? "bg-gold/15 text-gold" : "bg-green/10 text-green"
                }`}
              >
                {getInitials(name, relation)}
              </span>
            )}
          </div>
          <div className={isOpen ? "min-w-0 flex-1" : ""}>
            <p
              className={`font-serif font-bold text-green ${
                isOpen ? "text-lg" : "text-base"
              } ${isNepali ? "font-serif" : ""}`}
            >
              {displayName}
            </p>
            {name && (
              <p
                className={`mt-0.5 text-xs text-[#1a1a1a]/55 md:text-sm ${
                  isNepali ? "font-serif" : ""
                }`}
              >
                {relation}
              </p>
            )}
          </div>
        </div>
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="border-t border-gold/15 px-4 pb-4 pt-3">
          <p
            className={`text-sm leading-relaxed text-[#1a1a1a]/70 ${
              isNepali ? "font-serif" : ""
            }`}
          >
            {bio || t.family.bioPlaceholder}
          </p>
          <button
            type="button"
            onClick={onClose}
            className={`mt-4 inline-flex min-h-[44px] items-center gap-1.5 text-xs font-bold text-gold transition-colors hover:text-green ${
              isNepali ? "font-serif" : "uppercase tracking-[0.15em]"
            }`}
          >
            <ChevronUpIcon />
            {t.family.close}
          </button>
        </div>
      </div>
    </article>
  );
}

export function FamilyPage({ family }: { family: FamilyData }) {
  const { locale, t } = useLanguage();
  const isNepali = locale === "ne";
  const [side, setSide] = useState<Side>("prisca");
  const [category, setCategory] = useState<FamilyCategory>("parents");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const sideData: FamilySideData = family[side];
  const members = sideData[category];

  const handleSideChange = (next: Side) => {
    setSide(next);
    setOpenIndex(null);
  };

  const handleCategoryChange = (next: FamilyCategory) => {
    setCategory(next);
    setOpenIndex(null);
  };

  const handleToggle = (index: number) => {
    setOpenIndex((current) => (current === index ? null : index));
  };

  return (
    <section className="bg-ivory px-6 pb-20 pt-28 md:px-12 md:pb-28 md:pt-32">
      <div className="mx-auto w-full max-w-phone">
        <SectionHeading label={t.family.label} title={t.family.title} />

        <div className="mt-10 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleSideChange("prisca")}
            className={`rounded-sm px-3 py-3 text-center text-xs font-bold transition-colors md:text-sm ${
              isNepali ? "font-serif leading-snug" : "uppercase tracking-[0.08em]"
            } ${
              side === "prisca"
                ? "border-2 border-gold bg-gold/10 text-green"
                : "border border-gold/20 bg-white text-[#1a1a1a]/70"
            }`}
          >
            {t.family.priscaSide}
          </button>
          <button
            type="button"
            onClick={() => handleSideChange("safal")}
            className={`rounded-sm px-3 py-3 text-center text-xs font-bold transition-colors md:text-sm ${
              isNepali ? "font-serif leading-snug" : "uppercase tracking-[0.08em]"
            } ${
              side === "safal"
                ? "border-2 border-green bg-green/10 text-green"
                : "border border-green/20 bg-white text-[#1a1a1a]/70"
            }`}
          >
            {t.family.safalSide}
          </button>
        </div>

        <div
          className="mt-6 flex gap-1 overflow-x-auto border-b border-gold/15 pb-px [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          role="tablist"
          aria-label={t.family.label}
        >
          {categories.map((key) => {
            const isActive = category === key;
            return (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => handleCategoryChange(key)}
                className={`shrink-0 px-3 py-2.5 text-xs font-bold transition-colors md:text-sm ${
                  isNepali ? "font-serif" : "uppercase tracking-[0.12em]"
                } ${
                  isActive
                    ? "border-b-2 border-gold text-green"
                    : "border-b-2 border-transparent text-[#1a1a1a]/50 hover:text-green"
                }`}
              >
                {t.family.categories[key]}
              </button>
            );
          })}
        </div>

        {members.length === 0 ? (
          <p
            className={`mt-10 text-center text-sm text-[#1a1a1a]/55 ${
              isNepali ? "font-serif" : ""
            }`}
          >
            {t.family.emptyCategory}
          </p>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-3">
            {members.map((member, index) => (
              <MemberCard
                key={member.id}
                member={member}
                index={index}
                isOpen={openIndex === index}
                side={side}
                onToggle={handleToggle}
                onClose={() => setOpenIndex(null)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
