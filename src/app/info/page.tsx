'use client';

import { useState, useEffect } from 'react';
import InfoPage from '@/components/InfoPage';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';

export default function InfoPageRoute() {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContent();

    // Écouter les changements dans localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'infoPage' && e.newValue) {
        const data = JSON.parse(e.newValue);
        setContent(data.content || '');
      }
    };

    // Écouter les invalidations de cache
    const handleCacheInvalidation = () => {
      loadContent();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('cacheInvalidated', handleCacheInvalidation);

    // Recharger périodiquement pour s'assurer de la synchronisation
    const interval = setInterval(loadContent, 30000); // toutes les 30 secondes

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cacheInvalidated', handleCacheInvalidation);
      clearInterval(interval);
    };
  }, []);

  const loadContent = async () => {
    try {
      // Essayer d'abord depuis localStorage pour chargement instantané
      const cached = localStorage.getItem('infoPage');
      if (cached) {
        const data = JSON.parse(cached);
        setContent(data.content || '');
      }

      // Puis charger depuis l'API
      const response = await fetch('/api/pages/info', {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setContent(data.content || '');
        // Mettre à jour le localStorage
        localStorage.setItem('infoPage', JSON.stringify(data));
      }
    } catch (error) {
      console.error('Erreur chargement info:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-container">
      {/* Overlay global toujours présent */}
      <div className="global-overlay"></div>
      
      {/* Contenu principal */}
      <div className="content-layer">
        <Header />
        <div className="pt-12 sm:pt-14">
          <div className="h-4 sm:h-6"></div>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
          ) : (
            <InfoPage content={content} />
          )}
        </div>
      </div>
      
      {/* BottomNav */}
      <BottomNav />
    </div>
  );
}