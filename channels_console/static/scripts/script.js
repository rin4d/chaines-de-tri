// Variables globales
const editButton = document.getElementById("editButton");
const saveButton = document.getElementById("saveButton");
const table = document.getElementById("data-table");
let isEditing = false;  // Cette variable indique si le mode édition est activé

// Fonction pour activer l'édition d'une cellule
function makeEditable(cell) {
    if (!isEditing) return;  // Si le mode édition n'est pas activé, ne fait rien

    // Si la cellule a déjà un input ou un select, on ne fait rien
    if (cell.querySelector("input") || cell.querySelector("select")) return;

    // Vérifie si la cellule est de type "true-false"
    const isTrueFalseCell = cell.classList.contains("true-false");

    if (isTrueFalseCell) {
        // Crée une liste déroulante (select) avec les options "true" et "false"
        const select = document.createElement("select");

        // Ajoute les options true et false
        const trueOption = document.createElement("option");
        trueOption.text = "true";
        trueOption.value = "true";
        select.appendChild(trueOption);

        const falseOption = document.createElement("option");
        falseOption.text = "false";
        falseOption.value = "false";
        select.appendChild(falseOption);

        // Définit la valeur actuelle de la cellule dans le select
        select.value = cell.innerText.trim();
        cell.innerText = ""; // Vider la cellule
        cell.appendChild(select); // Ajouter le select à la cellule

        // Lorsque le select perd le focus, on remet la valeur sélectionnée
        select.onblur = function() {
            cell.innerText = select.value || cell.innerText;
        };

        // Lorsque l'utilisateur change la sélection, on met à jour la cellule
        select.onchange = function() {
            cell.innerText = select.value;
        };

        // Focus sur le select dès qu'il est créé
        select.focus();
    } else {
        // Vérifie si la cellule est de type "pays", "langue" ou "categorie"
        const isPaysCell = cell.classList.contains("pays");
        const isLangueCell = cell.classList.contains("langues");
        const isCategorieCell = cell.classList.contains("categorie");

        if (isPaysCell || isLangueCell) {
            // Crée une liste déroulante (select)
            const select = document.createElement("select");

            // Ajoute une option par défaut
            const defaultOption = document.createElement("option");
            defaultOption.text = isPaysCell ? "--Liste des pays--" : "--Liste des langues--";
            defaultOption.value = "";
            select.appendChild(defaultOption);

            // Définit le fichier JSON à charger en fonction du type de cellule
            const jsonFile = isPaysCell ? 'json/liste_pays.json' : 'json/liste_langues.json';

            // Charge les options depuis le fichier JSON approprié
            fetch(jsonFile)
                .then(response => response.json())
                .then(data => {
                    const optionsList = isPaysCell ? data.pays : data.langues;

                    if (isLangueCell) {
                        // Parcourt chaque entrée de l'objet 'langues' dans le JSON
                        for (const [code, abbreviation] of Object.entries(optionsList)) {
                            const option = document.createElement("option");
                            option.text = `${code} - ${abbreviation}`;
                            option.value = abbreviation;
                            select.appendChild(option);
                        }
                    } else if (Array.isArray(optionsList)) {
                        optionsList.forEach(item => {
                            const option = document.createElement("option");
                            option.text = item;
                            option.value = item;
                            select.appendChild(option);
                        });
                    } else {
                        console.error("La liste dans le fichier JSON n'est pas valide.");
                    }
                })
                .catch(error => {
                    console.error("Erreur lors du chargement du fichier JSON :", error);
                });

            // Définit la valeur actuelle de la cellule dans le select
            select.value = cell.innerText.trim();
            cell.innerText = ""; // Vider la cellule
            cell.appendChild(select); // Ajouter le select à la cellule

            // Lorsque le select perd le focus, on remet la valeur sélectionnée
            select.onblur = function() {
                cell.innerText = select.value || cell.innerText;
            };

            // Lorsque l'utilisateur change la sélection, on met à jour la cellule
            select.onchange = function() {
                cell.innerText = select.value;
            };

            // Focus sur le select dès qu'il est créé
            select.focus();
        } else if (isCategorieCell) {
            // Crée une liste déroulante (select) pour les catégories
            const select = document.createElement("select");

            // Ajoute une option par défaut
            const defaultOption = document.createElement("option");
            defaultOption.text = "--Liste des catégories--";
            defaultOption.value = "";
            select.appendChild(defaultOption);

            // Charge les catégories depuis le fichier JSON
            fetch('json/liste_categories.json')
                .then(response => response.json())
                .then(data => {
                    const optionsList = data.categories;

                    // Parcourt chaque entrée de l'objet 'categories' dans le JSON
                    optionsList.forEach(item => {
                        const option = document.createElement("option");
                        option.text = item.nom;  // Affiche uniquement le "nom"
                        select.appendChild(option);
                    });
                })
                .catch(error => {
                    console.error("Erreur lors du chargement du fichier JSON :", error);
                });

            // Définit la valeur actuelle de la cellule dans le select
            select.value = cell.innerText.trim();
            cell.innerText = ""; // Vider la cellule
            cell.appendChild(select); // Ajouter le select à la cellule

            // Lorsque le select perd le focus, on remet la valeur sélectionnée
            select.onblur = function() {
                cell.innerText = select.value || cell.innerText;
            };

            // Lorsque l'utilisateur change la sélection, on met à jour la cellule
            select.onchange = function() {
                cell.innerText = select.value;
            };

            // Focus sur le select dès qu'il est créé
            select.focus();
        } else {
            // Pour les autres cellules, on crée un champ input pour pouvoir éditer le texte
            const input = document.createElement("input");
            input.type = "text";
            input.value = cell.innerText;
            cell.innerText = ""; // Vider la cellule
            cell.appendChild(input); // Ajouter l'input à la cellule

            // Lorsque l'input perd le focus, on remet la valeur dans la cellule
            input.onblur = function() {
                cell.innerText = input.value;
            };

            // Lorsqu'on appuie sur "Enter", on remet la valeur dans la cellule
            input.onkeydown = function(event) {
                if (event.key === "Enter") {
                    cell.innerText = input.value;
                }
            };

            // Focus sur l'input dès qu'il est créé
            input.focus();
        }
    }
}

// Activer le mode édition
editButton.addEventListener("click", () => {
    isEditing = true;  // Active le mode édition
    editButton.style.display = "none";
    saveButton.style.display = "inline-block";

    // Permettre l'édition pour chaque cellule du tableau
    table.querySelectorAll("td").forEach(cell => {
        makeEditable(cell);
    });
});

// Sauvegarder les modifications
saveButton.addEventListener("click", () => {
    isEditing = false;  // Désactive le mode édition
    editButton.style.display = "inline-block";
    saveButton.style.display = "none";

    const updatedData = [];

    // Collecte les nouvelles données
    table.querySelectorAll("tr").forEach(row => {
        const rowData = {};
        row.querySelectorAll("td").forEach((cell, index) => {
            rowData[index] = cell.textContent.trim();
        });
        updatedData.push(rowData);
    });

    // Envoie les données modifiées au serveur
    fetch('/api/update-data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
    })
    .then(response => response.json())
    .then(data => {
        console.log("Données mises à jour avec succès", data);
    })
    .catch(error => {
        console.error("Erreur lors de la sauvegarde :", error);
    });
});
