"use client";

import { useState, FormEvent } from "react";
import Image from "next/image";

interface CartaResult {
  numeroCarta: string;
  nome: string;
  ano: number;
  lote?: string;
  delegacao?: string;
  obs?: string;
}

export default function HomePage() {
  const [numero, setNumero] = useState("");
  const [loading, setLoading] = useState(false);
  const [found, setFound] = useState<boolean | null>(null);
  const [carta, setCarta] = useState<CartaResult | null>(null);
  const [error, setError] = useState("");

  async function handleSearch(e: FormEvent) {
    e.preventDefault();
    if (!numero.trim()) return;
    setLoading(true);
    setFound(null);
    setCarta(null);
    setError("");
    try {
      const res = await fetch(
        "/api/cartas/search?numero=" + encodeURIComponent(numero.trim())
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Erro na pesquisa.");
      } else {
        setFound(data.found);
        if (data.found) setCarta(data.carta);
      }
    } catch {
      setError("Nao foi possivel conectar ao servidor.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8">
        <div className="flex flex-col items-center mb-6">
          <Image
            src="/inatro_logo.png"
            alt="INATRO Logo"
            width={160}
            height={80}
            className="object-contain mb-3"
            priority
          />
          <h1 className="text-center font-bold text-gray-800 text-lg leading-tight">
            DELEGAÇÃO DA PROVÍNCIA DE SOFALA
          </h1>
          <span className="mt-2 px-3 py-1 rounded-full text-sm font-semibold text-white bg-yellow-500">
            Aviso: Apenas para Utentes desta Delegação
          </span>
        </div>

        <p className="text-center text-gray-600 mb-6">
          Insira o número da sua carta para verificar o estado de disponibilidade.
        </p>

        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-green-500">
            <span className="px-3 text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </span>
            <input
              type="text"
              value={numero}
              onChange={(e) => setNumero(e.target.value)}
              placeholder="Número da Carta"
              className="flex-1 py-3 px-2 outline-none text-gray-700 bg-transparent"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-green-700 hover:bg-green-800 disabled:opacity-60 text-white font-bold py-3 rounded-lg transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            {loading ? "A pesquisar..." : "PESQUISAR CARTA"}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm text-center">
            {error}
          </div>
        )}

        {found === false && (
          <div className="mt-4 p-4 border border-red-300 bg-red-50 rounded-lg text-center">
            <p className="text-red-700 font-semibold">Carta não encontrada.</p>
            <p className="text-red-600 text-sm mt-1">
              O número <strong>{numero}</strong> não consta na nossa lista.
            </p>
          </div>
        )}

        {found === true && carta && (
          <div className="mt-4 space-y-3">
            <div className="border border-gray-200 rounded-lg p-4 text-center">
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                UTENTE ENCONTRADO:
              </p>
              <p className="text-green-700 font-bold text-lg mt-1">
                {carta.nome}
              </p>
            </div>
            <p className="text-center text-gray-600 text-sm">
              Sua carta encontra-se disponível nos seguintes locais:
            </p>
            <div className="border-2 border-dashed border-green-300 bg-green-50 rounded-lg p-3 flex items-center justify-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-green-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span className="font-semibold text-green-800">
                {carta.lote
                  ? "LOTE: " + carta.lote
                  : carta.delegacao || "Consulte a delegação"}
              </span>
            </div>
            {carta.delegacao && (
              <p className="text-center text-gray-500 text-sm">
                Por favor, dirija-se à Delegação Provincial de{" "}
                <strong>{carta.delegacao}</strong>.
              </p>
            )}
            {carta.obs && (
              <p className="text-center text-gray-400 text-xs italic">
                {carta.obs}
              </p>
            )}
          </div>
        )}
      </div>

      <p className="mt-6 text-sm text-gray-400">
        Administrador?{" "}
        <a href="/login" className="text-green-700 hover:underline">
          Entrar aqui
        </a>
      </p>
    </main>
  );
}
