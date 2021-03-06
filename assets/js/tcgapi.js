async function GetTCGDataByName(pokemonName)
{
    pokemonName = pokemonName.toLowerCase();
    var apiString = "https://api.pokemontcg.io/v1/cards?name=\"" + pokemonName.trim() + "\"&pageSize=150";
    console.log(apiString);
    //Get inital call data
    let pokemonResponse = await fetch(apiString)
    var pokemonData = null;
    if(pokemonResponse.ok)
    {
        pokemonData = await pokemonResponse.json();
    }
    else
    {
        console.log(pokemonResponse.status + ":" + pokemonResponse.statusText);
        return null;
    }
    console.log(pokemonData);

    //Get all the tcg images that are returned. (Api only returns up to 100 results)
    var tcgImgs = [];
    for(var i = 0; i < pokemonData.cards.length; i++)
    {
        tcgImgs.push(pokemonData.cards[i].imageUrl);
    }

    return tcgImgs;
}

async function GetTCGDataByNumber(pokemonNumber)
{
    var apiString = "https://api.pokemontcg.io/v1/cards?nationalPokedexNumber=" + pokemonNumber + "&pageSize=150";
    
    //Get inital call data
    let pokemonResponse = await fetch(apiString)
    var pokemonData = null;
    if(pokemonResponse.ok)
    {
        pokemonData = await pokemonResponse.json();
    }
    else
    {
        console.log(pokemonResponse.status + ":" + pokemonResponse.statusText);
        return null;
    }
    console.log(pokemonData);

    //Get all the tcg images that are returned. (Api only returns up to 100 results)
    var tcgImgs = [];
    for(var i = 0; i < pokemonData.cards.length; i++)
    {
        tcgImgs.push(pokemonData.cards[i].imageUrl);
    }

    return tcgImgs;
}

// //Used for testing
// async function main()
// {
//     var data = await GetTCGDataByName("charizard");
//     console.log(data);
//     var data = await GetTCGDataByNumber("18");
//     console.log(data);
// }

// main();