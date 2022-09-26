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
    const data = await axios.get(url)
        .then(data => {
            return data.data
        })
        .catch(err => {
            console.log(err);
        })
    return data;
}

const rightSide = async (pokemon) => {
    const pokemonInfo = await fetchPokemonData(pokemon.url)
    const pokemonStats = await fetchPokemonData(`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`)
    basicInfoHandler([pokemonInfo, pokemonStats]);
    statsHandler(pokemonStats);
    movesHandler(pokemonStats);
}

const addToList = (pokemon) => {
    const newElem = document.createElement("li");
    newElem.innerText = pokemon.name;
    newElem.addEventListener('click', () => rightSide(pokemon));
    return newElem;
}

const createAnElement = (elementName, className, content, isClass) => {
    const newElement = document.createElement(elementName);
    if(!isClass)
        newElement.setAttribute('id', className);
    else
        newElement.className = className;
    newElement.innerText = content;
    return newElement;
}

const clearContainers = (containers) => {
    containers.forEach((element) => element.innerHTML = ``);
}

const basicInfoHandler = (pokemonData) => {
    [pokemonInfo, pokemonStats] = pokemonData;
    
    const nameContainer = document.getElementById('name-container');
    const imgAndDescContainer = document.getElementById('img-disc-container');

    clearContainers([nameContainer, imgAndDescContainer]);
    
    const nameElement = createAnElement('h3', 'pokemon-name', pokemonInfo.name, false);
    const englishDescription = pokemonInfo.flavor_text_entries.find((element) => element.language.name === 'en');
    const descriptionElement = createAnElement('p', 'pokemon-description', englishDescription.flavor_text, false);
    const typeContainer = createAnElement('div', 'type-container', '', false);
    const typeElements = pokemonStats.types.map((element) => createAnElement('p', 'pokemon-type', element.type.name));
    const imgElement = createAnElement('img', 'main-picture', '', false);
    imgElement.setAttribute('src', pokemonStats.sprites.front_default);
    imgElement.setAttribute('alt', 'front picture');

    nameContainer.appendChild(nameElement);
    nameContainer.appendChild(typeContainer);
    typeElements.forEach((element) => typeContainer.appendChild(element));
    imgAndDescContainer.appendChild(imgElement);
    imgAndDescContainer.appendChild(descriptionElement);
}

const statsHandler = (pokemonData) => {
    const statContainer = document.getElementById('stats-container');
    const infoStatsContainer = document.getElementById('info-stats-container');

    clearContainers([infoStatsContainer]);

    const statsElements = pokemonData.stats.map((element) => {
        const nameElement = createAnElement('p', 'stat-name', element.stat.name, true);
        const barElement = createAnElement('div', 'bar', '', true);
        const baseStatElement = createAnElement('p', 'base-stat', element.base_stat, true);
        const statElement = createAnElement('div', 'one-stat-container', '', true);

        statElement.appendChild(nameElement);
        statElement.appendChild(barElement);
        statElement.appendChild(baseStatElement);
        return statElement;
    })

    statsElements.forEach((element) => infoStatsContainer.appendChild(element));
    statContainer.appendChild(infoStatsContainer);
}

const movesHandler = async (pokemonData) => {
    const movesContainer = document.getElementById('moves-container');

    clearContainers([movesContainer]);
    // console.log(pokemonData.moves);

    const learnedMoves = pokemonData.moves.filter((element) => {
        if(element.version_group_details[0].level_learned_at > 0)
            return element;
    });
    
    const moveElements = await learnedMoves.map(async (element) => {
        const moveElement = createAnElement('div', 'one-move-container', '', true);
        const moveDetails = await fetchPokemonData(element.move.url);
        console.log(moveDetails);

        const attackLevelContainer = createAnElement('div', 'level-container', '', true);
        const attackLevelHeader = createAnElement('p', 'level-header', 'Level', true);
        const attackLevel = createAnElement('p', 'level', element.version_group_details.level_learned_at, true);
        attackLevelContainer.appendChild(attackLevelHeader);
        attackLevelContainer.appendChild(attackLevel);

        const attackNameContainer = createAnElement('div', 'attack-container', '', true);
        const attackName = createAnElement('p', 'attack-name', moveDetails.name, true);
        const attackTypeContainer = createAnElement('div', 'attack-type-container', '', true);
        const attackType1 = createAnElement('p', 'attack-type', moveDetails.type.name, true);
        const attackType2 = createAnElement('p', 'attack-type', moveDetails.damage_class.name, true);
        attackTypeContainer.appendChild(attackType1);
        attackTypeContainer.appendChild(attackType2);
        attackNameContainer.appendChild(attackName);
        attackNameContainer.appendChild(attackTypeContainer);

        const attackStatContainer = createAnElement('div', 'attack-stat-container', '', true);
        const oneStatContainer = [createAnElement('div', 'one-stat-container', '', true), createAnElement('div', 'one-stat-container', '', true), createAnElement('div', 'one-stat-container', '', true)];
        const attackPpStat = createAnElement('p', 'attack-stat-name', moveDetails.pp, true);
        const attackPpName = createAnElement('p', 'attack-stat-name', 'pp', true);
        const attackPowerStat = createAnElement('p', 'attack-stat-name', moveDetails.power, true);
        const attackPowerName = createAnElement('p', 'attack-stat-name', 'power', true);
        const attackAccuracyStat = createAnElement('p', 'attack-stat-name', moveDetails.accuracy, true);
        const attackAccuracyName = createAnElement('p', 'attack-stat-name', 'accuracy', true);
        oneStatContainer[0].appendChild(attackPpStat);
        oneStatContainer[0].appendChild(attackPpName);
        oneStatContainer[1].appendChild(attackPowerStat);
        oneStatContainer[1].appendChild(attackPowerName);
        oneStatContainer[2].appendChild(attackAccuracyStat);
        oneStatContainer[2].appendChild(attackAccuracyName);
        oneStatContainer.forEach((element) => attackStatContainer.appendChild(element));

        moveElement.appendChild(attackLevelContainer);
        moveElement.appendChild(attackNameContainer);
        moveElement.appendChild(attackStatContainer);
        return await moveElement;
    })

    for(let elementPromise of moveElements){
        const element = await elementPromise;
        movesContainer.appendChild(element);
    }
}
