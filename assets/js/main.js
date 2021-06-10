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
    //TODO: Change 2 to how many cards we want to display
    //TODO: Random cards from the list?
    for(var i = 0; i < 2; i++)
    {
        var divEl = document.createElement("div");
        divEl.classList = "small-12 medium-4 columns";

        var imgEl = document.createElement("img");
        imgEl.src = tcgData[i];

        divEl.append(imgEl);
        tcgRows.append(divEl);
    }
}

SearchPokemonByName("Charizard");