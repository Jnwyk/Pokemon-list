axios.get('https://pokeapi.co/api/v2/pokemon-species/')
    .then((data) =>{
        return data.data;
    })
    .then((data) => {
        const pokemon = data.results.map((element) => element);
        const pokemonList = pokemon.map((element) => addToList(element));
        let htmlListElement = document.getElementById('pokemon-list');
        pokemonList.forEach(element => {
            htmlListElement.appendChild(element); 
        });
    })
    .catch((err) => {
        console.log(err);
    })

// const fetchPokemonInfo = async (url) => {
//     const pokemonData = await axios.get(url)
//         .then(data => {
//             pokemonInfo(data.data);
//             return data.data
//         })
//         .catch(err =>{
//             console.log(err);
//         })
//     return pokemonData;
// }

const fetchPokemonData = async (url) => {
    const pokemonStats = await axios.get(url)
        .then(data => {
            return data.data
        })
        .catch(err => {
            console.log(err);
        })
    return pokemonStats;
}

const rightSide = async (pokemon) => {
    const pokemonInfo = await fetchPokemonData(pokemon.url)
    const pokemonStats = await fetchPokemonData(`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`)
    basicInfoHandler([pokemonInfo, pokemonStats]);
}

const addToList = (pokemon) => {
    const newElem = document.createElement("li");
    newElem.innerText = pokemon.name;
    newElem.addEventListener('click', () => rightSide(pokemon));
    return newElem;
}

const createAnElement = (elementName, className, content) => {
    const newElement = document.createElement(elementName);
    newElement.className = className;
    newElement.innerText = content;
    return newElement;
}


const clearContainers = (containers) => {
    containers.forEach((element) => element.innerHTML = ``);
}

const basicInfoHandler = (pokemonData) => {
    console.log(pokemonData);
    [pokemonInfo, pokemonStats] = pokemonData;
    
    const nameContainer = document.getElementById('name-container');
    const imgAndDescContainer = document.getElementById('img-disc-container');

    clearContainers([nameContainer, imgAndDescContainer]);
    
    const nameElement = createAnElement('h3', 'pokemon-name', pokemonInfo.name);
    const englishDescription = pokemonInfo.flavor_text_entries.find((element) => element.language.name === 'en');
    const descriptionElement = createAnElement('p', 'pokemon-description', englishDescription.flavor_text);
    const typeContainer = createAnElement('div', 'type-container', '');
    const typeElements = pokemonStats.types.map((element) => createAnElement('p', 'pokemon-type', element.type.name));
    const imgElement = createAnElement('img', 'main-picture', '');
    imgElement.setAttribute('src', pokemonStats.sprites.front_default);
    imgElement.setAttribute('alt', 'front picture');

    nameContainer.appendChild(nameElement);
    nameContainer.appendChild(typeContainer);
    typeElements.forEach((element) => typeContainer.appendChild(element));
    imgAndDescContainer.appendChild(imgElement);
    imgAndDescContainer.appendChild(descriptionElement);
}
