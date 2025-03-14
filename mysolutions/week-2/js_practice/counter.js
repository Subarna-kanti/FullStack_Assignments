function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

async function counter(interval) {
    while (true) {
        await sleep(interval);
        console.log("counter got triggered")
    }
}

counter(2000)