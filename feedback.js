function display(message){
    let displayer = document.getElementById("messages")
    displayer.textContent = message
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
]

function display_victory_message() {
    const number = Math.floor(Math.random() * victory_message.length)
    display(victory_message[number])
}