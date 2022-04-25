function display(message){
    let displayer = document.getElementById("messages")
    displayer.innerHTML = message
}

const victory_message = [
    "The pourest!",
    "Success!",
    "Liquid gold!",
    "VICTORY!",
    "Flow flow",
    "Splish splash",
    "Unicorn cheers",
    "Get more water",
    "Hooray!",
    "Ta-dah!",
    "Yippee!",
    "Zap!",
    "Triumph!",
    "Grand slam!",
    "High five!",
    "Glory!",
    "Good job!",
    "Nailed it!",
    "Bestest water pourer",
    "Thirsty?",
    "Pour some more!",
    "Hydrate!",
    "H2O of fun",
]

function display_victory_message() {
    const number = Math.floor(Math.random() * victory_message.length)
    display(victory_message[number])
}