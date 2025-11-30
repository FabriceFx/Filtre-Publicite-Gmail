/**
 * @name Filtre Publicité Gmail
 * @description Analyse la boîte de réception, identifie les emails publicitaires via RegExp
 * et les classe sous un libellé spécifique.
 * @version 1.5.1 - Optimisé ES6
 * @author Fabrice Faucheux
 * @license MIT
 * @NotOnlyCurrentDoc
 */

// --- CONFIGURATION ---

const NOM_LIBELLE_CIBLE = "_À Vérifier Publicité";
const MAX_CONVERSATIONS_A_TRAITER = 200;

/**
 * Liste des mots-clés déclencheurs.
 * Astuce : Ajoutez des termes spécifiques à votre secteur si nécessaire.
 */
const MOTS_CLES = [
  "devis", "offre spéciale", "promotion", "réduction", "dernières nouvelles",
  "téléchargez maintenant", "gratuit", "inscrivez-vous", "opportunité",
  "économisez", "demandez", "en savoir plus", "webinar", "webinars",
  "Téléchargez", "Version en ligne", "Si vous n’arrivez pas à visualiser cet email,",
  "Merci encore pour votre participation !", "Inscrivez-vous", "course",
  "bonus", "discover", "newsletter", "astuce", "tip", "tips", "ends tonight"
];

// --- FONCTION PRINCIPALE ---

/**
 * Fonction maîtresse exécutant l'analyse et le déplacement des emails.
 * À lier à un déclencheur horaire.
 */
const analyserEtDeplacerSpam = () => {
  console.time("ExecutionTime");
  Logger.log(`[INFO] Démarrage de l'analyse (Max: ${MAX_CONVERSATIONS_A_TRAITER} conversations)...`);

  try {
    const libelleCible = obtenirOuCreerLibelle(NOM_LIBELLE_CIBLE);
    if (!libelleCible) {
      console.error("[CRITIQUE] Impossible d'obtenir le libellé cible. Arrêt du script.");
      return;
    }

    // Recherche des emails dans la boîte de réception et non lus
    const requete = 'is:inbox is:unread';
    const conversations = GmailApp.search(requete, 0, MAX_CONVERSATIONS_A_TRAITER);

    if (conversations.length === 0) {
      Logger.log("[INFO] Aucune conversation à traiter.");
      return;
    }

    Logger.log(`[INFO] ${conversations.length} conversation(s) identifiée(s).`);

    // Création de la RegExp unique pour la performance
    const motsClesEchappes = MOTS_CLES.map(mot => echapperRegExp(mot));
    const regexMotsCles = new RegExp(motsClesEchappes.join('|'), 'i');

    let compteurTraites = 0;

    // Traitement par lot (batch processing simulé par itération)
    conversations.forEach(conversation => {
      try {
        const messages = conversation.getMessages();
        let estIndesirable = false;

        // On vérifie les messages de la conversation (souvent le dernier suffit, mais on scanne tout par sécurité)
        for (const message of messages) {
          const contenuAAnalyser = `${message.getSubject()} ${message.getPlainBody()}`;

          if (regexMotsCles.test(contenuAAnalyser)) {
            Logger.log(`[ACTION] Détection positive : "${message.getSubject()}".`);
            estIndesirable = true;
            break; // Pas besoin de vérifier les autres messages du thread
          }
        }

        if (estIndesirable) {
          conversation.addLabel(libelleCible);
          conversation.markRead(); // Marquer comme lu pour ne pas re-traiter
          // Optionnel : conversation.moveToArchive(); pour nettoyer l'inbox
          compteurTraites++;
        }

      } catch (erreurConversation) {
        console.error(`[ERREUR] Échec sur conversation ID ${conversation.getId()} : ${erreurConversation.message}`);
      }
    });

    Logger.log(`[SUCCÈS] Terminé. ${compteurTraites} conversation(s) déplacée(s) vers "${NOM_LIBELLE_CIBLE}".`);
    
    if (conversations.length === MAX_CONVERSATIONS_A_TRAITER) {
      Logger.log(`[WARN] Limite atteinte (${MAX_CONVERSATIONS_A_TRAITER}). Relancez le script pour traiter le reste.`);
    }

  } catch (erreurGlobale) {
    console.error(`[CRITIQUE] Erreur globale : ${erreurGlobale.message}`);
  } finally {
    console.timeEnd("ExecutionTime");
  }
};

// --- FONCTIONS UTILITAIRES ---

/**
 * Récupère un libellé existant ou le crée s'il n'existe pas.
 * @param {string} nomLibelle - Le nom du libellé à obtenir.
 * @return {GmailLabel|null} L'objet Label ou null en cas d'erreur.
 */
function obtenirOuCreerLibelle(nomLibelle) {
  try {
    let libelle = GmailApp.getUserLabelByName(nomLibelle);
    if (!libelle) {
      Logger.log(`[CONFIG] Création du libellé "${nomLibelle}"...`);
      libelle = GmailApp.createLabel(nomLibelle);
    }
    return libelle;
  } catch (erreur) {
    console.error(`[ERREUR] Gestion libellé "${nomLibelle}" : ${erreur.message}`);
    return null;
  }
}

/**
 * Échappe les caractères spéciaux pour l'utilisation dans une RegExp.
 * @param {string} chaine - La chaîne brute.
 * @return {string} La chaîne échappée.
 */
function echapperRegExp(chaine) {
  return chaine.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Configure un déclencheur automatique pour exécuter le script toutes les heures.
 */
function configurerDeclencheurHoraire() {
  const nomFonction = 'analyserEtDeplacerSpam';
  supprimerDeclencheurs(); // Évite les doublons

  try {
    ScriptApp.newTrigger(nomFonction)
        .timeBased()
        .everyHours(1)
        .create();
    Logger.log(`[CONFIG] Déclencheur horaire activé pour '${nomFonction}'.`);
  } catch (erreur) {
    console.error(`[ERREUR] Création déclencheur : ${erreur.message}`);
  }
}

/**
 * Supprime tous les déclencheurs associés à la fonction principale.
 */
function supprimerDeclencheurs() {
  const nomFonction = 'analyserEtDeplacerSpam';
  const declencheurs = ScriptApp.getProjectTriggers();
  
  declencheurs.forEach(declencheur => {
    if (declencheur.getHandlerFunction() === nomFonction) {
      ScriptApp.deleteTrigger(declencheur);
    }
  });
  Logger.log(`[CONFIG] Déclencheurs nettoyés pour '${nomFonction}'.`);
}
