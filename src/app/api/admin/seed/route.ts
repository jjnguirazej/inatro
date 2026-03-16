import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongodb";
import User from "@/lib/models/User";

// One-time seed route — protect with a secret token via env
export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("x-seed-secret");
  if (authHeader !== process.env.SEED_SECRET) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const { name, email, password } = await req.json();
  if (!name || !email || !password) {
    return NextResponse.json({ error: "Campos obrigatórios em falta." }, { status: 400 });
  }

  await connectDB();
  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists) {
    return NextResponse.json({ error: "Utilizador já existe." }, { status: 409 });
  }

  const hashed = await bcrypt.hash(password, 12);
  await User.create({ name, email: email.toLowerCase(), password: hashed, role: "admin" });

  return NextResponse.json({ success: true, message: "Admin criado com sucesso." });
}
