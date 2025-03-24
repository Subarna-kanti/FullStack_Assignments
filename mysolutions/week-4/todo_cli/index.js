const { program } = require('commander');

program
    .requiredOption("--index <string>", "Index of the todo item")
    .option("--description <string>", "Description of the task")
    .option("--status <string>", "Status of the task")
    .argument('<string>', "Required argument for the command");

program.parse();

const options = program.opts();
const todo_index = options.index;
const description = options.description;
const status = options.status;


const fs = require("fs");
const filename = program.args[0];
const data = fs.readFileSync(filename, "utf-8");
let json_data = JSON.parse(data);

if (todo_index in json_data) {
    if (description) {
        json_data[todo_index]["description"] = description;
    };
    if (status) {
        json_data[todo_index]["status"] = status;
    };
}
else {
    json_data[todo_index] = { "description": description, "status": status };
};

fs.writeFileSync(filename, JSON.stringify(json_data, null, 4), "utf-8");
console.log("TODO File is updated");
