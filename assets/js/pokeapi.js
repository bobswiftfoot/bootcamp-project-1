//Create an object to hold all the pokemon data
class PokemonData
{
    constructor(name, pokedexNum, generation, type, evolutionChain, flavorText, officalArtwork)
    {
        this.name = name;
        this.pokedexNum = pokedexNum;
        this.generation = generation;
        this.type = type;
        this.evolutionChain = evolutionChain;
        this.flavorText = flavorText;
        this.officalArtwork = officalArtwork
    }
}

async function GetPokemonData(pokemonName)
{
    pokemonName = pokemonName.toLowerCase();
    var apiString = "https://pokeapi.co/api/v2/pokemon/" + pokemonName.trim();

    //Get inital call data
    let pokemonResponse = await fetch(apiString)
    let pokemonData = await pokemonResponse.json();
    console.log(pokemonData);

    //Create a string of types in the case of 2 type pokemon
    var types = "";
    for(var i = 0; i < pokemonData.types.length; i++)
    {
        if(!types)
        {
            types = pokemonData.types[i].type.name;
        }
        else
        {
            types += ", " + pokemonData.types[i].type.name;
        }
    }

    var officalArtwork = pokemonData.sprites.other["official-artwork"].front_default;

    //Call species url to get generation name and flavor text
    let speciesResponse = await fetch(pokemonData.species.url);
    let speciesData = await speciesResponse.json();
    console.log(speciesData);

    var flavorText =  speciesData.flavor_text_entries[0].flavor_text;
    flavorText = flavorText.replace(/\n/g, ' ')
    flavorText = flavorText.replace("\f", " ");

    //Call evolution chain url
    let evoResponse = await fetch(speciesData.evolution_chain.url);
    let evoData = await evoResponse.json();
    console.log(evoData);

    //Start the string with the first name
    var evolutionChain = evoData.chain.species.name;
    var evolvesTo = evoData.chain.evolves_to;
    while(evolvesTo.length)
    {
        evolutionChain += " => " + evolvesTo[0].species.name;
        evolvesTo = evolvesTo[0].evolves_to;
    }

    const pokeData = new PokemonData(pokemonData.name, pokemonData.id, speciesData.generation.name, types, evolutionChain, flavorText, officalArtwork);
    return pokeData;
}

async function main()
{
    var data = await GetPokemonData("charizard");
    console.log(data);
    var data = await GetPokemonData("spoink");
    console.log(data);
}

main();