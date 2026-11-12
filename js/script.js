
const form = document.getElementById("form-recherche");
const ville = document.getElementById("ville");
const errorMessage = document.getElementById("message-erreur");
const chargement = document.getElementById("chargement");
const resultatMeteoContainer = document.getElementById("resultat-meteo");

const WEATHER_CODES = {
    0:  { label: "Ciel dégagé", icon: "☀️" },
    1:  { label: "Plutôt dégagé", icon: "🌤️" },
    2:  { label: "Partiellement nuageux", icon: "⛅" },
    3:  { label: "Couvert", icon: "☁️" },
    45: { label: "Brouillard", icon: "🌫️" },
    48: { label: "Brouillard givrant", icon: "🌫️" },
    51: { label: "Bruine légère", icon: "🌦️" },
    53: { label: "Bruine", icon: "🌦️" },
    55: { label: "Bruine forte", icon: "🌦️" },
    56: { label: "Bruine verglaçante", icon: "🌧️" },
    57: { label: "Bruine verglaçante", icon: "🌧️" },
    61: { label: "Pluie légère", icon: "🌧️" },
    63: { label: "Pluie", icon: "🌧️" },
    65: { label: "Pluie forte", icon: "🌧️" },
    66: { label: "Pluie verglaçante", icon: "🌧️" },
    67: { label: "Pluie verglaçante", icon: "🌧️" },
    71: { label: "Neige légère", icon: "🌨️" },
    73: { label: "Neige", icon: "🌨️" },
    75: { label: "Neige forte", icon: "❄️" },
    77: { label: "Grains de neige", icon: "🌨️" },
    80: { label: "Averses légères", icon: "🌦️" },
    81: { label: "Averses", icon: "🌧️" },
    82: { label: "Averses violentes", icon: "⛈️" },
    85: { label: "Averses de neige", icon: "🌨️" },
    86: { label: "Fortes averses de neige", icon: "❄️" },
    95: { label: "Orage", icon: "⛈️" },
    96: { label: "Orage avec grêle", icon: "⛈️" },
    99: { label: "Orage avec forte grêle", icon: "⛈️" }
};

