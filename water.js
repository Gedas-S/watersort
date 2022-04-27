const BOTTLE_HEIGHT = 40
const VISCOSITY = 10

function get_height(water) {
    const dot_index = water.style.height.indexOf(".")
    if (dot_index < 0) {
        return parseInt(water.style.height.slice(0, -2)) * 2
    }
    return Math.floor(parseInt(water.style.height.slice(0, dot_index) + water.style.height.slice(dot_index+1, -2)) / 5)
}

function add_height(water, amount, transition) {
    const height = (get_height(water) || 0) + amount
    const initial_style = water.style.height || "0"
    water.style.height = Math.floor(height / 2) + "." + (height * 5) % 10 + "em"
    if (transition && !(localStorage.getItem("water-disable-transitions") == "true")) {
        water.animate({height: [initial_style, water.style.height]}, Math.abs(amount * VISCOSITY))
    }
}

function get_bottle_space(bottle) {
    let bottle_space = BOTTLE_HEIGHT;
    for (const water of bottle.children) {
        bottle_space -= get_height(water)
    }
    return bottle_space
}

function add_water(bottle, color, amount, transition) {
    if (bottle.lastChild && bottle.lastChild.style.backgroundColor == color) {
        add_height(bottle.lastChild, amount, transition)
        return
    }
    let fluid = document.createElement("div")
    fluid.classList.add("water")
    fluid.style.backgroundColor = color
    add_height(fluid, amount, transition)
    bottle.appendChild(fluid)
}


function remove_water(source, bottle_space) {
    let amount = get_height(source.lastChild)
    if (amount > bottle_space) {
        add_height(source.lastChild, -bottle_space, true)
        amount = bottle_space
    } else {
        const water = source.lastChild
        const rect = water.getBoundingClientRect()
        source.removeChild(water)
        if (!(localStorage.getItem("water-disable-transitions") == "true")) {
            const game = document.getElementById("game")
            water.classList.add("detached")
            if (source.children.length == 0) {
                water.classList.add("bottom")
            }
            game.prepend(water)
            const game_rect = game.getBoundingClientRect()
            water.style.left = rect.x + "px"
            water.style.bottom = game_rect.y + game_rect.height - rect.y - rect.height + "px"
            water.animate({height: [water.style.height, 0]}, Math.abs(amount * VISCOSITY))
            water.animate({transform: ["translateY(0)", "translateY(2.04em)"], easing: "ease"}, 300)
            water.style.height = 0
            setTimeout(()=>{game.removeChild(water)}, Math.abs(amount * VISCOSITY))
        }
    }
    return amount
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
