"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Cache Buster Component
 * Adiciona timestamp automático a todas as navegações
 * para garantir que sempre pegue conteúdo atualizado do servidor
 */
export default function CacheBuster() {
  const router = useRouter();
  
  useEffect(() => {
    const buildTime = process.env.NEXT_PUBLIC_BUILD_TIME || Date.now();
    
    // Adiciona timestamp à URL atual se não tiver
    const addTimestamp = () => {
      const url = new URL(window.location.href);
      if (!url.searchParams.has('v')) {
        url.searchParams.set('v', buildTime.toString());
        window.history.replaceState({}, '', url.toString());
      }
    };
    
    // Executa no mount
    addTimestamp();
    
    // Intercepta cliques em links
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');
      
      if (link && link.href && link.href.startsWith(window.location.origin)) {
        e.preventDefault();
        const url = new URL(link.href);
        url.searchParams.set('v', buildTime.toString());
        router.push(url.pathname + url.search);
      }
    };
    
    document.addEventListener('click', handleClick);
    
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [router]);
  
  return null; // Componente invisível
}