form.addEventListener("submit", async function(event) {
    event.preventDefault();

    const nomVille = ville.value.trim();

    if (nomVille === "") {
        errorMessage.textContent = "Veuillez saisir une ville";
        errorMessage.classList.remove("hidden");
        return;
    }

    errorMessage.classList.add("hidden");
    resultatMeteoContainer.textContent = "";
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
        const nomVilleAPI = data.results[0].name;


        const urlMeteo = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto&forecast_days=5`;

        const resultatMeteo = await fetch(urlMeteo);

        if (!resultatMeteo.ok) {
            throw new Error("Erreur lors de la récupération de la météo");
        }

        const dataMeteo = await resultatMeteo.json();
        console.log(dataMeteo.daily);
           

        const temperature = dataMeteo.current.temperature_2m;
        const humidite = dataMeteo.current.relative_humidity_2m;
        const vent = dataMeteo.current.wind_speed_10m;
        const codeMeteo = dataMeteo.current.weather_code;

        const condition = WEATHER_CODES[codeMeteo] || {
            label: "Météo inconnue",
            icon: "🌍"
        };

   
        const carte = document.createElement("div");
        carte.className = "rounded-2xl border border-slate-700 bg-[#172338] p-6 shadow-xl";

       
        const entete = document.createElement("div");
        entete.className = "flex items-start justify-between gap-4";

        const infos = document.createElement("div");

        const sousTitre = document.createElement("p");
        sousTitre.textContent = "MÉTÉO ACTUELLE";
        sousTitre.className = "mb-2 text-xs font-semibold tracking-widest text-slate-400";

        const titre = document.createElement("h2");
        titre.textContent = nomVilleAPI;
        titre.className = "text-2xl font-bold text-white";

        const description = document.createElement("p");
        description.textContent = condition.label;
        description.className = "mt-2 text-slate-300";

        const icone = document.createElement("span");
        icone.textContent = condition.icon;
        icone.className = "text-6xl";
        icone.setAttribute("aria-hidden", "true");

        infos.append(sousTitre, titre, description);
        entete.append(infos, icone);

     
        const temperatureElement = document.createElement("p");
        temperatureElement.textContent = `${temperature} °C`;
        temperatureElement.className = "mt-6 text-5xl font-bold text-white";

       
        const separation = document.createElement("hr");
        separation.className = "my-6 border-slate-700";

        
        const humiditeElement = document.createElement("div");
        humiditeElement.className = "rounded-xl bg-[#0B1220] p-4";

        const humiditeTitre = document.createElement("p");
        humiditeTitre.textContent = "💧 Humidité";
        humiditeTitre.className = "text-sm text-slate-400";

        const humiditeValeur = document.createElement("p");
        humiditeValeur.textContent = `${humidite} %`;
        humiditeValeur.className = "mt-2 text-xl font-semibold text-white";

        humiditeElement.append(humiditeTitre, humiditeValeur);

       
        const ventElement = document.createElement("div");
        ventElement.className = "rounded-xl bg-[#0B1220] p-4";

        const ventTitre = document.createElement("p");
        ventTitre.textContent = "💨 Vent";
        ventTitre.className = "text-sm text-slate-400";

        const ventValeur = document.createElement("p");
        ventValeur.textContent = `${vent} km/h`;
        ventValeur.className = "mt-2 text-xl font-semibold text-white";

        ventElement.append(ventTitre, ventValeur);

        const details = document.createElement("div");
        details.className = "grid grid-cols-1 gap-4 sm:grid-cols-2";

        details.append(humiditeElement, ventElement);

        carte.append(
            entete,
            temperatureElement,
            separation,
            details
        );

        resultatMeteoContainer.replaceChildren(carte);

        const sectionPrevisions = document.createElement("section");
        sectionPrevisions.className = "mt-6";

        const titrePrevisions = document.createElement("h2");
        titrePrevisions.textContent = "Prévisions sur 5 jours";
        titrePrevisions.className = "mb-4 text-xl font-bold text-white";

        const listePrevisions = document.createElement("div");
        listePrevisions.className = "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5";

        sectionPrevisions.append(titrePrevisions, listePrevisions);
        resultatMeteoContainer.append(sectionPrevisions);

        dataMeteo.daily.time.forEach(function(date, index) {
        const dateFormatee = new Date(date + "T12:00:00").toLocaleDateString("fr-FR", {
            weekday: "long",
            day: "numeric",
            month: "long"
            });
            const carteJour =  document.createElement("div")
            carteJour.className = "rounded-2xl border border-slate-700 bg-[#172338] p-6 shadow-xl"
            const dateElement = document.createElement("div")
            dateElement.textContent = dateFormatee

            const max = dataMeteo.daily.temperature_2m_max[index]
            const min = dataMeteo.daily.temperature_2m_min[index]

            const maxElement = document.createElement("p")
            const minElement = document.createElement("p")

            if (max === null || max === undefined) {
            maxElement.textContent = "Max : Données indisponibles";
            } else {
            maxElement.textContent = `Max : ${max} °C`;
            }

            if (min === null || min === undefined) {
            minElement.textContent = "Min : Données indisponibles";
            } else {
                minElement.textContent = `Min : ${min} °C`;
            }
            



            const codeJour = dataMeteo.daily.weather_code[index]
            const conditionJour = WEATHER_CODES[codeJour] || {
            label: "Données indisponibles",
            icon: "🌍"
            };


            const icon = document.createElement("span")
            const descriptionJour = document.createElement("p")

            icon.textContent = conditionJour.icon 
            descriptionJour.textContent = conditionJour.label

            icon.className = "text-4xl";
            descriptionJour.className = "text-sm text-slate-300";

            carteJour.append(icon, descriptionJour);
            carteJour.append(dateElement, maxElement, minElement, icon, descriptionJour);
            listePrevisions.append(carteJour);
            
        });

    } catch (error) {
        console.error(error);
        errorMessage.textContent = "Une erreur est survenue. Réessayez.";
        errorMessage.classList.remove("hidden");

    } finally {
        chargement.classList.add("hidden");
    }
});
