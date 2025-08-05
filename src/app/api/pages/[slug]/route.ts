import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb-fixed';

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
    
    const { content, title } = await request.json();
    const { db } = await connectToDatabase();
    const pagesCollection = db.collection('pages');
    
    const result = await pagesCollection.replaceOne(
      { slug: params.slug },
      { 
        slug: params.slug, 
        title: title || params.slug, 
        content: content || '', 
        updatedAt: new Date() 
      },
      { upsert: true }
    );
    
    console.log('✅ Page sauvegardée:', {
      slug: params.slug,
      modified: result.modifiedCount,
      upserted: result.upsertedCount
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('❌ Erreur API Pages POST:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Erreur inconnue' 
    }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, context: any) {
  return POST(req, context);
}