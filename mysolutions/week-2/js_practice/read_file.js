const fs = require("fs").promises

async function readFileAsync(path) {
    try {
        const data = await fs.readFile(path, "utf-8")
        console.log(data)
    } catch (error) {
        console.error("Error reading file:", error)
    }
}

readFileAsync("hello.txt")

function calculateTime(n) {
    const start = Date.now()
    let sum = 0
    for (let i=1; i < n+1; i++) {
        sum += i
    }
    const end = Date.now()
    console.log(`Execution time: ${end-start}ms`)
}

calculateTime(100)
calculateTime(100000)
calculateTime(1000000000)