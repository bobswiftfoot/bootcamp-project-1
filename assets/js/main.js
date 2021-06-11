async function SearchPokemonByName(pokemonName) 
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
}

async function SearchPokemonByNumber(pokemonNumber) 
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
}

function RandomizePokemon() 
{
    var randomNumber = Math.floor(Math.random() * 897) + 1;
    SearchPokemonByNumber(randomNumber);
}

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

//SearchPokemonByName("Charizard");
RandomizePokemon();