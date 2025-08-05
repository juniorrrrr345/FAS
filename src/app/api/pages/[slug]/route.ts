import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb-fixed';

// Configuration Next.js pour augmenter les limites
export const maxDuration = 60; // 60 secondes timeout
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    console.log('🔍 API Pages GET - Slug:', params.slug);
    
    const { db } = await connectToDatabase();
    const pagesCollection = db.collection('pages');
    
    const page = await pagesCollection.findOne({ slug: params.slug });
    console.log('📄 Page trouvée:', page ? 'OUI' : 'NON');
    
    // Si la page n'existe pas, créer une page par défaut
    if (!page) {
      const defaultPages: { [key: string]: { title: string; content: string } } = {
        info: {
          title: 'À propos de FAS Boutique',
          content: `# Bienvenue chez FAS Boutique 🛍️

**FAS Boutique** est votre destination privilégiée pour des produits de qualité exceptionnelle. Nous nous engageons à vous offrir une expérience d'achat unique avec :

## 🌟 Nos Engagements

- **Qualité Premium** : Tous nos produits sont soigneusement sélectionnés
- **Service Client** : Une équipe dédiée à votre satisfaction
- **Livraison Rapide** : Vos commandes livrées dans les meilleurs délais
- **Prix Compétitifs** : Le meilleur rapport qualité-prix

## 🚀 Notre Mission

Chez FAS Boutique, nous croyons que chaque client mérite le meilleur. C'est pourquoi nous travaillons sans relâche pour vous proposer des produits qui allient qualité, style et innovation.

## 💎 Pourquoi Nous Choisir ?

- **Authenticité garantie** : 100% de produits authentiques
- **Satisfaction client** : Plus de 98% de clients satisfaits
- **Support 24/7** : Nous sommes toujours là pour vous
- **Paiement sécurisé** : Vos transactions sont protégées

---

*FAS Boutique - Votre satisfaction, notre priorité* ✨`
        },
        contact: {
          title: 'Contactez FAS Boutique',
          content: `# Contactez-nous 📞

Nous sommes là pour répondre à toutes vos questions !

## 📱 Nos Coordonnées

**Téléphone** : +33 X XX XX XX XX  
**Email** : contact@fas-boutique.com  
**WhatsApp** : +33 X XX XX XX XX

## 🕐 Horaires

**Lundi - Vendredi** : 9h00 - 19h00  
**Samedi** : 10h00 - 18h00  
**Dimanche** : Fermé

## 📍 Zone de Livraison

Nous livrons dans toute la France métropolitaine :
- Paris et région parisienne : 24-48h
- Autres régions : 48-72h
- Livraison express disponible

## 💬 Réseaux Sociaux

Suivez-nous sur nos réseaux sociaux pour ne rien manquer de nos nouveautés et promotions !

---

*N'hésitez pas à nous contacter, nous sommes là pour vous !* 💌`
        }
      };

      if (defaultPages[params.slug]) {
        // Créer la page par défaut
        const defaultPage = {
          slug: params.slug,
          ...defaultPages[params.slug],
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        await pagesCollection.insertOne(defaultPage);
        console.log('✅ Page par défaut créée:', params.slug);
        
        return NextResponse.json({
          content: defaultPage.content,
          title: defaultPage.title
        });
      }
    }
    
    return NextResponse.json({
      content: page.content || '',
      title: page.title || params.slug
    });
  } catch (error) {
    console.error('❌ Erreur API Pages GET:', error);
    return NextResponse.json({ 
      content: '', 
      title: params.slug,
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    console.log('📝 API Pages POST - Slug:', params.slug);
    
    // Vérifier la taille de la requête
    const contentLength = request.headers.get('content-length');
    if (contentLength && parseInt(contentLength) > 10 * 1024 * 1024) {
      return NextResponse.json({ 
        success: false, 
        error: 'Le contenu est trop volumineux (limite: 10MB)' 
      }, { status: 413 });
    }
    
    const body = await request.json();
    const { content, title } = body;
    
    // Vérifier que le contenu n'est pas trop grand pour MongoDB (limite 16MB par document)
    const contentSize = new TextEncoder().encode(JSON.stringify(body)).length;
    console.log(`📏 Taille du contenu: ${(contentSize / 1024).toFixed(2)} KB`);
    
    if (contentSize > 15 * 1024 * 1024) { // 15MB de sécurité
      return NextResponse.json({ 
        success: false, 
        error: 'Le contenu est trop volumineux pour la base de données (limite: 15MB)' 
      }, { status: 413 });
    }
    
    const { db } = await connectToDatabase();
    const pagesCollection = db.collection('pages');
    
    // Utiliser updateOne avec upsert au lieu de replaceOne pour une meilleure gestion
    const result = await pagesCollection.updateOne(
      { slug: params.slug },
      { 
        $set: {
          slug: params.slug, 
          title: title || params.slug, 
          content: content || '', 
          updatedAt: new Date()
        }
      },
      { upsert: true }
    );
    
    console.log('✅ Page sauvegardée:', {
      slug: params.slug,
      modified: result.modifiedCount,
      upserted: result.upsertedCount,
      contentLength: `${(contentSize / 1024).toFixed(2)} KB`
    });
    
    return NextResponse.json({ 
      success: true,
      size: `${(contentSize / 1024).toFixed(2)} KB`
    });
  } catch (error) {
    console.error('❌ Erreur API Pages POST:', error);
    
    // Gestion spécifique des erreurs de taille
    if (error instanceof Error) {
      if (error.message.includes('PayloadTooLargeError') || 
          error.message.includes('request entity too large')) {
        return NextResponse.json({ 
          success: false, 
          error: 'Le contenu est trop volumineux. Veuillez réduire la taille du texte.' 
        }, { status: 413 });
      }
      
      if (error.message.includes('document exceeds maximum allowed BSON object size')) {
        return NextResponse.json({ 
          success: false, 
          error: 'Le document dépasse la taille maximale autorisée par MongoDB (16MB)' 
        }, { status: 413 });
      }
    }
    
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Erreur inconnue' 
    }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, context: any) {
  return POST(req, context);
}