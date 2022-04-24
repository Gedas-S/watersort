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

function make_bottle(waters) {
    const game = document.getElementById("game")
    const bottle = document.createElement("div")
    bottle.classList.add("bottle")
    bottle.addEventListener("click", select_bottle)

    for (const water of (waters || [])) {
        add_water(bottle, water.color, water.amount)
    }
    game.appendChild(bottle)
}

function setup_level() {
    make_bottle([{color: "blue", amount: 5}, {color: "green", amount: 4.5}, {color: "fuchsia", amount: 1}])
    make_bottle([{color: "red", amount: 10}, {color: "green", amount: 3.5}, {color: "fuchsia", amount: 1.1}])
    make_bottle()
    make_bottle()
}
