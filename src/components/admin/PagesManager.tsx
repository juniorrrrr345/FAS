'use client';

import { useState, useEffect, useRef } from 'react';

interface PageContent {
  slug: string;
  title: string;
  content: string;
}

export default function PagesManager() {
  const [activeTab, setActiveTab] = useState<'info' | 'contact'>('info');
  const [pageContent, setPageContent] = useState({
    info: { title: 'Page Info', content: '' },
    contact: { title: 'Page Contact', content: '' }
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Charger les pages
  const loadPages = async () => {
    try {
      setIsLoading(true);
      console.log('📄 Chargement des pages...');
      
      const [infoRes, contactRes] = await Promise.all([
        fetch('/api/pages/info').catch(err => {
          console.error('Erreur fetch info:', err);
          return { ok: false, json: () => ({ title: 'À propos', content: '' }) };
        }),
        fetch('/api/pages/contact').catch(err => {
          console.error('Erreur fetch contact:', err);
          return { ok: false, json: () => ({ title: 'Contact', content: '' }) };
        })
      ]);
      
      console.log('Réponses API:', { info: infoRes.ok, contact: contactRes.ok });
      
      const [infoData, contactData] = await Promise.all([
        infoRes.json(),
        contactRes.json()
      ]);
      
      console.log('Données reçues:', { 
        info: infoData.title, 
        contact: contactData.title 
      });
      
      setPageContent({
        info: {
          title: infoData.title || 'À propos',
          content: infoData.content || ''
        },
        contact: {
          title: contactData.title || 'Contact',
          content: contactData.content || ''
        }
      });
    } catch (error) {
      console.error('❌ Erreur chargement pages:', error);
      setSaveStatus('❌ Erreur de chargement');
      
      // Définir des valeurs par défaut en cas d'erreur
      setPageContent({
        info: { title: 'À propos', content: '' },
        contact: { title: 'Contact', content: '' }
      });
      
      setTimeout(() => setSaveStatus(''), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  // Sauvegarder
  const savePage = async (showStatus = true) => {
    try {
      setIsSaving(true);
      if (showStatus) setSaveStatus('Sauvegarde en cours...');
      
      const page = pageContent[activeTab];
      
      // Calculer la taille approximative du contenu
      const contentSize = new TextEncoder().encode(JSON.stringify({
        title: page.title,
        content: page.content
      })).length;
      
      console.log(`📏 Taille du contenu à sauvegarder: ${(contentSize / 1024).toFixed(2)} KB`);
      
      const response = await fetch(`/api/pages/${activeTab}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        },
        body: JSON.stringify({
          title: page.title,
          content: page.content
        })
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        setHasChanges(false);
        if (showStatus) {
          const sizeInfo = result.size ? ` (${result.size})` : '';
          setSaveStatus(`✅ Sauvegardé avec succès !${sizeInfo}`);
          setTimeout(() => setSaveStatus(''), 3000);
        }
        
        // Invalider le cache pour forcer le rechargement
        try {
          await fetch('/api/cache/invalidate', { method: 'POST' });
        } catch (e) {
          console.log('Cache invalidation skipped');
        }
        
        // Mettre à jour le localStorage pour synchronisation immédiate
        localStorage.setItem(`${activeTab}Page`, JSON.stringify({
          title: page.title,
          content: page.content
        }));
      } else {
        // Gestion des erreurs spécifiques
        if (response.status === 413) {
          setSaveStatus(`❌ ${result.error || 'Contenu trop volumineux'}`);
          console.error('Contenu trop volumineux:', contentSize / 1024 / 1024, 'MB');
        } else {
          setSaveStatus(`❌ Erreur: ${result.error || 'Erreur inconnue'}`);
        }
        setTimeout(() => setSaveStatus(''), 5000);
      }
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
      setSaveStatus('❌ Erreur de connexion');
      setTimeout(() => setSaveStatus(''), 5000);
    } finally {
      setIsSaving(false);
    }
  };

  // Sauvegarde automatique après 2 secondes d'inactivité
  const handleContentChange = (field: 'title' | 'content', value: string) => {
    setPageContent(prev => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        [field]: value
      }
    }));
    setHasChanges(true);

    // Annuler la sauvegarde automatique précédente
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Programmer une nouvelle sauvegarde automatique
    saveTimeoutRef.current = setTimeout(() => {
      savePage(false);
    }, 2000);
  };

  // Calculer la taille du contenu actuel
  const getContentSize = () => {
    const page = pageContent[activeTab];
    const size = new TextEncoder().encode(JSON.stringify({
      title: page.title,
      content: page.content
    })).length;
    
    if (size < 1024) {
      return `${size} B`;
    } else if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(1)} KB`;
    } else {
      return `${(size / 1024 / 1024).toFixed(2)} MB`;
    }
  };


  useEffect(() => {
    loadPages();
    
    // Timeout de sécurité pour éviter le chargement infini
    const timeout = setTimeout(() => {
      if (isLoading) {
        console.warn('⚠️ Chargement trop long, forçage arrêt');
        setIsLoading(false);
        setSaveStatus('⚠️ Chargement interrompu');
        setTimeout(() => setSaveStatus(''), 3000);
      }
    }, 10000); // 10 secondes max
    
    return () => clearTimeout(timeout);
  }, []);

  // Nettoyer le timeout de sauvegarde au démontage
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  const currentPage = pageContent[activeTab];

  if (isLoading) {
    return (
      <div className="bg-black/50 backdrop-blur-md rounded-lg p-6 border border-white/10">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="text-gray-400 mt-4">Chargement des pages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black/50 backdrop-blur-md rounded-lg p-6 border border-white/10">
      <h2 className="text-2xl font-bold text-white mb-6">📄 Gestion des Pages</h2>

      {/* Onglets */}
      <div className="flex space-x-4 mb-6 border-b border-white/20">
        <button
          onClick={() => setActiveTab('info')}
          className={`pb-3 px-1 text-sm font-medium transition-colors ${
            activeTab === 'info' ? 'text-white border-b-2 border-white' : 'text-gray-400 hover:text-white'
          }`}
        >
          📖 Page Info
        </button>
        <button
          onClick={() => setActiveTab('contact')}
          className={`pb-3 px-1 text-sm font-medium transition-colors ${
            activeTab === 'contact' ? 'text-white border-b-2 border-white' : 'text-gray-400 hover:text-white'
          }`}
        >
          📞 Page Contact
        </button>
      </div>

      {/* Contenu principal */}
      <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/10">
        {/* Titre de la page */}
        <div className="mb-4">
          <label className="block text-gray-400 text-sm font-medium mb-2">
            Titre de la page
          </label>
          <input
            type="text"
            value={pageContent[activeTab].title}
            onChange={(e) => handleContentChange('title', e.target.value)}
            className="w-full px-4 py-3 bg-black/50 text-white rounded-xl border border-white/10 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
            placeholder="Titre de la page"
          />
        </div>

        {/* Contenu de la page */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-gray-400 text-sm font-medium">
              Contenu (Markdown supporté)
            </label>
            <span className="text-xs text-gray-500">
              Taille: {getContentSize()}
            </span>
          </div>
          <textarea
            value={pageContent[activeTab].content}
            onChange={(e) => handleContentChange('content', e.target.value)}
            className="w-full px-4 py-3 bg-black/50 text-white rounded-xl border border-white/10 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-mono text-sm"
            rows={15}
            placeholder={`Contenu de la page ${activeTab}...`}
          />
          <p className="text-xs text-gray-500 mt-2">
            💡 Utilisez **texte** pour du gras, *texte* pour de l'italique, # pour les titres
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 mt-6">
          <button
            onClick={() => savePage(true)}
            disabled={isSaving || !hasChanges}
            className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
              isSaving || !hasChanges
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg hover:shadow-blue-500/25 hover:scale-105 active:scale-95'
            }`}
          >
            {isSaving ? '💾 Sauvegarde...' : hasChanges ? '💾 Sauvegarder maintenant' : '✅ Sauvegardé'}
          </button>
          {hasChanges && !isSaving && (
            <span className="text-xs text-gray-400">
              Sauvegarde automatique dans 2s...
            </span>
          )}
          {isSaving && !saveStatus && (
            <span className="text-xs text-yellow-400">
              Sauvegarde en cours...
            </span>
          )}
          {saveStatus && (
            <span className={`text-sm font-medium ${
              saveStatus.includes('✅') ? 'text-green-400' : 'text-red-400'
            }`}>
              {saveStatus}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}