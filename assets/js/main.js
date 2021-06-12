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

    if(!found)
    {
        //Get Data from wrappers
        var pokemonData = await GetPokemonData(pokemonName);
        if(pokemonData === null)
        {
            //TODO: Search failed: Add Error Handling
            return;
        }
        var tcgData = await GetTCGDataByName(pokemonName);
        if(tcgData === null)
        {
            //TODO: Search failed: Add Error Handling
            return;
        }

        DisplayData(pokemonData, tcgData);
    }
}

//Call apis using the pokemon's pokedex number
async function SearchPokemonByNumber(pokemonNumber) 
{
    var found = CheckPreviousSearchesByNumber(pokemonNumber);

    if(!found)
    {
        //Get Data from wrappers
        var pokemonData = await GetPokemonData(pokemonNumber);
        if(pokemonData === null)
        {
            //TODO: Search failed: Add Error Handling
            return;
        }
        var tcgData = await GetTCGDataByNumber(pokemonNumber);
        if(tcgData === null)
        {
            //TODO: Search failed: Add Error Handling
            return;
        }

        DisplayData(pokemonData, tcgData);
    }
}

//Display the data to the DOM
function DisplayData(pokemonData, tcgData)
{
    //Display data to html
    document.querySelector(".official-artwork").src = pokemonData.officalArtwork;
    document.querySelector(".pokemon-name").textContent = pokemonData.name;
    document.querySelector(".pokemon-number").textContent = pokemonData.pokedexNum;
    document.querySelector(".pokemon-generation").textContent = pokemonData.generation;
    document.querySelector(".pokemon-type").textContent = pokemonData.type;
    document.querySelector(".evolution-chain").textContent = pokemonData.evolutionChain;
    document.querySelector(".flavor-text").textContent = pokemonData.flavorText;

    //Display TCG Cards
    var tcgRows = document.querySelector(".tcg-rows");
    tcgRows.innerHTML = "";
    var numArray = RandomNumbersNonRepeating(tcgData.length);
    for(var i = 0; i < numArray.length; i++)
    {
        var divEl = document.createElement("div");
        divEl.classList = "small-12 medium-4 columns";

        var imgEl = document.createElement("img");
        imgEl.src = tcgData[numArray[i]];

        divEl.append(imgEl);
        tcgRows.append(divEl);
    }

    SaveSearchData(pokemonData, tcgData);
}

//Randomize a pokedex number
function RandomizePokemon() 
{
    var randomNumber = Math.floor(Math.random() * 897) + 1;
    SearchPokemonByNumber(randomNumber);
}

//Randomize a set up of numbers from 1 to max num without reapeading any numbers
function RandomNumbersNonRepeating(maxNum) 
{
    //Change this to display more to screen
    var maxNumbersToDisplay = 5;

    var length = Math.min(maxNumbersToDisplay, maxNum);
    var numArray = [];

    while(length != numArray.length)
    {
        var randomNumber = Math.floor(Math.random() * maxNum);

        var found = false;

        for(var j = 0; j < numArray.length; j++)
        {
            if(numArray[j] == randomNumber)
            {
                found = true;
                break;
            }
        }
        if(!found)
            numArray.push(randomNumber);
    }

    console.log(numArray);
    return numArray;
}

//Save all our previous search data
function SaveSearchData(pokemonData, tcgData) 
{
    //Add search to previous search list
    for(var i = 0; i < previousSearches.length; i++)
    {
        if(previousSearches[i].pokemonName == pokemonData.name)
        {
            //Already in previous searches
            return;
        }
    }

    //Only save up to 10 searches
    if(previousSearches.length >= 10)
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
    if(!previousSearches)
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
     for(var i = 0; i < previousSearches.length; i++)
     {
         if(previousSearches[i].pokemonName == pokemonName)
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
     for(var i = 0; i < previousSearches.length; i++)
     {
         if(previousSearches[i].pokemonData.pokemonNum == pokemonNum)
         {
            DisplayData(previousSearches[i].pokemonData, previousSearches[i].tcgData);
            return true;
         }
     }
     return false;
}

LoadSearchData();