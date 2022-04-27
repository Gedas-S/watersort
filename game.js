var undo_history = []

function select_bottle() {
    let selected = document.getElementsByClassName("selected-bottle")

    if (selected.length) {
        let source = selected[0]
        deselect(source)

        if (source != this && source.lastChild) {
            pour(source, this)
        }
    }
    else {
        select(this)
    }
}

function select(bottle) {
    bottle.classList.add("selected-bottle")
}

function deselect(bottle) {
    bottle.classList.remove("selected-bottle")
}

function pour(source, target) {
    let color = source.lastChild.style.backgroundColor
    let bottle_space = BOTTLE_HEIGHT;
    for (const water of target.children) {
        bottle_space -= get_height(water)
    }

    if (bottle_space <= 0) {
        display("Bottle full")
    }
    else if (target.lastChild && color != target.lastChild.style.backgroundColor) {
        display("Cannot mix")
    }
    else {
        display("&nbsp;")
        let amount = bottle_space
        amount = remove_water(source, amount)
        add_water(target, color, amount, true)
        cap_full_with_single_color(target)

        const siblings = Array.from(source.parentNode.children)
        undo_history.push(
            {s: siblings.indexOf(source), t: siblings.indexOf(target), a: amount}
        )

        check_win()
        check_button_status()
        save_level()
    }

}

function cap_full_with_single_color(bottle){
    if (bottle.children.length == 1 && get_height(bottle.lastChild) == BOTTLE_HEIGHT){
        bottle.classList.add("capped")
        bottle.removeEventListener("click", select_bottle)
    } else if (bottle.classList.contains("capped")) {
        bottle.classList.remove("capped")
        bottle.addEventListener("click", select_bottle)
    }
}

function check_win() {
    for (const bottle of document.getElementsByClassName("bottle")) {
        if (bottle.children.length != 0 && !bottle.classList.contains("capped")) {
            return
        }
    }

    display_victory_message()
    const old_level = parseInt(localStorage.getItem("water-level"))
    localStorage.setItem("water-level", old_level + 1 + "")

    const level = make_level(old_level + 1)
    document.getElementById("level-no").innerText = old_level + 1
    undo_history = []
    transition_level(level)
}
