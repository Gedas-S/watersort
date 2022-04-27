function make_level(n) {
    let level_gen = make_level_old
    if (localStorage.getItem("water-gen-old") == "false") {
        level_gen = make_level_new
    }
    let bottles = level_gen(n)

    // cleanup
    for (const bottle of bottles) {
        for (let i = bottle.children.length - 1; i > 0; i--) {
            if (bottle.children[i].style.backgroundColor != bottle.children[i-1].style.backgroundColor) {
                continue
            }
            add_height(bottle.children[i-1], get_height(bottle.children[i]))
            bottle.removeChild(bottle.children[i])
        }
        cap_full_with_single_color(bottle)
    }

    let level = document.createElement("div")
    level.classList.add("level")
    level.replaceChildren(...bottles)
    return level
}

function make_level_new(n) {
    let bottles = []

    const random = random_generator(n)
    const difficulty = Math.log(n) * 1.5 + 2
    const color_count = Math.floor(difficulty)
    const layer_size = Math.floor(15 / Math.log10(n+3) - 15 / n)

    // make full bottles first
    for (let i = 0; i < color_count; i++) {
        const color = color_list[i % color_list.length]
        bottles.push(add_bottle(color))
    }
    // two extra empty bottles
    for (let i = color_count; i < 2 + color_count; i++) {
        bottles.push(add_bottle())
    }

    const move = (source, target, amount) => {
        if (amount == 0) {throw amount}
        amount = Math.min(amount, get_bottle_space(target))
        add_water(target, source.lastChild.style.backgroundColor, amount)
        remove_water(source, amount)
    }
    // move something into one of the empty bottles
    move(
        bottles[random(color_count)],
        bottles[color_count],
        (random(Math.floor(BOTTLE_HEIGHT/layer_size-1)) + 1) * layer_size
    )

    const last_bottle = bottles[color_count+1]
    movable = bottles.slice(0, -1)
    for (let loops=0; loops<1000; loops++) {

        // check all bottles if they have enough space to be moved
        for (let i = movable.length-1; i >= 0; i--) {
            if (get_height(movable[i].lastChild) < layer_size * 2) {
                movable.splice(i, 1)
            }
        }
        window.movable = movable
        // generate chains until all splits are too small for defined difficulty
        if (movable.length < 2) {
            break
        }

        // then generate a chain move which will be solved by moving something into
        // the last empty bottle, then in a row filling some water into the just emptied space
        // and finally emptying the bottle
        let chain = [last_bottle]
        let opts = movable.slice()
        let amount = layer_size + random(3)
        let difficulty_ramp = Math.floor((opts.length-2) * (difficulty-color_count))
        let chain_length = Math.min(2 + random(opts.length-1) + random(difficulty_ramp), opts.length)
        for (let i = 0; i < chain_length; i++) {
            let x = random(opts.length)
            chain.push(opts[x])
            opts.splice(x, 1)
        }

        for (let i=0; i < chain.length - 1; i++) {
            // each chain move does a bottom split of the top color,
            // leaving space for any move generated above
            let amt = get_height(chain[i+1].lastChild) - amount
            if (amt <= 0) {
                chain.splice(i+1, 1)
                i--
                continue
            }
            move(chain[i+1], chain[i], amt)
            // for each step, generate a chance that something has to be moved into the bottle
            // during the operation from a bottle not participating in the chain
            if (opts.length && random(opts.length) * random(movable.length) == 1) {
                let third = random(opts.length)
                move(opts[third], chain[i+1], amount)
                opts.splice(third, 1)
            }
        }
        window.last_bottle = last_bottle
        move(last_bottle, chain[chain.length-1], get_height(last_bottle.lastChild))
    }
    return bottles
}

function make_level_old(n) {
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

    return bottles
}
