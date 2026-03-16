import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";
import connectDB from "@/lib/mongodb";
import Carta from "@/lib/models/Carta";
import { getSessionFromCookies } from "@/lib/auth";

export async function POST(req: NextRequest) {
  // Auth check
  const session = await getSessionFromCookies();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const delegacao = (formData.get("delegacao") as string) || "";
    const lote = (formData.get("lote") as string) || "";

    if (!file) {
      return NextResponse.json(
        { error: "Nenhum ficheiro enviado." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows: Record<string, unknown>[] = XLSX.utils.sheet_to_json(sheet, {
      defval: "",
    });

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Ficheiro vazio ou formato inválido." },
        { status: 400 }
      );
    }

    await connectDB();

    // Normalise rows — handle flexible column headers
    const cartas = rows
      .map((row) => {
        // Try multiple possible column name variants
        const numeroCarta = String(
          row["Nº da Carta"] ??
            row["N° da Carta"] ??
            row["No da Carta"] ??
            row["NumeroCarta"] ??
            row["numero"] ??
            ""
        ).trim();

        const nome = String(
          row["Nome"] ?? row["nome"] ?? row["NOME"] ?? ""
        ).trim();

        const ano = Number(row["Ano"] ?? row["ANO"] ?? row["ano"] ?? 0);

        const rowObs = String(
          row["OBS"] ?? row["Obs"] ?? row["obs"] ?? ""
        ).trim();

        if (!numeroCarta || !nome) return null;

        return {
          numeroCarta,
          nome,
          ano: isNaN(ano) ? 0 : ano,
          lote: lote || String(row["Lote"] ?? row["LOTE"] ?? "").trim(),
          delegacao:
            delegacao ||
            String(row["Delegacao"] ?? row["Delegação"] ?? "").trim(),
          obs: rowObs,
        };
      })
      .filter(Boolean);

    if (cartas.length === 0) {
      return NextResponse.json(
        {
          error:
            "Não foi possível extrair registos. Verifique os cabeçalhos do ficheiro.",
        },
        { status: 400 }
      );
    }

    // Upsert by numeroCarta
    let inserted = 0;
    let updated = 0;
    for (const carta of cartas) {
      if (!carta) continue;
      const result = await Carta.updateOne(
        { numeroCarta: carta.numeroCarta },
        { $set: carta },
        { upsert: true }
      );
      if (result.upsertedCount) inserted++;
      else if (result.modifiedCount) updated++;
    }

    return NextResponse.json({
      success: true,
      total: cartas.length,
      inserted,
      updated,
    });
  } catch (err) {
    console.error("[cartas/upload]", err);
    return NextResponse.json({ error: "Erro ao processar ficheiro." }, { status: 500 });
  }
}
