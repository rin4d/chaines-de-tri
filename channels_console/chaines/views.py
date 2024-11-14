import json

from django.shortcuts import render


def home(request):
    # Ouverture du fichier json
    with open("../gen/association.json", "r") as json_file:
        chaines = json.load(json_file)

    # On affiche la page index.html et on envoie à la page le contenu du fichier json avec {'chaines': chaines}
    return render(request, 'index.html', {'chaines': chaines})
