
const { program } = require('commander');

program
    .argument('<string>');

program.parse();

const file_name = program.args[0];

const fs = require("fs");
fs.readFile(file_name, "utf-8", (err, data) => {
    if (err) {
        console.error(err);
        return;
    };
    const words = data.split(" ");
    console.log(`Total words: ${words.length} in file.`);
});