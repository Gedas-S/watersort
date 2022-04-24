const BOTTLE_HEIGHT = 200

function get_height(water) {
    const dot_index = water.style.height.indexOf(".")
    if (dot_index < 0) {
        return parseInt(water.style.height.slice(0, -2)) * 10
    }
    return parseInt(water.style.height.slice(0, dot_index) + water.style.height.slice(dot_index+1, -2))
}

function add_height(water, amount) {
    const height = (get_height(water) || 0) + amount
    water.style.height = Math.floor(height / 10) + "." + height % 10 + "em"
}

function add_water(bottle, color, amount) {
    if (bottle.lastChild && bottle.lastChild.style.backgroundColor == color) {
        add_height(bottle.lastChild, amount)
        return
    }
    let fluid = document.createElement("div")
    fluid.classList.add("water")
    fluid.style.backgroundColor = color
    fluid.style.height = add_height(fluid, amount)
    bottle.appendChild(fluid)
}

function add_bottle(color) {
    const bottle = document.createElement("div")
    bottle.classList.add("bottle")
    bottle.addEventListener("click", select_bottle)
    if (color) {
        add_water(bottle, color, BOTTLE_HEIGHT)
    }
    return bottle
}

function make_level(n) {
    let bottles = []
    let targets = []
    let sources = []
    let free_space = {}

    const random = random_generator(n)
    const difficulty = Math.log(n) * 1.5 + 2
    const color_count = Math.floor(difficulty)

    // make full bottles first
    const color_step = color_list.length / color_count / 2
    for (let i = 0; i < color_count; i++) {
        const color = color_list[Math.floor(color_step * (i * 2 + 1))]
        const bottle = add_bottle(color)
        bottles.push(bottle)
        sources.push(i)
        free_space[i] = 0
    }
    // two extra empty bottles
    for (let i = color_count; i < 2 + color_count; i++) {
        bottles.push(add_bottle())
        targets.push(i)
        free_space[i] = BOTTLE_HEIGHT
    }

    // shuffle
    const layer_base = Math.floor(BOTTLE_HEIGHT / 2 / Math.sqrt(difficulty))
    for (let i = color_count * color_count * 20; i > 0; i--) {
        if (targets.length < 1 || sources.length < 1) {
            break   
        }
        // pick bottles
        const source_index = random(sources.length)
        const self_index = targets.indexOf(sources[source_index])
        if (self_index == 0 && targets.length == 1) {
            sources.splice(source_index, 1)
            continue
        }
        let target_index = random(targets.length - (self_index >= 0))
        if (self_index >= 0 && target_index >= self_index) {target_index++} 

        const source = bottles[sources[source_index]]
        const target = bottles[targets[target_index]]

        // calculate the amount to be moved
        let split = false
        let amount = get_height(source.lastChild)
        if (amount > layer_base * 2) {
            split = true
            amount = layer_base + random(amount - layer_base * 2)
        }
        if (free_space[targets[target_index]] <= amount) {
            if (!split) {
                continue
            }
            amount = free_space[targets[target_index]]
        }
        if (!split && source.children.length == 1) {
            // the move is non-reversible, abort
            continue
        }
        // move
        if (!split) {
            const water = source.lastChild
            source.removeChild(water)
            target.appendChild(water)
        } else {
            add_water(target, source.lastChild.style.backgroundColor, amount)
            add_height(source.lastChild, -amount)
        }

        // update free space
        if (self_index < 0) {
            targets.push(sources[source_index])
        }
        if (sources.indexOf(targets[target_index]) < 0) {
            sources.push(targets[target_index])
        }
        free_space[targets[target_index]] -= amount
        free_space[sources[source_index]] += amount
        if (free_space[targets[target_index]] < layer_base) {
            targets.splice(target_index, 1)
        }
        if (source.children.length == 0) {
            sources.splice(source_index, 1)
        }
    }

    // cleanup
    for (const bottle of bottles) {
        for (let i = bottle.children.length - 1; i > 0; i--) {
            if (bottle.children[i].style.backgroundColor != bottle.children[i-1].style.backgroundColor) {
                continue
            }
            add_height(bottle.children[i-1], get_height(bottle.children[i]))
            bottle.removeChild(bottle.children[i])
        }
    }

    let level = document.createElement("div")
    level.classList.add("level")
    level.replaceChildren(...bottles)
    return level
}

function start_game() {
    let level = parseInt(localStorage.getItem("water-level"))
    if (!level) {
        level = 1
        localStorage.setItem("water-level", "1")
    }
    let level_data = load_level()
    if (!level_data) {
        level_data = make_level(level)
    }
    
    const game = document.getElementById("game")
    game.appendChild(level_data)

    setup_menu()
}

function save_level() {
    const level = document.getElementById("game").lastChild
    let level_data = []
    for (const bottle of level.children) {
        let bottle_data = []
        for (const fluid of bottle.children) {
            bottle_data.push({c: fluid.style.backgroundColor, a: get_height(fluid)})
        }
        level_data.push(bottle_data)
    }
    localStorage.setItem("water-save", JSON.stringify(level_data))
}

function load_level() {
    try {
        const save_data = localStorage.getItem("water-save")
        if (!save_data) {
            return false
        }
        const level_data = JSON.parse(save_data)
        let bottles = []
        for (const bottle_data of level_data) {
            let bottle = add_bottle()
            for (fluid_data of bottle_data) {
                add_water(bottle, fluid_data.c, fluid_data.a)
            }
            cap_full_with_single_color(bottle)
            bottles.push(bottle)
        }
        let game = document.createElement("div")
        game.classList.add("level")
        game.replaceChildren(...bottles)
        return game
    }
    catch(err) {
        console.error("Error loading level data: " + err.message)
        return
    }
}