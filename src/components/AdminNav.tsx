"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function AdminNav({ name }: { name: string }) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image
            src="/inatro_logo.png"
            alt="INATRO"
            width={90}
            height={45}
            className="object-contain"
          />
          <span className="text-sm font-semibold text-gray-600 hidden sm:block">
            Sistema de Gestao de Cartas
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600 hidden sm:block">
            {name}
          </span>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            Sair
          </button>
        </div>
      </div>
    </nav>
  );
}
