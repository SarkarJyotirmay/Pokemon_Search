const pokemonAPI = "https://pokeapi.co/api/v2/pokemon?limit=151&offset=0";
const typeAPI = "https://pokeapi.co/api/v2/type/?limit=21";

const select = document.querySelector("select");
const search = document.querySelector("input");
const form = document.querySelector("form");
const resetButton = document.querySelector("#reset");
const pokemonContainer = document.querySelector(".pokemon-container");

let types = [];
let pokemons = [];
let finalData = [];
async function getData(url) {
  const response = await fetch(url);
  const result = await response.json();
  return result;
}
// getting and showing all types fetching from api
getType();

getPokemons();

//! Get type function
// fetch data regarding type from API and call display type function to create option & append them to select and show them
async function getType() {
  const response = await getData(typeAPI);
  types = response.results;
  //    console.log(types);
  displayTypes(types);
}
//! Display type function
// takes an array and appends all types to select and show them
function displayTypes(arr) {
  const fragment = document.createDocumentFragment();

  arr.forEach((obj) => {
    const option = document.createElement("option");
    option.value = obj.name;
    option.innerText = obj.name[0].toUpperCase() + obj.name.slice(1);
    fragment.append(option);
  });
  select.append(fragment);
}

//! Get Pokemon function
// fetch data from API > process data to get exact information > calls display function to show them on UI
async function getPokemons() {
  const response = await getData(pokemonAPI);
  pokemons = response.results;
  // console.log(pokemons);
  let promises = [];
  pokemons.forEach((obj) => {
    const data = getData(obj.url);
    promises.push(data);
  });
  finalData = await Promise.all(promises);
  // console.log(finalData);

  displayPokemons(finalData);
}

//! Display Pokemon function
// takes an array of object and show data on UI
function displayPokemons(arr) {
  pokemonContainer.innerHTML = "";
  const fragment = document.createDocumentFragment();
  arr.forEach(async (obj, idx) => {
    const card = document.createElement("div");
    card.classList.add("card");

    const cardInner = document.createElement("div");
    cardInner.classList.add("card-inner");

    const cardFront = document.createElement("div");
    cardFront.classList.add("card-front");
    const cardBack = document.createElement("div");
    cardBack.classList.add("card-back");

    // card front details >>
    //! id
    const id = document.createElement("p");
    id.classList.add("id");
    id.innerText = `#${idx + 1}`;

    //! image
    const image = document.createElement("img");
    image.src = obj.sprites.other.dream_world.front_default;
    // console.log(image);

    //! name
    const name = document.createElement("p");
    name.innerHTML =
      "<strong>Name : </strong>" +
      obj.name[0].toUpperCase() +
      obj.name.slice(1);

    // extract type from nested object
    let pokemonType = [];
    obj.types.forEach((object) => {
      pokemonType.push(object.type.name);
    });
    pokemonType = pokemonType.join(", ");
    // console.log(pokemonType);
    //! type
    const type = document.createElement("p");
    type.innerHTML =
      "<strong>Type : </strong>" +
      pokemonType[0].toUpperCase() +
      pokemonType.slice(1);

    //  giving background colors according to type
    switch (true) {
      case pokemonType.includes("grass"):
        cardFront.style.backgroundColor = "#a0cf59";
        cardBack.style.backgroundColor = "#a0cf59";
        break;
      case pokemonType.includes("fire"):
        cardFront.style.backgroundColor = "#fd842f";
        cardBack.style.backgroundColor = "#fd842f";
        break;
      case pokemonType.includes("water"):
        cardFront.style.backgroundColor = "#4f98c7";
        cardBack.style.backgroundColor = "#4f98c7";
        break;
      case pokemonType.includes("bug"):
        cardFront.style.backgroundColor = "#79a449";
        cardBack.style.backgroundColor = "#79a449";
        break;
      case pokemonType.includes("normal"):
        cardFront.style.backgroundColor = "#a9b0b3";
        cardBack.style.backgroundColor = "#a9b0b3";
        break;
      case pokemonType.includes("poison"):
        cardFront.style.backgroundColor = "#bd86cc";
        cardBack.style.backgroundColor = "#bd86cc";
        break;
      case pokemonType.includes("electric"):
        cardFront.style.backgroundColor = "#efd73f";
        cardBack.style.backgroundColor = "#efd73f";
        break;
      case pokemonType.includes("ground"):
        cardFront.style.backgroundColor = "#f7e049";
        cardBack.style.backgroundColor = "#f7e049";
        break;
      case pokemonType.includes("fairy"):
        cardFront.style.backgroundColor = "#fdbdea";
        cardBack.style.backgroundColor = "#fdbdea";
        break;
      case pokemonType.includes("psychic"):
        cardFront.style.backgroundColor = "#f46ebd";
        cardBack.style.backgroundColor = "#f46ebd";
        break;
      case pokemonType.includes("rock"):
        cardFront.style.backgroundColor = "#a8922c";
        cardBack.style.backgroundColor = "#a8922c";
        break;
      case pokemonType.includes("ghost"):
        cardFront.style.backgroundColor = "#826aa8";
        cardBack.style.backgroundColor = "#826aa8";
        break;
      case pokemonType.includes("fighiting"):
        cardFront.style.backgroundColor = "#d76f2e";
        cardBack.style.backgroundColor = "#d76f2e";
        break;
      case pokemonType.includes("ice"):
        cardFront.style.backgroundColor = "#5ac7e8";
        cardBack.style.backgroundColor = "#5ac7e8";
        break;
    }

    cardFront.append(id, image, name, type);

    // card back details
    const backName = document.createElement("p");
    backName.innerHTML = name.innerHTML;
    // let backName = name.innerText;

    let abilities = [];
    obj.abilities.forEach((object) => {
      abilities.push(object.ability.name);
    });

    abilities = abilities.join(", ");
    const ability = document.createElement("p");
    ability.innerHTML = "<strong>Abilities : </strong>" + abilities;

    cardBack.append(backName, ability);

    //! making of cards
    cardInner.append(cardFront, cardBack);
    card.append(cardInner);
    fragment.append(card);
  });
  pokemonContainer.append(fragment);
}

//! Searching through input
// when any key will be pressed we will match name of object in final data with search input, > create a array with matching name and call display pokemon with that created array
search.addEventListener("keyup", (e) => {
  let filteredData = [];
  let input = e.target.value;
  filteredData = finalData.filter((obj) => {
    return obj.name.includes(input);
  });
  displayPokemons(filteredData);
});

//! Searching through select
// when any select option will be chosen it will match its value with type of the object
form.addEventListener("submit", (e) => {
  e.preventDefault();
  if(select.value === "all"){
    displayPokemons(finalData);
    return;
  }
  // console.log(select.value);
  let filteredData = [];
  // filtering data from inpput value;
  filteredData = finalData.filter((obj) => {
    let pokemonType = [];
    obj.types.forEach((object) => {
      pokemonType.push(object.type.name);
    });
    // console.log(pokemonType);
    return pokemonType.includes(select.value);
  });
  displayPokemons(filteredData);
});

//! Reset all search
// when reset button gets clicked it calls display pokemon function with final data only
resetButton.addEventListener("click", () => {
  search.value = "";
  search.innerText = "";
  displayPokemons(finalData);
});
