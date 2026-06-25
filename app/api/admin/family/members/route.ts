import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/api-auth";
import { addFamilyMember } from "@/lib/storage";
import type { FamilyCategory, FamilyMember, FamilySide } from "@/lib/types";

export async function POST(request: Request) {
  const authError = await requireAdminApi();
  if (authError) return authError;

  try {
    const body = (await request.json()) as {
      side?: FamilySide;
      category?: FamilyCategory;
      member?: Partial<FamilyMember>;
    };

    if (body.side !== "prisca" && body.side !== "safal") {
      return NextResponse.json({ error: "Invalid side" }, { status: 400 });
    }

    const category = body.category;
    if (
      category !== "parents" &&
      category !== "siblings" &&
      category !== "grandparents" &&
      category !== "extended"
    ) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }

    if (!body.member?.relation?.trim()) {
      return NextResponse.json({ error: "Relation is required" }, { status: 400 });
    }

    const created = await addFamilyMember(body.side, category, {
      id: body.member.id,
      name: body.member.name ?? "",
      nameNe: body.member.nameNe,
      relation: body.member.relation,
      relationNe: body.member.relationNe,
      photo: body.member.photo,
      bio: body.member.bio ?? "",
      bioNe: body.member.bioNe,
    });

    return NextResponse.json({ member: created }, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create family member";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
