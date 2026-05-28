# Filtre publicité Gmail


[🇫🇷 Version Française](#-version-française) | [🇬🇧 English Version](#-english-version)

![License MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![Platform](https://img.shields.io/badge/Platform-Google%20Apps%20Script-green)
![Runtime](https://img.shields.io/badge/Google%20Apps%20Script-V8-green)
![Author](https://img.shields.io/badge/Auteur-Fabrice%20Faucheux-orange)

## 🇫🇷 Version Française


Une solution automatisée basée sur Google Apps Script pour détecter, classer et nettoyer les emails promotionnels ou indésirables de votre boîte de réception Gmail.

## 📋 Description

Ce script agit comme un filtre intelligent post-réception. Contrairement aux filtres Gmail classiques limités, ce script utilise des **Expressions Régulières (RegExp)** sur une liste étendue de mots-clés pour analyser le sujet et le corps des messages.

Les emails identifiés sont :
1. Marqués comme **Lus**.
2. Étiquetés sous un libellé dédié (par défaut : `_À Vérifier Publicité`).
3. Prêts à être archivés ou supprimés en masse après vérification rapide.

## 🚀 Fonctionnalités clés

* **Analyse Profonde :** Scanne le sujet ET le corps du message.
* **Performance :** Utilise une RegExp compilée pour traiter rapidement de grandes listes de mots-clés.
* **Protection Quota :** Traite les emails par lots (batching de 200 conversations max) pour éviter les timeouts Google.
* **Zéro Configuration :** Crée automatiquement le libellé nécessaire s'il n'existe pas.
* **Logs Détaillés :** Utilise `Logger` et `console.error` pour un suivi précis via l'interface Apps Script.

## 🛠 Installation manuelle

1. Ouvrez [Google Apps Script](https://script.google.com/).
2. Créez un nouveau projet nommé "Filtre Publicité".
3. Copiez le contenu du fichier `Code.js` dans l'éditeur.
4. Modifiez la constante `MOTS_CLES` si vous souhaitez ajouter/retirer des termes.
5. Sauvegardez (`Ctrl + S`).

## ⚙️ Automatisation

Pour que le script tourne en tâche de fond :

1. Sélectionnez la fonction `configurerDeclencheurHoraire` dans la barre d'outils.
2. Cliquez sur **Exécuter**.
3. Acceptez les autorisations demandées (Accès à Gmail).
4. Le script s'exécutera désormais automatiquement toutes les heures.

## ⚠️ Notes techniques

* **Sécurité :** Le script ne supprime aucun email définitivement. Il applique uniquement un libellé.
* **Scope :** Par défaut, il ne scanne que les emails présents dans la boîte de réception (`Inbox`) et non lus (`Unread`).


---
## 🇬🇧 English Version

> English translation coming soon.

---
<p align="center"><a href="https://faucheux.bzh" target="_blank" style="color: inherit; text-decoration: none;">&lt;&gt; par Fabrice Faucheux</a></p>