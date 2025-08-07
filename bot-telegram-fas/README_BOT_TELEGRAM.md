# 🤖 Bot Telegram FAS - @jdjejejebrbot

## 📋 Configuration pour Render

### Variables d'Environnement OBLIGATOIRES

Ajoutez ces variables dans Render :

```
BOT_TOKEN = 8013900461:AAF_oqbzKCOYPfbiePVHhojMFtk3v6HCTME
ADMIN_ID = 7670522278
MONGODB_URI = mongodb+srv://fasand051:fas123@fasandfurious.ni31xay.mongodb.net/?retryWrites=true&w=majority&appName=fasandfurious
PORT = 3000
NODE_ENV = production
```

### Configuration Build & Deploy

- **Build Command** : `npm install`
- **Start Command** : `npm start`
- **Root Directory** : `bot-telegram-fas` (si dans le repo principal) ou `.` (si repo séparé)

## 🚀 Déploiement sur Render

1. **Sur GitHub** : Poussez ce dossier
   ```bash
   git add bot-telegram-fas/
   git commit -m "Ajout bot Telegram FAS"
   git push origin main
   ```

2. **Sur Render** :
   - New → Web Service
   - Connectez votre repo GitHub
   - Si le bot est dans un sous-dossier, mettez `bot-telegram-fas` comme Root Directory
   - Ajoutez les 5 variables d'environnement
   - Deploy!

## ✅ Fonctionnalités

- `/start` - Menu principal
- `/admin` - Panel administration (pour ID: 7670522278)
- `/id` - Voir son ID Telegram

## 📊 Panel Admin

- Modifier message d'accueil
- Changer photo
- Gérer réseaux sociaux
- Envoyer messages à tous
- Statistiques
- Multi-admins

## 🔧 Structure

```
bot-telegram-fas/
├── bot.js              # Fichier principal
├── config.js           # Configuration MongoDB
├── keyboards.js        # Interfaces
├── models.js           # Modèles DB
├── package.json        # Dépendances
├── render.yaml         # Config Render
└── .env.example        # Exemple variables
```

## ⚠️ Important

- Ne commitez JAMAIS le fichier .env
- La DB MongoDB est déjà configurée
- Premier message peut être lent (service gratuit)

---

Bot prêt pour Render ! 🎉