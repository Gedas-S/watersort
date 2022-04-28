function load_menu() {
    const level_config = document.getElementById("level")
    level_config.value = parseInt(localStorage.getItem("water-level"))
    level_config.addEventListener(
        "input",
        () => {
            let value = parseInt(level_config.value)
            if (value >= 1) {
                localStorage.setItem("water-level", value)
            }
        }
    );

    const transition_config = document.getElementById("transitions")
    transition_config.checked = localStorage.getItem("water-disable-transitions") != "true"
    transition_config.addEventListener(
        "change",
        () => {localStorage.setItem("water-disable-transitions", !transition_config.checked)}
    );

    const slow_config = document.getElementById("slow")
    slow_config.checked = localStorage.getItem("water-slow-transitions") == "true"
    slow_config.addEventListener(
        "change",
        () => {localStorage.setItem("water-slow-transitions", slow_config.checked)}
    );

    const rainbow_config = document.getElementById("rainbow")
    rainbow_config.checked = !(localStorage.getItem("water-rainbow-unicorns") == "false")
    rainbow_config.addEventListener(
        "change",
        () => {localStorage.setItem("water-rainbow-unicorns", rainbow_config.checked)}
    );

    const dark_config = document.getElementById("dark")
    dark_config.checked = localStorage.getItem("water-dark-mode") == "true"
    dark_config.addEventListener(
        "change",
        () => {
            localStorage.setItem("water-dark-mode", dark_config.checked)
            document.body.style.transition = "color 1000ms, background-color 1000ms"
            document.body.classList.toggle("dark")
        }
    );
    if (localStorage.getItem("water-dark-mode") == "true") {
        document.body.classList.add("dark")
    }

    const small_config = document.getElementById("small")
    const tiny_config = document.getElementById("tiny")
    const tiny_value = localStorage.getItem("water-scaledown")
    small_config.checked = tiny_value == "1" || tiny_value == "2"
    tiny_config.checked = tiny_value == "2"
    const tiny_callback = () => {localStorage.setItem(
        "water-scaledown", 0 + small_config.checked + tiny_config.checked
    )}
    small_config.addEventListener("change", tiny_callback);
    tiny_config.addEventListener("change", tiny_callback);

    const gen_old_config = document.getElementById("gen-new")
    gen_old_config.checked = localStorage.getItem("water-gen-old") == "false"
    gen_old_config.addEventListener(
        "change",
        () => {localStorage.setItem("water-gen-old", !gen_old_config.checked)}
    );

    const uniqorn_config = document.getElementById("uniqorn")
    uniqorn_config.checked = !(localStorage.getItem("water-uniqorn") == "false")
    uniqorn_config.addEventListener(
        "change",
        () => {localStorage.setItem("water-uniqorn", uniqorn_config.checked)}
    );
}
