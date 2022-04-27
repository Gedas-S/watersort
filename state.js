let transition_timeout

function start_game() {
    let level = parseInt(localStorage.getItem("water-level"))
    if (!level) {
        level = 1
        localStorage.setItem("water-level", "1")
    }
    let level_data = load_level()
    if (!level_data) {
        level_data = make_level(level)
        display("Sort the colors!")
    }
    document.getElementById("level-no").innerText = level +
        (localStorage.getItem("water-gen-old") == "false" ? "N" : "")

    const game = document.getElementById("game")
    game.appendChild(level_data)

    if (localStorage.getItem("water-slow-transitions") == "true") {
        game.classList.add("slow")
    }
    if (localStorage.getItem("water-dark-mode") == "true") {
        document.body.classList.add("dark")
    }
    if (!(localStorage.getItem("water-rainbow-unicorns") == "false")) {
        document.body.classList.add("rainbow")
    }
    if (localStorage.getItem("water-scaledown") == "1") {
        document.getElementById("game-container").classList.add("small")
    } else if (localStorage.getItem("water-scaledown") == "2") {
        document.getElementById("game-container").classList.add("tiny")
    }
    setup_menu()
}

function transition_level(level) {
    const game = document.getElementById("game")
    if (localStorage.getItem("water-disable-transitions") == "true") {
        game.replaceChildren(level)
        return
    }

    game.classList.add("transition")
    game.replaceChildren(game.lastChild, level)
    const finish_transition = () => {
        game.classList.remove("transition")
        game.removeChild(game.firstChild)
    }
    check_button_status()
    if (transition_timeout) {
        clearTimeout(transition_timeout)
    }
    transition_timeout = setTimeout(
        finish_transition,
        localStorage.getItem("water-slow-transitions") == "true" ? 5000 : 1000
    )
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
    localStorage.setItem("water-undo", JSON.stringify(undo_history))
    localStorage.setItem("water-saved-level-no", localStorage.getItem("water-level") +
        (localStorage.getItem("water-gen-old") == "true" ? "E" : ""))
}

function load_level() {
    try {
        if (localStorage.getItem("water-saved-level-no") != localStorage.getItem("water-level") +
                (localStorage.getItem("water-gen-old") == "true" ? "E" : "")) {
            display("Level changed")
            return false
        }
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
        undo_history = JSON.parse(localStorage.getItem("water-undo"))
        return game
    }
    catch(err) {
        display("Save corrupt")
        console.error("Error loading level data: " + err.message)
        return
    }
}
