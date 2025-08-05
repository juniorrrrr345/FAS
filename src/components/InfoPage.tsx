'use client';

interface InfoPageProps {
  content: string;
}

export default function InfoPage({ content }: InfoPageProps) {
  const parseMarkdown = (text: string) => {
    // Échapper les caractères HTML dangereux tout en préservant les emojis et symboles
    const escapeHtml = (str: string) => {
      return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    };

    // Parser le markdown avec support amélioré
    let parsed = escapeHtml(text);
    
    // Headers
    parsed = parsed
      .replace(/^# (.+)$/gm, '<h1 class="text-2xl sm:text-3xl font-bold text-white mb-6 text-center">$1</h1>')
      .replace(/^## (.+)$/gm, '<h2 class="text-xl sm:text-2xl font-bold text-white mb-4 mt-8">$1</h2>')
      .replace(/^### (.+)$/gm, '<h3 class="text-lg sm:text-xl font-bold text-white mb-3 mt-6">$1</h3>');
    
    // Styles de texte
    parsed = parsed
      .replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold text-white">$1</strong>')
      .replace(/\*(.+?)\*/g, '<em class="italic text-gray-300">$1</em>')
      .replace(/`(.+?)`/g, '<code class="bg-gray-800 px-2 py-1 rounded text-green-400 text-sm">$1</code>');
    
    // Listes avec support des tabulations et puces spéciales
    parsed = parsed
      // Listes avec tabulations (convertir les tabs en espaces)
      .replace(/^\t+•\s*(.+)$/gm, (match, p1) => {
        const tabs = match.match(/^\t+/)?.[0].length || 0;
        const indent = tabs * 20;
        return `<li class="ml-${indent} text-gray-300 mb-1">• ${p1}</li>`;
      })
      // Listes avec tirets
      .replace(/^-\s+(.+)$/gm, '<li class="ml-4 text-gray-300 mb-1">• $1</li>')
      // Listes numérotées
      .replace(/^(\d+)\.\s+(.+)$/gm, '<li class="ml-4 text-gray-300 mb-1">$1. $2</li>')
      // Symboles de flèche
      .replace(/➤\s*(.+)$/gm, '<div class="ml-8 text-gray-300 mb-1">➤ $1</div>')
      .replace(/→\s*(.+)$/gm, '<div class="ml-8 text-gray-300 mb-1">→ $1</div>');
    
    // Lignes de séparation
    parsed = parsed.replace(/^⸻+$/gm, '<hr class="border-t border-white/20 my-6">');
    
    // Sections spéciales avec emojis
    parsed = parsed.replace(/^(🔹|🔸|🆓|✅|✔️|❌|⚠️|📦|🚚|💳|🕐|🏠|🎁)\s*(.+)$/gm, 
      '<div class="flex items-start gap-2 mb-2"><span class="text-xl">$1</span><span class="text-gray-300">$2</span></div>');
    
    // Gestion des sauts de ligne
    parsed = parsed
      .replace(/\n\n+/g, '</p><p class="mb-4">')
      .replace(/\n/g, '<br/>');
    
    // Envelopper dans des paragraphes
    parsed = '<p class="mb-4">' + parsed + '</p>';
    
    // Nettoyer les paragraphes vides
    parsed = parsed.replace(/<p class="mb-4">\s*<\/p>/g, '');
    
    return parsed;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl pb-safe-bottom">
      {/* Titre de la page avec style boutique */}
      <div className="text-center mb-8">
        <h1 className="shop-title text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white mb-3">
          Informations
        </h1>
        <div className="w-20 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto"></div>
      </div>

      {/* Affichage instantané du contenu */}
      {content ? (
        <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/10">
          <div 
            className="prose prose-lg max-w-none text-gray-300 leading-relaxed [&_strong]:text-white [&_h1]:text-white [&_h2]:text-white [&_h3]:text-white"
            dangerouslySetInnerHTML={{ __html: parseMarkdown(content) }}
          />
        </div>
      ) : (
        <div className="text-center text-gray-500 py-12">
          <p>Aucun contenu disponible</p>
        </div>
      )}
    </div>
  );
}