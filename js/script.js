
const form = document.getElementById("form-recherche");
const ville = document.getElementById("ville");
const errorMessage = document.getElementById("message-erreur");
const chargement = document.getElementById("chargement");

form.addEventListener("submit", async function(event) {
    event.preventDefault();

    const nomVille = ville.value.trim();

    if (nomVille === "") {
        errorMessage.textContent = "Veuillez saisir une ville";
        errorMessage.classList.remove("hidden");
        return;
    }

    errorMessage.classList.add("hidden");
    chargement.classList.remove("hidden");

    try {
        const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(nomVille)}&count=1`;

        const resultat = await fetch(url);

        if (!resultat.ok) {
            throw new Error("Erreur lors de la recherche");
        }

        const data = await resultat.json();

        if (!data.results || data.results.length === 0) {
            errorMessage.textContent = "Ville introuvable";
            errorMessage.classList.remove("hidden");
            return;
        }

        const latitude = data.results[0].latitude;
        const longitude = data.results[0].longitude;

        console.log(latitude, longitude);

    } catch (error) {
        errorMessage.textContent = "Une erreur est survenue. Réessayez.";
        errorMessage.classList.remove("hidden");

    } finally {
        chargement.classList.add("hidden");
    }
});


