const fs = require("fs").promises

async function filter_file(path) {
    try {
        let data = await fs.readFile(path, "utf-8")
        data = data.trim().replace(/\s+/g, " ")
        await fs.writeFile(path, data, "utf-8")
    } catch (error) {
        console.log("Error reading file:", error)
    }
}

filter_file("garbage.txt")