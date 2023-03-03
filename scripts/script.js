async function onInit() {
    const planets = await getData(`https://swapi.dev/api/planets/`);
    const people = await getData(`https://swapi.dev/api/people/`);
    const vehicles = await getData(`https://swapi.dev/api/vehicles/`);
    addCountsToPage(people.count, 0);
    addCountsToPage(vehicles.count, 1);
    addCountsToPage(planets.count, 2);
    displayPlanetsOnList(filterByPopulation(planets.results));
    addCount(planets.count);
    addNumberToSelector(maxPopulation(planets.results));
    displayDetails(planets.results);
    // filterByPopulation();
}
async function getData(url) {
    const response = await fetch(url);
    const data = await response.json();
    while(data.results.length < data.count) {
        if(data.next) {
            const newURL = data.next;
            const newResponse = await fetch(newURL);
            const newData = await newResponse.json();
            data.results.push(...newData.results);
        }
    }
    console.log(url, 'success !');
    // const results = data.results.sort((a, b) => {
    //     const nameA = a.name.toUpperCase();
    //     const nameB = b.name.toUpperCase();
    //     if(nameA < nameB) {
    //         return -1;
    //     }
    //     if (nameA > nameB) {
    //         return 1;
    //     }
    //     return 0;
    // });
    // console.log(typeof results, results);
    return data;
}

function addCountsToPage(count, nthChild) {
    const numbers = [...document.querySelectorAll(".number")];
    if(numbers.length) 
        numbers[nthChild].textContent = count;
}
function addNumberToSelector(maxPopulation) {
    const selector = document.querySelector('#data-selector');
    if(selector) {
        for(let i = 0; i < maxPopulation - 2; i++) {
            const option = document.createElement('option');
            option.value = i == 0 ? `De ${0} à ${1000}` : `De ${10**(i+2)} à ${10**(i+3)}`;
            option.textContent = i == 0 ? `De ${0} à ${1000}` : `De ${10**(i+2)} à ${10**(i+3)}`;
            selector.appendChild(option);
        }
    }
}
function maxPopulation(results) {
    const maxPopulation = Math.max(
        ...results
            .filter(result => !(isNaN(result.population)))
            .map(result => result.population.length)
    );
    return maxPopulation;
}
function displayPlanetsOnList(allPlanets) {
    const listPlanets = document.querySelector('#list-planets');
    if (listPlanets) {
        allPlanets.forEach(planet => {
            const div = document.createElement('div');
            div.className = 'name-planet';
            div.id = planet.name;
            const div1 = document.createElement('div');
            div1.textContent = planet.name;
            const div2 = document.createElement('div');
            div2.textContent = planet.terrain;
            div.append(div1, div2);
            listPlanets.appendChild(div);
        });
    }
}
function filterByPopulation(results) {
    const selector = document.querySelector('#data-selector');
    if(selector) {
        selector.addEventListener('click', event => {
            const value = event.target.value;
            if(value !== 'population') {
                const min = parseInt(value.slice(value.search(' '), value.search('à')));
                const max = parseInt(value.slice(value.search('à') + 1, value.length));
                const planets = results.filter(result => result.population >= min && result.population < max);
                return planets;
            }
        });
    }
    return results;
}
function addCount(count = 0) {
    const div = document.createElement('div');
    div.id = 'count-results';
    div.textContent = `${count} résultat(s)`;
    const list = document.querySelector('#list');
    if(list) {
        list.appendChild(div);
    }
}
function displayDetails(results) {
    const empty = document.querySelector('#empty');
    const notEmpty = document.querySelector('#not-empty');
    if(empty) {
        empty.textContent = 'Sélectionner le contenu à afficher !';
    }
    const div = [...document.querySelectorAll('.name-planet')];
    if(div) {
        div.filter((element, index) => index > 0)
            .map(element => {
                element.addEventListener('click', event => {
                    if(empty) empty.style.display = 'none';
                    if (notEmpty) {
                        notEmpty.style.display = 'block';
                        const h2 = document.querySelector('#planet-name');
                        const population = document.getElementById('print-population');
                        const diameter = document.getElementById('diameter');
                        const gravity = document.getElementById('gravity');
                        const climate = document.getElementById('climate');
                        const terrain = document.getElementById('terrain');
                        const result = results.filter(result => result.name === event.target.id || result.name === event.target.parentElement.id)[0];
                        h2.textContent = result.name;
                        population.textContent = result.population;
                        diameter.textContent = result.diameter;
                        climate.textContent = result.climate;
                        gravity.textContent = result.gravity;
                        terrain.textContent = result.terrain;
                    }
                })
        })
    }
}

onInit();