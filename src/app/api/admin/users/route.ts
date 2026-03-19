import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongodb";
import User from "@/lib/models/User";
import { getSessionFromCookies } from "@/lib/auth";

async function requireAdmin() {
  const session = await getSessionFromCookies();
  if (!session || session.role !== "admin") return null;
  return session;
}

// GET — listar todos os utilizadores
export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }
  await connectDB();
  const users = await User.find({}, { password: 0 }).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ users });
}

// POST — criar novo utilizador
export async function POST(req: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const { name, email, password, role } = await req.json();
  if (!name || !email || !password) {
    return NextResponse.json({ error: "Nome, email e senha são obrigatórios." }, { status: 400 });
  }

  await connectDB();
  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists) {
    return NextResponse.json({ error: "Já existe um utilizador com este email." }, { status: 409 });
  }

  const hashed = await bcrypt.hash(password, 12);
  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password: hashed,
    role: role === "user" ? "user" : "admin",
  });

  return NextResponse.json({
    success: true,
    user: { _id: user._id, name: user.name, email: user.email, role: user.role },
  });
}

// DELETE — eliminar utilizador por id
export async function DELETE(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "ID em falta." }, { status: 400 });
  }

  await connectDB();
  const target = await User.findById(id);
  if (!target) {
    return NextResponse.json({ error: "Utilizador não encontrado." }, { status: 404 });
  }
  if (target.email === session.email) {
    return NextResponse.json({ error: "Não podes eliminar a tua própria conta." }, { status: 400 });
  }

  await User.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
