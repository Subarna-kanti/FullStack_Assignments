const P = new Pokedex.Pokedex();

function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1)
}

async function getCategories() {
    try {
        const category_types = await P.getTypesList();
        const categories = category_types["results"].map(type => type.name);
        return categories;
    } catch (error) {
        console.error("Error fetching categories:", error);
        return null;
    }
}

async function getPokemons(category) {
    try {
        const category_info = await P.getTypeByName(category);
        const pokemons_details = category_info["pokemon"];
        const pokemons = pokemons_details.map(item => item.pokemon.name)
        return pokemons;
    } catch (error) {
        console.error("Error fetching categories:", error);
        return null;
    }
}

async function getPokemonDetail(pokemon) {
    try {
        const pokemon_info = await P.getPokemonByName(pokemon);
        return {
            "name": pokemon,
            "base_experience": pokemon_info["base_experience"],
            "height": pokemon_info["height"],
            "species": pokemon_info["species"]["name"],
            "image": pokemon_info["sprites"]["front_default"],
            "weight": pokemon_info["weight"],
            "abilities": pokemon_info["abilities"].map(item => item.ability.name).join(", ")
        };
    } catch (error) {
        console.error("Error in getting pokemon details:", error);
        return null;
    }
}

function get_poke_cards(poke_info) {
    return `
            <div class="poke_card_container">
                <figure class="poke_img">
                    <img src="${poke_info['image']}" height="96" width="96" alt="${poke_info['name']}">
                    <figcaption><strong>${capitalize(poke_info['name'])}</strong></figcaption>
                </figure>
                <div class="poke_disc">
                    <p><strong>Species:</strong> ${poke_info['species']}</p>
                    <p><strong>Height:</strong> ${poke_info['height']}</p>
                    <p><strong>Weight:</strong> ${poke_info['weight']}</p>
                    <p><strong>Abilities:</strong> ${poke_info['abilities']}</p>
                    <p><strong>BaseExperience:</strong> ${poke_info['base_experience']}</p>
                </div>
            </div>
            `
}

async function main() {
    const categories = await getCategories();
    const selector = document.getElementById("category");
    const submit = document.getElementById("submitBtn");
    const numPokemonInput = document.getElementById("numPokemon");
    const pokemon_display = document.querySelector(".poke_output");

    selector.innerHTML = `<option value="" disabled selected>Select a Category</option>`;
    categories.forEach(category => {
        selector.innerHTML += `<option value="${category}">${capitalize(category)}</option>`;
    });

    numPokemonInput.addEventListener("input", function () {
        this.value = this.value.replace(/[^0-9]/g, "")
    });

    submit.addEventListener("click", async function () {
        let numPokemon = numPokemonInput.value;
        numPokemon = parseInt(numPokemon, 10);

        if (isNaN(numPokemon) || numPokemon < 1) {
            alert("Please Enter a valid integer > 0");
            numPokemonInput.value = "";
            numPokemon.focus();
            return;
        };

        if (!selector.value) {
            alert("No Category Selected!");
            selector.focus();
            return;
        };

        pokemon_display.innerHTML = `
                    <div class="loading_container">
                        <img src="./media/Loading_icon.gif">
                        <p>Loading...</p>
                    </div>
                `
        const selected_category = selector.value;
        let pokemons = await getPokemons(selected_category);
        let cropped_pokemons = pokemons.slice(0, numPokemon);
        pokemon_display.innerHTML = ""
        cropped_pokemons.forEach(async (pokemon) => {
            const pokemon_info = await getPokemonDetail(pokemon);
            let poke_cards = get_poke_cards(pokemon_info);
            pokemon_display.innerHTML += poke_cards;
        })
    })

}

main()