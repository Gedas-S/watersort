function setup_menu() {
    document.getElementById("reset-button").addEventListener("click", reset_level)
    document.getElementById("undo-button").addEventListener("click", perform_undo)
    check_button_status()
}

function reset_level() {
    transition_level(make_level(parseInt(localStorage.getItem("water-level"))))
}

function perform_undo() {
    const event = undo_history.pop()
    if (!event) {
        return
    }
    const bottles = document.getElementById("game").lastChild.children
    add_water(bottles[event.s], bottles[event.t].lastChild.style.backgroundColor, event.a, true)
    remove_water(bottles[event.t], event.a)
    cap_full_with_single_color(bottles[event.t])
    save_level()
}

function check_button_status() {
    const inactive = document.getElementById("undo-button").classList.contains("inactive")
    if (undo_history.length && inactive) {
        document.getElementById("undo-button").classList.remove("inactive")
        document.getElementById("reset-button").classList.remove("inactive")
    } else if (!undo_history.length && !inactive) {
        document.getElementById("undo-button").classList.add("inactive")
        document.getElementById("reset-button").classList.add("inactive")
    }
}