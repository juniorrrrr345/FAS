'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';

interface SocialLink {
  _id: string;
  name: string;
  url: string;
  icon: string;
  color: string;
  isActive: boolean;
}

export default function SocialPage() {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [shopTitle, setShopTitle] = useState('FAS Boutique');

  useEffect(() => {
    loadData();

    // Écouter les changements dans localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'socialLinks' && e.newValue) {
        setSocialLinks(JSON.parse(e.newValue));
      } else if (e.key === 'shopSettings' && e.newValue) {
        const settings = JSON.parse(e.newValue);
        setShopTitle(settings.shopTitle || 'FAS Boutique');
      }
    };

    // Écouter les invalidations de cache
    const handleCacheInvalidation = () => {
      loadData();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('cacheInvalidated', handleCacheInvalidation);
    window.addEventListener('socialLinksUpdated', loadData);

    // Recharger périodiquement
    const interval = setInterval(loadData, 30000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cacheInvalidated', handleCacheInvalidation);
      window.removeEventListener('socialLinksUpdated', loadData);
      clearInterval(interval);
    };
  }, []);

  const loadData = async () => {
    try {
      // Charger depuis localStorage d'abord
      const cachedLinks = localStorage.getItem('socialLinks');
      if (cachedLinks) {
        setSocialLinks(JSON.parse(cachedLinks));
      }

      const cachedSettings = localStorage.getItem('shopSettings');
      if (cachedSettings) {
        const settings = JSON.parse(cachedSettings);
        setShopTitle(settings.shopTitle || 'FAS Boutique');
      }

      // Puis charger depuis l'API
      const [linksRes, settingsRes] = await Promise.all([
        fetch('/api/social-links', {
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        }),
        fetch('/api/settings', {
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        })
      ]);

      if (linksRes.ok) {
        const links = await linksRes.json();
        setSocialLinks(links.filter((link: SocialLink) => link.isActive));
        localStorage.setItem('socialLinks', JSON.stringify(links));
      }

      if (settingsRes.ok) {
        const settings = await settingsRes.json();
        setShopTitle(settings.shopTitle || 'FAS Boutique');
      }
    } catch (error) {
      console.error('Erreur chargement réseaux sociaux:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-container">
      <div className="global-overlay"></div>
      
      <div className="content-layer">
        <Header />
        <div className="pt-12 sm:pt-14">
          <div className="h-4 sm:h-6"></div>
          
          <div className="container mx-auto px-4 py-8 max-w-4xl pb-safe-bottom">
            {/* Titre de la page */}
            <div className="text-center mb-12">
              <h1 className="shop-title text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4">
                Nos Réseaux Sociaux
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-6"></div>
              <p className="text-gray-300 text-lg">
                Rejoignez <span className="text-yellow-400">{shopTitle}</span> sur nos réseaux sociaux
              </p>
            </div>

            {/* Grille des réseaux sociaux */}
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
              </div>
            ) : socialLinks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {socialLinks.map((link) => (
                  <a
                    key={link._id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative bg-black/40 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/30 transition-all duration-300 transform hover:scale-105"
                    style={{
                      borderColor: `${link.color}40`,
                    }}
                  >
                    {/* Fond coloré au hover */}
                    <div 
                      className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                      style={{ backgroundColor: link.color }}
                    />
                    
                    {/* Contenu */}
                    <div className="relative z-10 flex flex-col items-center text-center">
                      <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                        {link.icon}
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">
                        {link.name}
                      </h3>
                      <div 
                        className="text-sm font-medium px-4 py-1 rounded-full"
                        style={{
                          backgroundColor: `${link.color}20`,
                          color: link.color,
                          borderWidth: '1px',
                          borderColor: `${link.color}40`
                        }}
                      >
                        Suivre →
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-12">
                <p className="text-lg">Aucun réseau social disponible pour le moment</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <BottomNav />
    </div>
  );
}