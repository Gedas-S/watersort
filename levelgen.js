function make_level(n) {
    let bottles = []
    let targets = []
    let sources = []
    let free_space = {}

    const random = random_generator(n)
    const difficulty = Math.log(n) * 1.5 + 2
    const color_count = Math.floor(difficulty)

    // make full bottles first
    for (let i = 0; i < color_count; i++) {
        const color = color_list[i % color_list.length]
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
        if (!split && source.children.length > 1) {
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
