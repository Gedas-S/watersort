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

    const rainbow_config = document.getElementById("rainbow")
    rainbow_config.checked = localStorage.getItem("water-rainbow-unicorns") != "false"
    rainbow_config.addEventListener(
        "change", 
        () => {localStorage.setItem(
            "water-rainbow-unicorns", document.getElementById("rainbow").checked
        )}
    );

    const dark_config = document.getElementById("dark")
    dark_config.checked = localStorage.getItem("water-dark-mode") == "true"
    dark_config.addEventListener(
        "change", 
        () => {
            localStorage.setItem(
                "water-dark-mode", document.getElementById("dark").checked
            )
            document.body.style.transition = "color 1000ms, background-color 1000ms"
            document.body.classList.toggle("dark")
        }
    );
    if (localStorage.getItem("water-dark-mode") == "true") {
        document.body.classList.add("dark")
    }
}
