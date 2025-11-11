# Configuration de l'API Météo - StartFarme

## 🌤️ État Actuel

Actuellement, l'application utilise des **données mockées** (simulées) pour les données météo en développement.

## 🔧 Options pour les Données Météo Réelles

### Option 1: OpenWeatherMap (Recommandé - Gratuit)

#### Avantages
- ✅ Gratuit jusqu'à 1,000 requêtes/jour
- ✅ Données précises et à jour
- ✅ Support multilingue (arabe, français)
- ✅ Facile à intégrer

#### Configuration

1. **Créer un compte:**
   - Aller sur https://openweathermap.org/api
   - Créer un compte gratuit
   - Obtenir votre API key

2. **Configurer dans le backend:**
   ```bash
   cd ~/Documents/startfarme/backend
   nano .env
   ```

3. **Ajouter les variables:**
   ```env
   WEATHER_API_KEY="votre_api_key_ici"
   WEATHER_API_URL="https://api.openweathermap.org/data/2.5"
   ```

4. **Redémarrer le backend:**
   ```bash
   npm run dev
   ```

#### Limites du Plan Gratuit
- 60 requêtes/minute
- 1,000 requêtes/jour
- Données actuelles et prévisions 5 jours
- Pas de données historiques

### Option 2: INM (Institut National de la Météorologie) Tunisie

#### Avantages
- ✅ Données locales tunisiennes
- ✅ Spécifique à la Tunisie
- ✅ Peut être plus précis pour les régions tunisiennes

#### Inconvénients
- ❌ Pas d'API publique disponible
- ❌ Nécessite un partenariat
- ❌ Plus complexe à intégrer

### Option 3: WeatherAPI.com

#### Avantages
- ✅ Plan gratuit généreux (1 million requêtes/mois)
- ✅ Données historiques
- ✅ Prévisions jusqu'à 14 jours
- ✅ API simple

#### Configuration

1. **Créer un compte:**
   - Aller sur https://www.weatherapi.com/
   - Créer un compte gratuit
   - Obtenir votre API key

2. **Configurer dans le backend:**
   ```env
   WEATHER_API_KEY="votre_api_key_ici"
   WEATHER_API_URL="https://api.weatherapi.com/v1"
   ```

3. **Modifier le code:**
   - Adapter les endpoints dans `weatherController.ts`
   - Adapter le format de réponse

## 📊 Données Mockées Actuelles

Les données mockées incluent:
- ✅ Température (varie selon la localisation)
- ✅ Humidité (50-80%)
- ✅ Précipitations (simulées selon la saison)
- ✅ Vitesse du vent (8-18 km/h)
- ✅ Conditions (Sunny, Cloudy, Rainy)

### Caractéristiques
- Données varient selon les coordonnées GPS
- Simulation saisonnière (plus de pluie en hiver)
- Mise en cache (10 minutes pour données actuelles, 1 heure pour prévisions)
- Données réalistes pour la Tunisie

## 🔍 Vérifier les Données Météo

### Tester l'API Backend

```bash
# Tester avec des coordonnées
curl "http://localhost:3000/api/weather/current?lat=36.8065&lng=10.1815"

# Tester avec latitude/longitude
curl "http://localhost:3000/api/weather/current?latitude=36.8065&longitude=10.1815"
```

### Vérifier dans le Frontend

1. Ouvrir http://localhost:5174
2. Aller dans "Profil" et ajouter votre localisation
3. Aller dans "Météo"
4. Vérifier que les données s'affichent

## 🚀 Activer les Données Réelles

### Étapes

1. **Obtenir une clé API OpenWeatherMap:**
   - Aller sur https://openweathermap.org/api
   - S'inscrire (gratuit)
   - Copier votre API key

2. **Configurer le backend:**
   ```bash
   cd ~/Documents/startfarme/backend
   nano .env
   ```

3. **Ajouter:**
   ```env
   WEATHER_API_KEY="votre_api_key_openweathermap"
   WEATHER_API_URL="https://api.openweathermap.org/data/2.5"
   ```

4. **Redémarrer le backend:**
   ```bash
   npm run dev
   ```

5. **Tester:**
   - Vérifier les logs du backend
   - Tester l'endpoint `/api/weather/current`
   - Vérifier dans le frontend

## 📝 Format des Données

### Données Actuelles
```json
{
  "location": "Tunis",
  "current": {
    "temp": 25,
    "humidity": 65,
    "rainfall": 2,
    "windSpeed": 15,
    "condition": "Sunny",
    "conditionAr": "مشمس"
  },
  "forecast": []
}
```

### Prévisions
```json
{
  "location": "Tunis",
  "current": { ... },
  "forecast": [
    {
      "date": "2024-11-12T00:00:00.000Z",
      "tempMin": 18,
      "tempMax": 25,
      "rainfall": 0,
      "alerts": []
    }
  ]
}
```

## 🔄 Mise en Cache

Les données météo sont mises en cache dans Redis:
- **Données actuelles:** 10 minutes
- **Prévisions:** 1 heure

Cela réduit le nombre de requêtes à l'API et améliore les performances.

## ⚠️ Problèmes Courants

### Problème: Les données ne s'affichent pas

**Solution:**
1. Vérifier que vous avez ajouté votre localisation dans le profil
2. Vérifier que les coordonnées GPS sont correctes
3. Vérifier les logs du backend pour les erreurs
4. Vérifier que Redis est en cours d'exécution

### Problème: Erreur 401 de l'API

**Solution:**
1. Vérifier que la clé API est correcte
2. Vérifier que la clé API est active
3. Vérifier les limites du plan gratuit

### Problème: Données toujours mockées

**Solution:**
1. Vérifier que `WEATHER_API_KEY` est défini dans `.env`
2. Vérifier que le backend a été redémarré après modification
3. Vérifier les logs du backend pour les erreurs API

## 📚 Ressources

- [OpenWeatherMap API](https://openweathermap.org/api)
- [WeatherAPI.com](https://www.weatherapi.com/)
- [Documentation OpenWeatherMap](https://openweathermap.org/api/one-call-3)

## 💡 Recommandations

1. **Développement:** Utiliser les données mockées (déjà configurées)
2. **Production:** Utiliser OpenWeatherMap (gratuit jusqu'à 1,000 requêtes/jour)
3. **Cache:** Toujours activer le cache Redis pour réduire les coûts
4. **Monitoring:** Surveiller le nombre de requêtes pour éviter les limites

## ✅ Checklist

- [ ] Compte OpenWeatherMap créé (optionnel)
- [ ] Clé API obtenue (optionnel)
- [ ] Variables d'environnement configurées (optionnel)
- [ ] Backend redémarré (optionnel)
- [ ] Données météo testées dans le frontend
- [ ] Cache Redis vérifié
- [ ] Logs du backend vérifiés

