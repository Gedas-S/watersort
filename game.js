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
    let bottle_space = BOTTLE_HEIGHT;
    for (const water of target.children) {
        bottle_space -= get_height(water)
    }

    if (bottle_space <= 0) {
        console.log("target bottle full")
        return
    }
    if (target.lastChild && color != target.lastChild.style.backgroundColor) {
        console.log("pouring on wrong color")
        return
    }

    let amount = get_height(source.lastChild)
    if (amount > bottle_space) {
        add_height(source.lastChild, -bottle_space)
        amount = bottle_space
    } else {
        source.removeChild(source.lastChild)
    }

    add_water(target, color, amount)
    
    check_win()
}

function check_win() {
    let empty = 0
    for (const bottle of document.getElementsByClassName("bottle")) {
        if (bottle.children.length >= 2) {
            return
        }
        if (bottle.children.length == 0) {
            empty++
        }
    }
    if (empty < 2) {
        return
    }
    
    console.log("VICTORY!!!")
    const old_level = parseInt(localStorage.getItem("level"))
    localStorage.setItem("level", old_level + 1 + "")
    make_level(old_level + 1)
}