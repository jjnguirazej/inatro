import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Carta from "@/lib/models/Carta";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const numero = searchParams.get("numero")?.trim();

  if (!numero) {
    return NextResponse.json(
      { error: "Número da carta é obrigatório." },
      { status: 400 }
    );
  }

  try {
    await connectDB();

    const carta = await Carta.findOne({ numeroCarta: numero });

    if (!carta) {
      return NextResponse.json({ found: false }, { status: 200 });
    }

    return NextResponse.json({
      found: true,
      carta: {
        numeroCarta: carta.numeroCarta,
        nome: carta.nome,
        ano: carta.ano,
        lote: carta.lote,
        delegacao: carta.delegacao,
        obs: carta.obs,
      },
    });
  } catch (err) {
    console.error("[cartas/search]", err);
    return NextResponse.json({ error: "Erro interno." }, { status: 500 });
  }
}
