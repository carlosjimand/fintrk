import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { getUserId } from "@/lib/get-user-id";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getUserId();
    const { id: idStr } = await params;
    const id = parseInt(idStr, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      return NextResponse.json({ error: "Solo se permiten imágenes JPG o PNG" }, { status: 400 });
    }

    // 1MB limit
    if (file.size > 1024 * 1024) {
      return NextResponse.json({ error: "La imagen no debe superar 1MB" }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");
    const mimeType = file.type;
    const dataUri = `data:${mimeType};base64,${base64}`;

    await sql(
      "UPDATE accounts SET image_path = $1 WHERE id = $2 AND user_id = $3",
      [dataUri, id, userId]
    );

    return NextResponse.json({ ok: true, image_path: dataUri });
  } catch (error: any) {
    console.error("Error uploading image:", error);
    return NextResponse.json({ error: error.message || "Error al subir la imagen" }, { status: 500 });
  }
}
