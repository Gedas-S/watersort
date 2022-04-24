let BOTTLE_SPACE = 20;

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
    let bottle_space = BOTTLE_SPACE;
    for (const water of target.children) {
        bottle_space -= parseFloat(water.style.height)
    }

    if (bottle_space <= 0) {
        display("target bottle full")
    }
    else if (target.lastChild && color != target.lastChild.style.backgroundColor) {
        display("pouring on wrong color")
    }
    else {
        let amount = bottle_space
        amount = remove_water(source, amount)
        add_water(target, color, amount)
        cap_full_with_single_color(target)
        check_win()
    }

}

function remove_water(source, bottle_space) {
    let amount = parseFloat(source.lastChild.style.height)
    if (amount > bottle_space) {
        source.lastChild.style.height = amount - bottle_space + "em"
        amount = bottle_space
    } else {
        source.removeChild(source.lastChild)
    }
    return amount
}

function cap_full_with_single_color(bottle){
    if (bottle.children.length == 1 && parseFloat(bottle.lastChild.style.height) == BOTTLE_SPACE){
        bottle.classList.add("capped")
        bottle.removeEventListener("click", select_bottle)
    }
}

function check_win() {
    for (const bottle of document.getElementsByClassName("bottle")) {
        if (bottle.children.length >= 2) {
            return false
        }
    }
    display("VICTORY!!!")
    return true
}