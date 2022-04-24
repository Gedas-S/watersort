function add_water(bottle, color, amount) {
    if (bottle.lastChild && bottle.lastChild.style.backgroundColor == color) {
        bottle.lastChild.style.height = parseFloat(bottle.lastChild.style.height) + amount + "em"
        return
    }
    let fluid = document.createElement("div")
    fluid.classList.add("water")
    fluid.style.backgroundColor = color
    fluid.style.height = amount.toFixed(1) + "em" 
    bottle.appendChild(fluid)
}

function make_bottle(color) {
    const bottle = document.createElement("div")
    bottle.classList.add("bottle")
    bottle.addEventListener("click", select_bottle)
    if (color) {
        add_water(bottle, color, 20)
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
        const bottle = make_bottle(color)
        bottles.push(bottle)
        sources.push(i)
        free_space[i] = 0
    }
    // two extra empty bottles
    for (let i = color_count; i < 2 + color_count; i++) {
        bottles.push(make_bottle())
        targets.push(i)
        free_space[i] = 20
    }

    // shuffle
    const layer_base = 10 / Math.sqrt(difficulty)
    for (let i = color_count * color_count * 20; i > 0; i--) {
        if (targets.length < 1 || sources.length < 1) {
            break   
        }
        // pick bottles
        const source_index = Math.floor(random() * sources.length)
        const self_index = targets.indexOf(sources[source_index])
        if (self_index == 0 && targets.length == 1) {
            sources.splice(source_index, 1)
            continue
        }
        let target_index = Math.floor(random() * (targets.length - (self_index >= 0)))
        if (self_index >= 0 && target_index >= self_index) {target_index++} 

        const source = bottles[sources[source_index]]
        const target = bottles[targets[target_index]]

        // calculate the amount to be moved
        let split = false
        let amount = parseFloat(source.lastChild.style.height)
        if (amount > layer_base * 2) {
            split = true
            amount = layer_base + (amount - layer_base * 2) *  random()
        }
        if (free_space[targets[target_index]] <= amount) {
            if (!split) {
                continue
            }
            amount = free_space[targets[target_index]]
        }
        // move
        if (!split) {
            const water = source.lastChild
            source.removeChild(water)
            target.appendChild(water)
        } else {
            add_water(target, source.lastChild.style.backgroundColor, amount)
            source.lastChild.style.height = parseFloat(source.lastChild.style.height) - amount + "em"
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

    console.log(sources)
    console.log(targets)
    console.log(free_space)

    const game = document.getElementById("game")
    for (const bottle of bottles) {
        game.appendChild(bottle)
    }
}

function setup_level() {
    make_level(10)
}
