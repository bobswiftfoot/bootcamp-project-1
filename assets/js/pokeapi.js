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
    if(typeof(pokemonName) === typeof(""))
        pokemonName = pokemonName.toLowerCase().trim();
    var apiString = "https://pokeapi.co/api/v2/pokemon/" + pokemonName;

    //Get inital call data
    let pokemonResponse = await fetch(apiString);
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

    //Create a string of types in the case of 2 type pokemon and Caps the first letter of each type
    var types = "";
    for(var i = 0; i < pokemonData.types.length; i++)
    {
        if(!types)
        {
            types = pokemonData.types[i].type.name[0].toUpperCase() + pokemonData.types[i].type.name.slice(1);
        }
        else
        {
            types += ", " + pokemonData.types[i].type.name[0].toUpperCase() + pokemonData.types[i].type.name.slice(1);
        }
    }

    var officalArtwork = pokemonData.sprites.other["official-artwork"].front_default;

    //Call species url to get generation name and flavor text
    let speciesResponse = await fetch(pokemonData.species.url);
    var speciesData = null;
    if(speciesResponse.ok)
    {
        speciesData = await speciesResponse.json();
    }
    else
    {
        console.log(speciesResponse.status + ":" + speciesResponse.statusText);
        return null; 
    }
    console.log(speciesData);

    //Search for first flavor text in en
    var flavorText = "";
    for(var i = 0; i < speciesData.flavor_text_entries.length; i++)
    {
        if(speciesData.flavor_text_entries[i].language.name == "en")
        {
            //Replace newlines and form feeds with spaces to make this look nicer
            flavorText = speciesData.flavor_text_entries[i].flavor_text;
            flavorText = flavorText.replace(/\n/g, ' ')
            flavorText = flavorText.replace("\f", " ");
            break;
        }
    }

    //Call evolution chain url
    let evoResponse = await fetch(speciesData.evolution_chain.url);
    var evoData = null;
    if(evoResponse.ok)
    {
        evoData = await evoResponse.json();
    }
    else
    {
        console.log(evoResponse.status + ":" + evoResponse.statusText);
        return null; 
    }
    console.log(evoData);

    //Start the string with the first name
    var evolutionChain = evoData.chain.species.name[0].toUpperCase() + evoData.chain.species.name.slice(1);
    var evolvesTo = evoData.chain.evolves_to;
    while(evolvesTo.length)
    {
        evolutionChain += " => " + evolvesTo[0].species.name[0].toUpperCase() +  evolvesTo[0].species.name.slice(1);
        if(evolvesTo.length == 1)
            evolvesTo = evolvesTo[0].evolves_to;
        else
        {
            //Check for pokemon with multiple evolutions
            for(var i = 1; i < evolvesTo.length; i++)
            {
                evolutionChain += " or " + evolvesTo[i].species.name[0].toUpperCase() +  evolvesTo[i].species.name.slice(1);
            }
            evolvesTo = evolvesTo[0].evolves_to;
        }
    }

    const pokeData = new PokemonData(pokemonData.name, pokemonData.id, speciesData.generation.name, types, evolutionChain, flavorText, officalArtwork);
    return pokeData;
}

// //Used for testing
// async function main()
// {
//     var data = await GetPokemonData("charizard");
//     console.log(data);
//     var data = await GetPokemonData("spoink");
//     console.log(data);
// }

// main();