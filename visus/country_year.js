var width = 960, // Taille de la carte ajustée pour l'Afrique
    height = 700;

var jsonData;
var cleanData; 

// Tableau des colonnes numériques disponibles à afficher
const dimensions = [
    "temperature", 
    "humidity", 
    "precipitation", 
    "wind_speed",
    "wetbulb_temperature",
    "WUE_FixedApproachDirect(L/KWh)", 
    "WUE_FixedColdWaterDirect(L/KWh)", 
    "WUE_Indirect(L/KWh)", 
    "Leakages (%)",
    "Total energy - TWh",
    "Total renewables - TWh",
    "Total fossil fuels - TWh",
    "Coal consumption - TWh",
    "Gas consumption - TWh",
    "Oil consumption - TWh",
    "Low carbon - TWh",
    "Other - TWh"
];
// Dimension initiale
var currentDimension = dimensions[0]; 
var currentYear = "2022";

var tooltip = d3.select('body').append('div').attr('class', 'hidden tooltip');

var svg = d3
    .select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

var g = svg.append("g");

// Utiliser une projection Mercator pour une meilleure représentation de l'Afrique
// Les coordonnées [longitude, latitude] sont approximatives pour centrer l'Afrique
var projection = d3.geoMercator()
    .center([20, 5]) // Centre approximatif de l'Afrique
    .scale(550) // À ajuster (plus grand pour zoomer, plus petit pour dézoomer)
    .translate([width / 2, height / 2]);

var path = d3.geoPath().projection(projection);

var color = d3
    .scaleLinear()
    // Gamme de couleurs (par exemple, du bleu clair au bleu foncé)
    .range(["#deebf7", "#08306b"]); 

/**
 * Fonction utilitaire pour obtenir la valeur numérique d'une colonne donnée.
 * @param {object} d - Ligne de données CSV
 * @param {string} column - Nom de la colonne à extraire
 * @returns {number} - La valeur numérique ou 0.
 */
function getDimensionValue(d, column = currentDimension) {
    let value = d[column];
    if (value) {
        // Le remplacement des virgules par des points est spécifique à certaines
        // conventions de formatage de nombres dans les CSV.
        // Si vos nombres CSV sont standard, ce .replace() peut ne pas être nécessaire.
        value = parseFloat(value.toString().replace(",", "."));

        return +value; // Convertir en nombre
    }
    return 0;
}

// --- Chargement des données ---
d3.csv("../data/exported/country_year_cleaned.csv").then(function (data) {
    cleanData = data; 
    
    updateColorDomain();

    // 2. Charger VOTRE GeoJSON personnalisé
    d3.json("custom.geo.json").then(function (json) { 
        jsonData = json; 
        setupDimensionSlider();

        const dataByCountry = d3.group(cleanData, d => d.country);

        for (let feature of jsonData.features) {
            const countryName = feature.properties.name;
            const lignes = dataByCountry.get(countryName) || [];

            feature.properties.donneesAnnuelles = lignes.map(row => ({
                annee: String(row.year),
                data: row
            }));
        }

        // Déterminer l'année de départ. Si vos données commencent en 2022, utilisez "2022".
        drawMap("2022"); 

        // Configurer le slider d'année

        d3.select("#year-slider").on("input", function() {
            console.log("Slider Année activé. Nouvelle valeur :", this.value);
            // Ajuster la logique de l'année en fonction de vos données et du slider
            let anneeChoisie = this.value;
            drawMap(anneeChoisie);
        });
        
    }); 
});
// --- FIN d3.csv & d3.json ---

/**
 * Met à jour le domaine de couleur (min/max) en fonction de la dimension actuelle.
 */
function updateColorDomain() {
    // Calculer le min et le max sur TOUTES les années pour la dimension actuelle
    const minVal = d3.min(cleanData, d => getDimensionValue(d, currentDimension));
    const maxVal = d3.max(cleanData, d => getDimensionValue(d, currentDimension));

    color.domain([minVal, maxVal]);
    
    // Mettre à jour la légende ici si vous en avez une
}

/**
 * Configure le slider pour choisir la dimension à afficher.
 */
function setupDimensionSlider() {
    const slider = d3.select("#dim-slider");
    const dimDisplay = d3.select('#dimension-name');

    slider
        .attr("min", 0)
        .attr("max", dimensions.length - 1)
        .attr("value", 0) // Première dimension par défaut
        .on("input", function() {
            console.log("Slider Dimension activé. Nouvelle dimension Index:", +this.value); // <-- Log à ajouter


            const index = +this.value;
            currentDimension = dimensions[index];
            
            dimDisplay.html(`Dimension : <strong>${currentDimension}</strong>`);
            
            // 1. Mettre à jour le domaine de couleur pour la nouvelle dimension
            updateColorDomain();
            
            drawMap(currentYear);
        });
        
    // Initialiser l'affichage de la dimension
    dimDisplay.html(`Dimension : <strong>${currentDimension}</strong>`);
}


/**
 * Dessine ou met à jour la carte pour l'année et la dimension courante.
 * @param {string} annee - L'année choisie (ex: "2022")
 */
function drawMap(annee) {
    currentYear = annee;
    d3.select('#year').attr("data-year", annee).html(`Année : <strong>${annee}</strong>`);

    let carte = svg.selectAll("path").data(jsonData.features);

    carte.join("path")
        .attr("class", "country-path")
        .attr("d", path)
        .style("stroke", "white")
        .style("stroke-width", "0.5px")
        .style("fill", function (d) {
            // Trouver la ligne de données pour l'année choisie
            let anneeData = d.properties.donneesAnnuelles.find(item => item.annee === annee);
            
            // Extraire la valeur de la dimension courante
            let value = 0;
            if (anneeData && anneeData.data) {
                value = getDimensionValue(anneeData.data);
            }
            
            // Retourner la couleur ou gris (#ccc) si la valeur est 0 ou non trouvée
            return value > 0 ? color(value) : "#ccc";
            // return isFinite(value) ? color(value) : "#ccc";

        })
        // Gestion de l'interactivité (tooltip)
        .on('mousemove', function (e, d) { 
            
            let anneeData = d.properties.donneesAnnuelles.find(item => item.annee === annee);
            let rawValue = (anneeData && anneeData.data) ? getDimensionValue(anneeData.data) : 0;
            let valueDisplay = rawValue > 0 ? rawValue.toFixed(2) : "N/D";
            
            // Utilisez 'e' comme l'événement et les coordonnées pageX/pageY
            var mousePosition = [e.pageX, e.pageY]; 
            
            tooltip.classed('hidden', false)
                .style('left', (mousePosition[0] + 15) + 'px')
                .style('top', (mousePosition[1] - 35) + 'px')
                .html(`<strong>${d.properties.name}</strong><br/>${currentDimension}: <strong>${valueDisplay}</strong>`);
        })
        .on('mouseout', function () {
            tooltip.classed('hidden', true);
        })
        .transition() // Ajout d'une transition pour un changement plus doux
        .duration(500);
    }