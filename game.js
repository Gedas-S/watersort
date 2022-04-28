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
    let bottle_space = get_bottle_space(target)

    if (bottle_space <= 0) {
        display("Bottle full")
    }
    else if (target.lastChild && color != target.lastChild.style.backgroundColor) {
        display("Cannot mix")
    }
    else {
        display("&nbsp;")
        let amount = Math.min(bottle_space, get_height(source.lastChild))
        remove_water(source, amount, true)
        add_water(target, color, amount, true)
        cap_full_with_single_color(target)

        const siblings = Array.from(source.parentNode.children)
        undo_history.push(
            {s: siblings.indexOf(source), t: siblings.indexOf(target), a: amount}
        )

        save_level()
        check_win()
        check_button_status()
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
            return false
        }
    }
    display_victory_message()
    increment_level()
    undo_history = []

    if (localStorage.getItem("water-instant-new-level") == "true"){
        next_level()
        save_level()
    }
    else {
        const new_level = make_level()
        save_next_level(new_level)
        document.addEventListener("click", next_level, { once : true, capture : true })
    }

    return true
}

function increment_level(){
    const old_level = parseInt(localStorage.getItem("water-level"))
    localStorage.setItem("water-level", old_level + 1 + "")
}

function next_level(){
    const current_level = parseInt(localStorage.getItem("water-level"))
    const level = make_level(current_level)
    document.getElementById("level-no").innerText = current_level +
        (localStorage.getItem("water-gen-old") == "true" ? "E" : "")
    transition_level(level)
}

function save_next_level(){
    const current_level = parseInt(localStorage.getItem("water-level"))
    const level = make_level(current_level)
    save_level(level)
}
