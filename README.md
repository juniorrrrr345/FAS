# FAS Boutique 🛍️

Une boutique en ligne moderne et performante basée sur Next.js, MongoDB et Cloudinary.

## 🚀 Installation

1. **Cloner le repository**
```bash
git clone [votre-repo-github]
cd FAS-boutique
npm install
```

2. **Configuration des variables d'environnement**

Créez un fichier `.env.local` à la racine du projet et ajoutez vos configurations :

```env
# MongoDB
MONGODB_URI=votre_mongodb_connection_string

# Cloudinary
CLOUDINARY_CLOUD_NAME=votre_cloud_name
CLOUDINARY_API_KEY=votre_api_key
CLOUDINARY_API_SECRET=votre_api_secret

# Admin
ADMIN_USERNAME=votre_username
ADMIN_PASSWORD=votre_password_securise

# NextAuth
NEXTAUTH_SECRET=votre_secret_key_aleatoire
```

## 📦 Démarrage

```bash
# Mode développement
npm run dev

# Build production
npm run build
npm start
```

## 🎨 Fonctionnalités

### Boutique Client
- ✅ Affichage responsive (mobile/desktop)
- ✅ Filtres par catégories et farms
- ✅ Détail des produits avec galerie
- ✅ Pages Info et Contact dynamiques
- ✅ Texte défilant configurable
- ✅ Thème personnalisable (Graffiti/Glow)

### Panel Admin (/admin)
- ✅ Gestion des produits
- ✅ Gestion des catégories
- ✅ Gestion des farms (fournisseurs)
- ✅ Upload d'images via Cloudinary
- ✅ Configuration du background
- ✅ Gestion des pages Info/Contact
- ✅ Liens réseaux sociaux

## 🔧 Configuration

1. **MongoDB Atlas**
   - Créez un cluster gratuit sur [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Créez un utilisateur avec accès lecture/écriture
   - Ajoutez votre IP à la whitelist
   - Copiez la connection string

2. **Cloudinary**
   - Créez un compte gratuit sur [Cloudinary](https://cloudinary.com/)
   - Récupérez vos credentials dans le dashboard

3. **Admin**
   - Choisissez un username et password sécurisés
   - Accédez au panel admin via `/admin`

## 📱 Structure du projet

```
FAS-boutique/
├── src/
│   ├── app/           # Pages Next.js
│   ├── components/    # Composants React
│   ├── models/        # Modèles MongoDB
│   ├── lib/           # Utilitaires
│   └── hooks/         # Custom hooks
├── public/            # Assets statiques
└── scripts/           # Scripts utilitaires
```

## 🚀 Déploiement sur Vercel

1. Connectez votre repository GitHub à Vercel
2. Ajoutez toutes les variables d'environnement
3. Déployez !

## 📞 Support

Pour toute question ou assistance, n'hésitez pas à nous contacter.

---

**FAS Boutique** - Votre boutique en ligne moderne 🔥