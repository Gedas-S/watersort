// Random seeded generator from some person bryc on the internet
// https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript#comment101315527_47593316

function random_generator(seed) {
    // Pad seed with Phi, Pi and E.
    // https://en.wikipedia.org/wiki/Nothing-up-my-sleeve_number
    let a = 0x9E3779B9, b = 0x243F6A88, c = 0xB7E15162
    let d = seed ^ 0xDEADBEEF; // 32-bit seed with optional XOR value

    const sfc32 = () => {
        a >>>= 0; b >>>= 0; c >>>= 0; d >>>= 0
        let t = (a + b) | 0
        a = b ^ b >>> 9
        b = c + (c << 3) | 0
        c = (c << 21 | c >>> 11)
        d = d + 1 | 0
        t = t + d | 0
        c = c + t | 0
        return (t >>> 0) / 4294967296
    }

    for (let i = 0; i < 15; i++) sfc32();
    return sfc32
}

