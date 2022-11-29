# OC-P6-Piiquante ![logo du site](./assets/images/flame.png)

 
# Présentation du projet 6

Création d'une API web dans laquelle les utilisateurs peuvent ajouterleurs sauces préférées et liker ou disliker les sauces ajoutées par les autres.

Points d'accès de l'API
- /api/auth/login (POST) 
- /api/auth/signup (POST) 
- /api/sauces (GET) récupération de toutes les sauces
- /api/sauces/:id (GET) récupèration d'une sauce
- /api/sauces/:id (POST) ajout d'une sauce
- /api/sauces/:id (PUT) modification d'une sauce par le propriétaire
- /api/sauces/:id (DELETE) suppression d'une sauce par son propriétaire
 - /api/sauces/:id/like (POST) modification valeur du like


# Installation de l'API

- Création d'un dossier 'images' à la racine
- Création d'un fichier .env contenant les variables suivantes :
-- PORT = Number // 3000
-- APP_SECRET = String // "THIS_IS_THE_SECRET_INGREDIANT"
- npm install