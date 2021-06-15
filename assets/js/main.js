class SaveData
{
    constructor(pokemonName, pokemonData, tcgData)
    {
        this.pokemonName = pokemonName;
        this.pokemonData = pokemonData;
        this.tcgData = tcgData;
    }
}

var previousSearches = [];

//Call apis using the pokemon's name
async function SearchPokemonByName(pokemonName) 
{
    var found = CheckPreviousSearchesByName(pokemonName);

    if (!found)
    {
        //Get Data from wrappers
        var pokemonData = await GetPokemonData(pokemonName);
        if (pokemonData === null)
        {
            document.querySelector(".error-text").textContent = "Could not find: " + pokemonName;
            return;
        }
        var tcgData = await GetTCGDataByName(pokemonName);
        if (tcgData === null)
        {
            document.querySelector(".error-text").textContent = "Could not find: " + pokemonName;
            return;
        }

        document.querySelector(".error-text").textContent = "";
        DisplayData(pokemonData, tcgData);
    }
}

//Call apis using the pokemon's pokedex number
async function SearchPokemonByNumber(pokemonNumber) 
{
    var found = CheckPreviousSearchesByNumber(pokemonNumber);

    if (!found)
    {
        //Get Data from wrappers
        var pokemonData = await GetPokemonData(pokemonNumber);
        if (pokemonData === null)
        {
            document.querySelector(".error-text").textContent = "Could not find number: " + pokemonNumber;
            return;
        }
        var tcgData = await GetTCGDataByNumber(pokemonNumber);
        if (tcgData === null)
        {
            document.querySelector(".error-text").textContent = "Could not find number: " + pokemonNumber;
            return;
        }
        document.querySelector(".error-text").textContent = "";
        DisplayData(pokemonData, tcgData);
    }
}

//Display the data to the DOM
function DisplayData(pokemonData, tcgData)
{
    //Display data to html
    document.querySelector(".official-artwork").src = pokemonData.officalArtwork;
    //Capalize the first letter
    var pokemonName = pokemonData.name[0].toUpperCase() + pokemonData.name.slice(1);
    document.querySelector(".pokemon-name").textContent = pokemonName;
    document.querySelector(".pokemon-number").textContent = "Pokedex #: " + pokemonData.pokedexNum;
    //Replace Roman numerals with intergers (pokemon generations only go to 8 so will hardcode it)
    var generation = pokemonData.generation;
    switch (generation)
    {
        case "generation-i":
            generation = "Generation: 1";
            break;
        case "generation-ii":
            generation = "Generation: 2";
            break;
        case "generation-iii":
            generation = "Generation: 3";
            break;
        case "generation-iv":
            generation = "Generation: 4";
            break;
        case "generation-v":
            generation = "Generation: 5";
            break;
        case "generation-vi":
            generation = "Generation: 6";
            break;
        case "generation-vii":
            generation = "Generation: 7";
            break;
        case "generation-viii":
            generation = "Generation: 8";
            break;
    }
    document.querySelector(".pokemon-generation").textContent = generation;
    document.querySelector(".pokemon-type").textContent = "Type(s): " + pokemonData.type;
    document.querySelector(".evolution-chain").textContent = "Evolutions: " + pokemonData.evolutionChain;
    document.querySelector(".flavor-text").textContent = pokemonData.flavorText;

    var mainType = "";
    mainType = pokemonData.type.split(",")[0];
    console.log(mainType);
    document.querySelector(".card-divider").classList = "card-divider " + mainType;

    //Clear out previous cards then add new ones
    var pokeCards = document.querySelector(".pokemon-cards");
    pokeCards.innerHTML = "";
    for (var i = 0; i < tcgData.length; i++)
    {
        var divEl = document.createElement("div");
        divEl.classList = "tcg-card cell small-auto medium-6 large-2";

        var imgEl = document.createElement("img");
        imgEl.src = tcgData[i];

        divEl.append(imgEl);
        pokeCards.append(divEl);
    }

    SaveSearchData(pokemonData, tcgData);
}

//Randomize a pokedex number
function RandomizePokemon() 
{
    var randomNumber = Math.floor(Math.random() * 897) + 1;
    SearchPokemonByNumber(randomNumber);
}

//Save all our previous search data
function SaveSearchData(pokemonData, tcgData) 
{
    //Add search to previous search list
    for (var i = 0; i < previousSearches.length; i++)
    {
        if (previousSearches[i].pokemonName == pokemonData.name)
        {
            //Already in previous searches
            return;
        }
    }

    //Only save up to 10 searches
    if (previousSearches.length >= 10)
        previousSearches.shift();

    var data = new SaveData(pokemonData.name, pokemonData, tcgData);
    previousSearches.push(data);

    localStorage.setItem("previousSearches", JSON.stringify(previousSearches));
}

//Load previous Searches
function LoadSearchData() 
{
    previousSearches = JSON.parse(localStorage.getItem("previousSearches"));

    //If there is no previous Searches, then load a random pokemon
    if (!previousSearches)
    {
        previousSearches = [];
        RandomizePokemon();
    }
    else
    {
        DisplayData(previousSearches[0].pokemonData, previousSearches[0].tcgData);
    }
}

//Check previous searches for save data to save api calls
function CheckPreviousSearchesByName(pokemonName) 
{
    //Add search to previous search list
    for (var i = 0; i < previousSearches.length; i++)
    {
        if (previousSearches[i].pokemonName == pokemonName)
        {
            DisplayData(previousSearches[i].pokemonData, previousSearches[i].tcgData);
            return true;
        }
    }
    return false;
}

//Check previous searches for save data to save api calls
function CheckPreviousSearchesByNumber(pokemonNum) 
{
    //Add search to previous search list
    for (var i = 0; i < previousSearches.length; i++)
    {
        if (previousSearches[i].pokemonData.pokemonNum == pokemonNum)
        {
            DisplayData(previousSearches[i].pokemonData, previousSearches[i].tcgData);
            return true;
        }
    }
    return false;
}

//Search for pokemon
document.querySelector(".search-button").addEventListener("click", function () 
{
    var searchTerm = document.querySelector(".input-group-field").value;
    document.querySelector(".input-group-field").value = "";
    if (searchTerm == "")
        return;

    if (Number.isInteger(parseInt(searchTerm)))
        SearchPokemonByNumber(parseInt(searchTerm));
    else
        SearchPokemonByName(searchTerm);
});

// Execute a function when the user releases a key on the keyboard
document.querySelector(".input-group-field").addEventListener("keyup", function (event)
{
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) 
    {
        // Cancel the default action, if needed
        event.preventDefault();
        // Trigger the button element with a click
        document.querySelector(".search-button").click();
    }
});

//Randomize a pokemon to search
document.querySelector(".random-button").addEventListener("click", function () 
{
    document.querySelector(".input-group-field").value = "";
    RandomizePokemon();
});

LoadSearchData();