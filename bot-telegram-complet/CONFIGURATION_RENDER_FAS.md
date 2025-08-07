# 🚀 Configuration Render pour @jdjejejebrbot

## 📋 Variables d'Environnement à Copier dans Render

Copiez EXACTEMENT ces variables dans Render :

### 1. BOT_TOKEN
```
8013900461:AAF_oqbzKCOYPfbiePVHhojMFtk3v6HCTME
```

### 2. ADMIN_ID
```
7670522278
```

### 3. MONGODB_URI
```
mongodb+srv://fasand051:fas123@fasandfurious.ni31xay.mongodb.net/?retryWrites=true&w=majority&appName=fasandfurious
```

### 4. PORT (optionnel - Render le gère)
```
3000
```

### 5. NODE_ENV (optionnel)
```
production
```

## 🔧 Comment Ajouter ces Variables dans Render

1. **Dans votre dashboard Render**, allez dans votre service
2. Cliquez sur **"Environment"** dans le menu de gauche
3. Cliquez sur **"Add Environment Variable"**
4. Pour chaque variable :
   - **Key** : Le nom de la variable (ex: BOT_TOKEN)
   - **Value** : La valeur ci-dessus
   - Cliquez sur **"Add"**

## ✅ Vérification

Une fois déployé, votre bot sera accessible via :
- **Username** : @jdjejejebrbot
- **Lien direct** : https://t.me/jdjejejebrbot

## 🧪 Test des Commandes

1. **Commande utilisateur** :
   - `/start` - Affiche le menu principal

2. **Commandes admin** (pour vous uniquement) :
   - `/admin` - Ouvre le panel d'administration
   - `/id` - Affiche votre ID Telegram (devrait montrer 7670522278)

## 📊 Panel Admin - Fonctionnalités

En tant qu'admin (ID: 7670522278), vous pourrez :
- 📝 Modifier le message d'accueil
- 🖼️ Changer la photo d'accueil
- 📱 Configurer une mini application
- 🌐 Gérer les réseaux sociaux
- ℹ️ Modifier les informations
- 📢 Envoyer des messages à tous les utilisateurs
- 👥 Ajouter/retirer des administrateurs
- 📊 Voir les statistiques du bot

## 🔒 Sécurité

- **IMPORTANT** : Ne partagez JAMAIS ces informations
- Votre MongoDB est sécurisé avec authentification
- Seul vous (ID: 7670522278) avez accès admin

## 🚨 En Cas de Problème

Si le bot ne répond pas après déploiement :
1. Vérifiez les logs dans Render
2. Assurez-vous que toutes les variables sont bien copiées
3. Attendez 1-2 minutes après le déploiement

## 📝 Notes

- La base de données MongoDB est déjà configurée (fasandfurious)
- Le bot créera automatiquement les collections nécessaires
- La configuration sera sauvegardée dans MongoDB
- Premier démarrage peut prendre 30-60 secondes

---

✅ **Tout est prêt ! Déployez sur Render avec ces variables.**