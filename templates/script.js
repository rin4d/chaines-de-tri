function makeEditable(cell) {
    // Vérifie si un input ou select existe déjà dans la cellule pour éviter les duplications
    if (cell.querySelector("input") || cell.querySelector("select")) return;

    // Vérifie si la cellule a la classe "pays"
    if (cell.classList.contains("pays")) {
        fetch('json/liste_pays.json') // Chemin mis à jour vers le fichier JSON
            .then(response => response.json())
            .then(data => {
                // Crée une liste déroulante pour les pays
                const select = document.createElement("select");

                // Ajoute une option par défaut
                const defaultOption = document.createElement("option");
                defaultOption.text = "--Veuillez choisir un pays--";
                defaultOption.value = "";
                select.appendChild(defaultOption);

                // Ajoute chaque pays dans la liste déroulante
                data.forEach(countryCode => {
                    const option = document.createElement("option");
                    option.text = countryCode;
                    option.value = countryCode;
                    select.appendChild(option);
                });

                // Définit la valeur actuelle de la cellule
                select.value = cell.innerText;
                cell.innerText = ""; // Vide la cellule
                cell.appendChild(select); // Ajoute le menu déroulant

                // Gère la perte de focus pour enregistrer la sélection
                select.onblur = function() {
                    cell.innerText = select.value || cell.innerText;
                };

                // Gère la touche "Enter" pour enregistrer la sélection
                select.onchange = function() {
                    cell.innerText = select.value;
                };

                // Focus pour l'ouverture immédiate
                select.focus();
            })
            .catch(error => console.error('Erreur lors du chargement du fichier JSON:', error));
    } else {
        // Sinon, crée un champ input simple pour les autres colonnes
        const input = document.createElement("input");
        input.type = "text";
        input.value = cell.innerText;
        cell.innerText = "";
        cell.appendChild(input);

        input.onblur = function() {
            cell.innerText = input.value;
        };

        input.onkeydown = function(event) {
            if (event.key === "Enter") {
                cell.innerText = input.value;
            }
        };
        input.focus();
    }
}
