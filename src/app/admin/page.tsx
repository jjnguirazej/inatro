"use client";

import { useState, useEffect, FormEvent } from "react";

interface Carta {
  _id: string;
  numeroCarta: string;
  nome: string;
  ano: number;
  lote?: string;
  delegacao?: string;
  obs?: string;
  entregue: boolean;
  entregueEm?: string;
}

export default function AdminPage() {
  const [cartas, setCartas] = useState<Carta[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const limit = 20;

  // search filters
  const [filterNumero, setFilterNumero] = useState("");
  const [filterNome, setFilterNome] = useState("");
  const [filterDelegacao, setFilterDelegacao] = useState("");
  const [filterEntregue, setFilterEntregue] = useState<"" | "sim" | "nao">("");

  // upload state
  const [file, setFile] = useState<File | null>(null);
  const [uploadDelegacao, setUploadDelegacao] = useState("");
  const [uploadLote, setUploadLote] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState("");
  const [uploadError, setUploadError] = useState("");

  const [loading, setLoading] = useState(false);

  async function fetchCartas(p = page) {
    setLoading(true);
    const params = new URLSearchParams({
      page: String(p),
      limit: String(limit),
    });
    if (filterNumero) params.set("numero", filterNumero);
    if (filterNome) params.set("nome", filterNome);
    if (filterDelegacao) params.set("delegacao", filterDelegacao);
    if (filterEntregue) params.set("entregue", filterEntregue);

    try {
      const res = await fetch("/api/cartas?" + params.toString());
      const data = await res.json();
      setCartas(data.cartas || []);
      setTotal(data.total || 0);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCartas(1);
    setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterNumero, filterNome, filterDelegacao, filterEntregue]);

  async function handleUpload(e: FormEvent) {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    setUploadMsg("");
    setUploadError("");
    const fd = new FormData();
    fd.append("file", file);
    fd.append("delegacao", uploadDelegacao);
    fd.append("lote", uploadLote);
    try {
      const res = await fetch("/api/cartas/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) {
        setUploadError(data.error || "Erro ao fazer upload.");
      } else {
        setUploadMsg(
          `Upload concluído: ${data.total} registos (${data.inserted} novos inseridos, ${data.skipped} já existentes ignorados)`
        );
        fetchCartas(1);
      }
    } catch {
      setUploadError("Erro de rede.");
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Eliminar este registo?")) return;
    await fetch("/api/cartas?id=" + id, { method: "DELETE" });
    fetchCartas(page);
  }

  async function handleToggleEntregue(id: string, atual: boolean) {
    const novoEstado = !atual;
    const label = novoEstado ? "marcar como entregue" : "marcar como não entregue";
    if (!confirm(`Confirmas ${label}?`)) return;
    await fetch("/api/cartas", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, entregue: novoEstado }),
    });
    fetchCartas(page);
  }

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-800">Painel de Administracao</h2>

      {/* Upload section */}
      <section className="bg-white rounded-2xl shadow p-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Importar Ficheiro</h3>
        <form onSubmit={handleUpload} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Ficheiro (.xls / .xlsx / .csv)</label>
              <input
                type="file"
                accept=".xls,.xlsx,.csv"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="block w-full text-sm text-gray-600 border border-gray-300 rounded-lg px-3 py-2 cursor-pointer"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Delegacao</label>
              <input
                type="text"
                value={uploadDelegacao}
                onChange={(e) => setUploadDelegacao(e.target.value)}
                placeholder="Ex: Sofala"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-green-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Lote (opcional)</label>
              <input
                type="text"
                value={uploadLote}
                onChange={(e) => setUploadLote(e.target.value)}
                placeholder="Ex: 12000"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-green-500 text-sm"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={uploading}
            className="bg-green-700 hover:bg-green-800 disabled:opacity-60 text-white font-bold px-6 py-2.5 rounded-lg transition-colors text-sm"
          >
            {uploading ? "A carregar..." : "Importar Ficheiro"}
          </button>
          {uploadMsg && (
            <p className="text-green-700 text-sm font-medium">{uploadMsg}</p>
          )}
          {uploadError && (
            <p className="text-red-600 text-sm">{uploadError}</p>
          )}
        </form>
      </section>

      {/* Search & list */}
      <section className="bg-white rounded-2xl shadow p-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          Pesquisar Cartas ({total} registos)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-6">
          <input
            type="text"
            placeholder="Nr. Carta"
            value={filterNumero}
            onChange={(e) => setFilterNumero(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-green-500 text-sm"
          />
          <input
            type="text"
            placeholder="Nome"
            value={filterNome}
            onChange={(e) => setFilterNome(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-green-500 text-sm"
          />
          <input
            type="text"
            placeholder="Delegacao"
            value={filterDelegacao}
            onChange={(e) => setFilterDelegacao(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-green-500 text-sm"
          />
          <select
            value={filterEntregue}
            onChange={(e) => setFilterEntregue(e.target.value as "" | "sim" | "nao")}
            className="border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-green-500 text-sm bg-white"
          >
            <option value="">Todos os estados</option>
            <option value="sim">✅ Entregues</option>
            <option value="nao">⏳ Não entregues</option>
          </select>
        </div>

        {loading ? (
          <p className="text-gray-400 text-sm">A carregar...</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                  <tr>
                    <th className="px-4 py-3">Nr. Carta</th>
                    <th className="px-4 py-3">Nome</th>
                    <th className="px-4 py-3">Ano</th>
                    <th className="px-4 py-3">Lote</th>
                    <th className="px-4 py-3">Delegacao</th>
                    <th className="px-4 py-3">OBS</th>
                    <th className="px-4 py-3">Estado</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {cartas.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-4 py-6 text-center text-gray-400">
                        Nenhum registo encontrado.
                      </td>
                    </tr>
                  )}
                  {cartas.map((c) => (
                    <tr key={c._id} className={`hover:bg-gray-50 ${c.entregue ? "bg-green-50" : ""}`}>
                      <td className="px-4 py-3 font-mono text-gray-700">{c.numeroCarta}</td>
                      <td className="px-4 py-3 text-gray-800">{c.nome}</td>
                      <td className="px-4 py-3 text-gray-600">{c.ano || "-"}</td>
                      <td className="px-4 py-3 text-gray-600">{c.lote || "-"}</td>
                      <td className="px-4 py-3 text-gray-600">{c.delegacao || "-"}</td>
                      <td className="px-4 py-3 text-gray-500 italic">{c.obs || "-"}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleToggleEntregue(c._id, c.entregue)}
                          title={c.entregue && c.entregueEm ? `Entregue em ${new Date(c.entregueEm).toLocaleDateString("pt-PT")}` : "Marcar como entregue"}
                          className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full transition-colors ${
                            c.entregue
                              ? "bg-green-100 text-green-700 hover:bg-green-200"
                              : "bg-gray-100 text-gray-500 hover:bg-yellow-100 hover:text-yellow-700"
                          }`}
                        >
                          {c.entregue ? "✅ Entregue" : "⏳ Pendente"}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleDelete(c._id)}
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <button
                  onClick={() => {
                    const p = Math.max(1, page - 1);
                    setPage(p);
                    fetchCartas(p);
                  }}
                  disabled={page === 1}
                  className="px-3 py-1.5 text-sm border rounded-lg disabled:opacity-40 hover:bg-gray-50"
                >
                  Anterior
                </button>
                <span className="text-sm text-gray-500">
                  Pagina {page} de {totalPages}
                </span>
                <button
                  onClick={() => {
                    const p = Math.min(totalPages, page + 1);
                    setPage(p);
                    fetchCartas(p);
                  }}
                  disabled={page === totalPages}
                  className="px-3 py-1.5 text-sm border rounded-lg disabled:opacity-40 hover:bg-gray-50"
                >
                  Seguinte
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
