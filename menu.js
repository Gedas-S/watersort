function setup_menu() {
    document.getElementById("reset-button").addEventListener("click", reset_level)
}

function reset_level() {
    transition_level(make_level(parseInt(localStorage.getItem("water-level"))))
}