import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/api-auth";
import { deleteFamilyMember, updateFamilyMember } from "@/lib/storage";
import type { FamilyMember } from "@/lib/types";

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(request: Request, context: RouteContext) {
  const authError = await requireAdminApi();
  if (authError) return authError;

  try {
    const { id } = await context.params;
    const body = (await request.json()) as Partial<FamilyMember>;
    const updates: Partial<FamilyMember> = {};

    if (body.name !== undefined) updates.name = body.name;
    if (body.nameNe !== undefined) updates.nameNe = body.nameNe;
    if (body.relation !== undefined) updates.relation = body.relation;
    if (body.relationNe !== undefined) updates.relationNe = body.relationNe;
    if (body.photo !== undefined) updates.photo = body.photo;
    if (body.bio !== undefined) updates.bio = body.bio;
    if (body.bioNe !== undefined) updates.bioNe = body.bioNe;

    const member = await updateFamilyMember(id, updates);
    return NextResponse.json({ member });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update family member";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const authError = await requireAdminApi();
  if (authError) return authError;

  try {
    const { id } = await context.params;
    await deleteFamilyMember(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to delete family member";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
