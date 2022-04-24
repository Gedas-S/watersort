function load_menu() {
    const level_config = document.getElementById("level")
    level_config.value = parseInt(localStorage.getItem("water-level"))
    level_config.addEventListener(
        "input", 
        () => {localStorage.setItem(
            "water-level", 
            document.getElementById("level").value
        )}
    );

    const transition_config = document.getElementById("transitions")
    transition_config.checked = localStorage.getItem("water-disable-transitions") != "true"
    transition_config.addEventListener(
        "change", 
        () => {localStorage.setItem(
            "water-disable-transitions", 
            !document.getElementById("transitions").checked
        )}
    );

    const slow_config = document.getElementById("slow")
    slow_config.checked = localStorage.getItem("water-slow-transitions") == "true"
    slow_config.addEventListener(
        "change", 
        () => {localStorage.setItem(
            "water-slow-transitions", document.getElementById("slow").checked
        )}
    );
}
