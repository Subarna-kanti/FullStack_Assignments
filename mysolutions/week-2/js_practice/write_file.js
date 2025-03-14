const fs = require("fs").promises

async function writeFileAsync(path, content) {
    try {
        const data = await fs.writeFile(path, content, "utf-8")
        console.log(data)
    } catch (error) {
        console.error("Error writing file:", error)
    }
}

writeFileAsync("hello_2.txt", "Writing new file")