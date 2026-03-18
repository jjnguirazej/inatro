"use client";

import { useState, useEffect, FormEvent } from "react";

interface User {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  createdAt: string;
}

export default function UtilizadoresPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // form
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "user">("admin");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  async function fetchUsers() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      setUsers(data.users || []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchUsers(); }, []);

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setSuccessMsg("");
    setErrorMsg("");
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Erro ao criar utilizador.");
      } else {
        setSuccessMsg(`Utilizador "${data.user.name}" criado com sucesso!`);
        setName("");
        setEmail("");
        setPassword("");
        setRole("admin");
        fetchUsers();
      }
    } catch {
      setErrorMsg("Erro de rede.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string, userName: string) {
    if (!confirm(`Eliminar o utilizador "${userName}"?`)) return;
    const res = await fetch(`/api/admin/users?id=${id}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) {
      alert(data.error || "Erro ao eliminar.");
    } else {
      fetchUsers();
    }
  }

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-800">Gestão de Utilizadores</h2>

      {/* Formulário de criação */}
      <section className="bg-white rounded-2xl shadow p-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Adicionar Utilizador</h3>
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Nome completo</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: José Muchunja"
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-green-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ex: nome@inatro.gov.mz"
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-green-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Senha</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Senha de acesso"
                  required
                  minLength={6}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 outline-none focus:ring-2 focus:ring-green-500 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
                >
                  {showPassword ? "Ocultar" : "Ver"}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Perfil</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as "admin" | "user")}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-green-500 text-sm bg-white"
              >
                <option value="admin">Administrador</option>
                <option value="user">Utilizador</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="bg-green-700 hover:bg-green-800 disabled:opacity-60 text-white font-bold px-6 py-2.5 rounded-lg transition-colors text-sm"
          >
            {submitting ? "A criar..." : "Criar Utilizador"}
          </button>

          {successMsg && <p className="text-green-700 text-sm font-medium">{successMsg}</p>}
          {errorMsg && <p className="text-red-600 text-sm">{errorMsg}</p>}
        </form>
      </section>

      {/* Lista de utilizadores */}
      <section className="bg-white rounded-2xl shadow p-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          Utilizadores Registados ({users.length})
        </h3>
        {loading ? (
          <p className="text-gray-400 text-sm">A carregar...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                <tr>
                  <th className="px-4 py-3">Nome</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Perfil</th>
                  <th className="px-4 py-3">Criado em</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center text-gray-400">
                      Nenhum utilizador encontrado.
                    </td>
                  </tr>
                )}
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-800">{u.name}</td>
                    <td className="px-4 py-3 text-gray-600">{u.email}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${
                        u.role === "admin"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}>
                        {u.role === "admin" ? "Administrador" : "Utilizador"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(u.createdAt).toLocaleDateString("pt-PT")}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleDelete(u._id, u.name)}
                        className="text-red-500 hover:text-red-700 text-xs font-medium"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
