# 🚀 Guide Complet de Déploiement sur Render

## 📋 Prérequis

1. **Compte GitHub** avec votre code
2. **Compte Render** (gratuit sur [render.com](https://render.com))
3. **Bot Telegram créé** via [@BotFather](https://t.me/botfather)
4. **Base de données MongoDB** (gratuite sur [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))

## 🔑 Variables d'Environnement Nécessaires

Voici toutes les variables que vous devez configurer sur Render :

### Variables Obligatoires

| Variable | Description | Exemple |
|----------|-------------|---------|
| `BOT_TOKEN` | Token de votre bot Telegram | `8128299360:AAEWmbRLjkTaQYP17GsiGm5vhQv8AcJLKIY` |
| `ADMIN_ID` | Votre ID Telegram (admin principal) | `7670522278` |
| `MONGODB_URI` | URL de connexion MongoDB | `mongodb+srv://user:pass@cluster.mongodb.net/telegram-bot` |

### Variables Optionnelles

| Variable | Description | Valeur par défaut |
|----------|-------------|-------------------|
| `PORT` | Port du serveur | `3000` |
| `WEBHOOK_URL` | URL de votre app Render | Auto-configuré |
| `NODE_ENV` | Environnement | `production` |

## 📝 Étapes de Déploiement

### 1. Préparer MongoDB Atlas

1. Créez un compte gratuit sur [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Créez un nouveau cluster (gratuit)
3. Créez un utilisateur de base de données
4. Ajoutez `0.0.0.0/0` aux IP autorisées (pour Render)
5. Récupérez l'URL de connexion :
   ```
   mongodb+srv://username:password@cluster.mongodb.net/telegram-bot?retryWrites=true&w=majority
   ```

### 2. Préparer votre Repository GitHub

1. Assurez-vous que tous les fichiers sont présents :
   - `bot.js` (fichier principal)
   - `config.js`
   - `keyboards.js`
   - `models.js`
   - `package.json`
   - `render.yaml`

2. Commitez et pushez sur GitHub

### 3. Déployer sur Render

1. Connectez-vous à [Render](https://render.com)
2. Cliquez sur **"New +"** → **"Web Service"**
3. Connectez votre repository GitHub
4. Sélectionnez votre repository
5. Configurez :
   - **Name** : `bot-telegram-lanation` (ou autre)
   - **Region** : Choisissez la plus proche
   - **Branch** : `main` ou `master`
   - **Runtime** : `Node`
   - **Build Command** : `npm install`
   - **Start Command** : `npm start`

### 4. Configurer les Variables d'Environnement

Dans Render, section **"Environment"** :

1. Cliquez sur **"Add Environment Variable"**
2. Ajoutez chaque variable :

```
BOT_TOKEN = [Votre token du BotFather]
ADMIN_ID = [Votre ID Telegram]
MONGODB_URI = [URL MongoDB Atlas complète]
PORT = 3000
NODE_ENV = production
```

### 5. Déployer

1. Cliquez sur **"Create Web Service"**
2. Attendez que le déploiement se termine (5-10 minutes)
3. Vérifiez les logs pour voir "Bot démarré avec succès"

### 6. Configurer le Webhook (Automatique)

Le bot configure automatiquement le webhook au démarrage. Vérifiez dans les logs :
```
✅ Webhook configuré: https://votre-app.onrender.com
```

## 🧪 Tester le Bot

1. Ouvrez Telegram
2. Cherchez votre bot : `@votre_bot`
3. Envoyez `/start` - Vous devriez voir le message d'accueil
4. Envoyez `/admin` - Vous devriez voir le panel admin (si vous êtes l'admin)

## 📊 Fonctionnalités du Bot

### Commandes Utilisateur
- `/start` - Menu principal avec réseaux sociaux
- `/id` - Afficher son ID Telegram

### Commandes Admin
- `/admin` - Panel d'administration complet

### Panel Admin inclut :
- 📝 Modifier le message d'accueil
- 🖼️ Modifier la photo d'accueil
- 📱 Configurer une mini application
- 🌐 Gérer les réseaux sociaux
- ℹ️ Modifier les informations
- 📢 Envoyer un message à tous
- 👥 Gérer les administrateurs
- 📊 Voir les statistiques

## ⚠️ Limitations du Plan Gratuit Render

- Le service se met en veille après 15 minutes d'inactivité
- Premier message peut prendre 30-50 secondes (réveil)
- 750 heures/mois (largement suffisant)
- Pas de stockage de fichiers persistant (utilisez MongoDB)

## 🔧 Dépannage

### Le bot ne répond pas
1. Vérifiez les logs dans Render
2. Vérifiez que MongoDB est accessible
3. Vérifiez le token du bot

### Erreur MongoDB
1. Vérifiez l'URL de connexion
2. Vérifiez les IP autorisées (0.0.0.0/0)
3. Vérifiez le nom d'utilisateur/mot de passe

### Bot lent au premier message
C'est normal avec le plan gratuit. Le service se réveille.

## 💡 Conseils

1. **Sauvegarde** : MongoDB Atlas fait des sauvegardes automatiques
2. **Monitoring** : Utilisez les logs Render pour surveiller
3. **Performance** : Le bot reste rapide même en gratuit
4. **Sécurité** : Ne partagez jamais votre token

## 📞 Support

En cas de problème :
1. Vérifiez les logs dans Render
2. Vérifiez la console MongoDB Atlas
3. Testez localement avec les mêmes variables

---

✅ **Votre bot est maintenant prêt à être déployé !**