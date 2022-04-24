function select_bottle() {
    let selected = document.getElementsByClassName("selected-bottle")
    
    if (!selected.length) {
        this.classList.add("selected-bottle")
        return
    }

    let source = selected[0]
    source.classList.remove("selected-bottle")

    if (source == this || !source.lastChild) {
        return
    }
    pour(source, this)
}

function pour(source, target) {
    let color = source.lastChild.style.backgroundColor
    let bottle_space = 20;
    for (const water of target.children) {
        bottle_space -= parseFloat(water.style.height)
    }

    if (bottle_space <= 0) {
        console.log("target bottle full")
        return
    }
    if (target.lastChild && color != target.lastChild.style.backgroundColor) {
        console.log("pouring on wrong color")
        return
    }

    let amount = parseFloat(source.lastChild.style.height)
    if (amount > bottle_space) {
        source.lastChild.style.height = amount - bottle_space + "em"
        amount = bottle_space
    } else {
        source.removeChild(source.lastChild)
    }

    add_water(target, color, amount)
    
    check_win()
}

function check_win() {
    for (const bottle of document.getElementsByClassName("bottle")) {
        if (bottle.children.length >= 2) {
            return false
        }
    }
    console.log("VICTORY!!!")
    return true
}