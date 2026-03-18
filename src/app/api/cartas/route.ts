import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Carta from "@/lib/models/Carta";
import { getSessionFromCookies } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await getSessionFromCookies();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const { searchParams } = req.nextUrl;
  const numero = searchParams.get("numero")?.trim() || "";
  const nome = searchParams.get("nome")?.trim() || "";
  const delegacao = searchParams.get("delegacao")?.trim() || "";
  const entregueFilter = searchParams.get("entregue"); // "sim" | "nao" | null
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.min(100, parseInt(searchParams.get("limit") || "20"));

  try {
    await connectDB();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: Record<string, any> = {};
    if (numero) filter.numeroCarta = { $regex: numero, $options: "i" };
    if (nome) filter.nome = { $regex: nome, $options: "i" };
    if (delegacao) filter.delegacao = { $regex: delegacao, $options: "i" };
    if (entregueFilter === "sim") filter.entregue = true;
    if (entregueFilter === "nao") filter.entregue = { $ne: true };

    const total = await Carta.countDocuments(filter);
    const cartas = await Carta.find(filter)
      .sort({ nome: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return NextResponse.json({ cartas, total, page, limit });
  } catch (err) {
    console.error("[cartas/list]", err);
    return NextResponse.json({ error: "Erro interno." }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const session = await getSessionFromCookies();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const { id, entregue } = await req.json();
  if (!id) {
    return NextResponse.json({ error: "ID obrigatório." }, { status: 400 });
  }

  try {
    await connectDB();
    const carta = await Carta.findByIdAndUpdate(
      id,
      { entregue, entregueEm: entregue ? new Date() : null },
      { new: true }
    ).lean();
    if (!carta) return NextResponse.json({ error: "Carta não encontrada." }, { status: 404 });
    return NextResponse.json({ success: true, carta });
  } catch (err) {
    console.error("[cartas/patch]", err);
    return NextResponse.json({ error: "Erro interno." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getSessionFromCookies();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const { searchParams } = req.nextUrl;
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "ID obrigatório." }, { status: 400 });
  }

  try {
    await connectDB();
    await Carta.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[cartas/delete]", err);
    return NextResponse.json({ error: "Erro interno." }, { status: 500 });
  }
}
