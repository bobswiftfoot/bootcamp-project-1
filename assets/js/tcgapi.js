async function GetTCGData(pokemonName)
{
    pokemonName = pokemonName.toLowerCase();
    var apiString = "https://api.pokemontcg.io/v1/cards?name=" + pokemonName.trim();

    //Get inital call data
    let pokemonResponse = await fetch(apiString)
    let pokemonData = await pokemonResponse.json();
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
//     var data = await GetTCGData("charizard");
//     console.log(data);
//     var data = await GetTCGData("pikachu");
//     console.log(data);
// }

// main();