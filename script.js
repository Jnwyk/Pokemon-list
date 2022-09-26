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
    const newElem = createAnElement('li', 'list-element', pokemon.name, true);
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
    const typeElements = pokemonStats.types.map((element) => {
        const typeElement = createAnElement('p', 'pokemon-type', element.type.name, true);
        handleTypeColors(typeElement, element.type.name);
        return typeElement;
    });
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
    const statTitle = createAnElement('h3', 'basic-stats-name', 'Basic stats', false);

    clearContainers([statContainer, infoStatsContainer]);

    const statsElements = pokemonData.stats.map((element) => {
        const nameElement = createAnElement('p', 'stat-name', element.stat.name, true);
        const barElement = createAnElement('div', 'bar', '', true);
        const barElement2 = createAnElement('div', 'bar2', '', true);
        const baseStatElement = createAnElement('p', 'base-stat', element.base_stat, true);
        const statElement = createAnElement('div', 'one-stat-container', '', true);
        barElement2.style.width = `${(120 * element.base_stat) / 100}px`;

        statElement.appendChild(nameElement);
        statElement.appendChild(barElement);
        statElement.appendChild(barElement2);
        statElement.appendChild(baseStatElement);
        return statElement;
    });

    statsElements.forEach((element) => infoStatsContainer.appendChild(element));
    statContainer.appendChild(statTitle);
    statContainer.appendChild(infoStatsContainer);
}

const movesHandler = async (pokemonData) => {
    const movesContainer = document.getElementById('moves-container');

    clearContainers([movesContainer]);

    const learnedMoves = pokemonData.moves.filter((element) => {
        if(element.version_group_details[0].level_learned_at > 0)
            return element;
    });
    
    const moveElements = await learnedMoves.map(async (element) => {
        const moveElement = createAnElement('div', 'one-move-container', '', true);
        const moveDetails = await fetchPokemonData(element.move.url);

        const attackLevelContainer = createAnElement('div', 'level-container', '', true);
        const attackLevelHeader = createAnElement('p', 'level-header', 'Level', true);
        const attackLevel = createAnElement('p', 'level', element.version_group_details[0].level_learned_at, true);
        attackLevelContainer.appendChild(attackLevelHeader);
        attackLevelContainer.appendChild(attackLevel);

        const attackNameContainer = createAnElement('div', 'attack-container', '', true);
        const attackName = createAnElement('p', 'attack-name', moveDetails.name, true);
        const attackTypeContainer = createAnElement('div', 'attack-type-container', '', true);
        const attackType1 = createAnElement('p', 'pokemon-type', moveDetails.type.name, true);
        const attackType2 = createAnElement('p', 'pokemon-type', moveDetails.damage_class.name, true);
        attackTypeContainer.appendChild(attackType1);
        attackTypeContainer.appendChild(attackType2);
        handleTypeColors(attackType1, moveDetails.type.name);
        handleTypeColors(attackType2, moveDetails.damage_class.name);
        attackNameContainer.appendChild(attackName);
        attackNameContainer.appendChild(attackTypeContainer);

        const attackStatContainer = createAnElement('div', 'attack-stat-container', '', true);
        const oneStatContainer = [createAnElement('div', 'attack-one-stat-container', '', true), createAnElement('div', 'attack-one-stat-container', '', true), createAnElement('div', 'attack-one-stat-container', '', true)];
        const attackPpStat = createAnElement('p', 'attack-stat', `${moveDetails.pp ? moveDetails.pp : 0} pp`, true);
        const attackPowerStat = createAnElement('p', 'attack-stat', `${moveDetails.power ? moveDetails.power : 0} power`, true);
        const attackAccuracyStat = createAnElement('p', 'attack-stat', `${moveDetails.accuracy ? moveDetails.accuracy : 0} accuracy`, true);
        oneStatContainer[0].appendChild(attackPpStat);
        oneStatContainer[1].appendChild(attackPowerStat);
        oneStatContainer[2].appendChild(attackAccuracyStat);
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

const handleTypeColors = (element, type) => {
    switch (type){
        case 'flying':
            element.className += " " + 'flying';
            break;
        case 'physical':
            element.className += " " + 'physical';
            break;
        case 'normal':
            element.className += " " + 'normal';
            break;
        case 'special':
            element.className += " " + 'special';
            break;
        case 'fire':
            element.className += " " + 'fire';
            break;
        case 'grass':
            element.className += " " + 'grass';
            break;
        case 'poison':
            element.className += " " + 'poison';
            break;
        case 'water':
            element.className += " " + 'water';
            break;
        case 'bug':
            element.className += " " + 'bug';
            break;
        case 'status':
            element.className += " " + 'status';
            break;
        default:
            break;
    }
};
