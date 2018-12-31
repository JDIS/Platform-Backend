# Tutoriel
## Sélection des CS Games
Bienvenue aux sélections des CS Games. Dans cette compétition, vous aurez à résoudre quelques défis en utilisant les langages de programmation disponibles sur cette plateforme.

Voici quelques suggestions :
  - [Python 2.7](https://www.python.org/downloads/release/python-2714/)
  - [Python 3.6](https://www.python.org/downloads/release/python-364/)
  - [JavaScript (Node.js v9.3.0)](https://nodejs.org/en/blog/release/v9.3.0/)
  - [Ruby (2.5.0)](https://www.ruby-lang.org/en/news/2017/12/25/ruby-2-5-0-released/)

## Le but
Votre but est de résoudre le plus de défis possibles pour obtenir un maximum de «force».
Chaque challenge offre un nombre de force différent selon la difficulté du défi.

![alt text](https://raw.githubusercontent.com/JDIS/CSGamesSelectionPublic/master/force.png "Force")

## Comment ça marche?
Les défis de programmation sont de type _stdin_/_stdout_. Autrement dit, vous lirez les entrées fournies sur l'entrée standard de la console (_stdin_), et vous enverrez les résultats de vos algorithmes sur la sortie standard (_stdout_).

## Pour tester localement (**extrêmement utile**)
Vous avez accès à un script utilitaire qui agit exactement comme la plateforme, mais localement : le [Validator](https://github.com/JDIS/CSGamesSelectionPublic/tree/master/Validator) vous permet ainsi de tester les défis que vous voulez localement. Pour ce faire, vous devez lui fournir un script et fichier de test comme [celui-ci](https://github.com/JDIS/CSGamesSelectionPublic/blob/master/Tutoriel/tutoriel.json).

Tous les fichiers nécessaires sont disponibles sur le [dépôt GitHub public de cet événement](https://github.com/JDIS/CSGamesSelectionPublic).

### stdin
**Python**
```
input1 = raw_input()
input2 = raw_input()
```

**JavaScript**
```
var readline = require("./readline.js");

var input1 = readline();
var input2 = readline();
```

### stdout
**Python**
```
print 'Resultat'
```

**JavaScript**
```
console.log('Resultat');
```

## Tutoriel
Pour compléter ce défi tutoriel, vous n'avez qu'à sortir `J'ai compris!` sur la sortie standard (_stdout_).

# Bonne chance, et que la force soit avec vous!
