const outer_container = document.getElementById("outer_container");
const nav_headings = { "To Do": 0, "In Progress": 0, "Under Review": 0, "Finished": 0 };

function get_nav_heading_comp(ele) {
    return `
        <div id="label_${ele}" class="labels">
            <nav id="nav_${ele}">
                <section>
                    <h1>${ele}</h1>
                    <p>☰</p>
                </section>
            </nav>
            <button id="btn_${ele}" class="add_cards">
                <span class="text">Add new</span>
                <span class="plus">+</span>
            </button>
        </div>
    `;
}

function get_status_checkboxes(parent_ele, parent_counter) {
    let checkbox_html = `<div id="checkboxes_${parent_ele}_${parent_counter}">`;

    Object.entries(nav_headings).forEach(([ele]) => {
        let isChecked = ele === parent_ele ? 'checked' : ''; // Default selection
        checkbox_html += `
            <div>
                <label for="complete_${ele}_${parent_counter}">${ele}</label>
                <input type="radio" id="complete_${ele}_${parent_counter}" value="${ele}" name="${parent_ele}_${parent_counter}" ${isChecked}>
            </div>
        `;
    });

    checkbox_html += "</div>";
    return checkbox_html;
}

function get_todo_card(ele, counter) {
    return `
        <div id="card_${ele}_${counter}" class="card">
            <p class="card_heading_text"></p>
            <input class="card_heading" type="text" placeholder="Task">

            <p class="card_details_text"></p>
            <input class="card_details" type="text" placeholder="Details">

            <p class="priority_value_text"></p>
            <select class="priority-selector">
                <option value="" disabled selected>Select a Category</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
            </select>

            ${get_status_checkboxes(ele, counter)}
        </div>
    `;
}

Object.keys(nav_headings).forEach(ele => {
    outer_container.innerHTML += get_nav_heading_comp(ele);
});

Object.keys(nav_headings).forEach((ele) => {
    document.getElementById(`btn_${ele}`).addEventListener("click", () => {
        nav_headings[ele] += 1;
        document.getElementById(`nav_${ele}`).innerHTML += get_todo_card(ele, nav_headings[ele]);
    });
});

// Handle radio button change (Move Task)
document.addEventListener("change", function (event) {
    if (event.target.type === "radio") {
        const [parent_ele, parent_counter] = event.target.name.split('_');
        const taskCard = document.getElementById(`card_${parent_ele}_${parent_counter}`);
        if (taskCard) {
            document.getElementById(`nav_${event.target.value}`).append(taskCard);
        }
    }

    // Handle dropdown color change
    if (event.target.classList.contains("priority-selector")) {
        const selectedValue = event.target.value;
        event.target.style.color = {
            "Low": "green",
            "Medium": "orange",
            "High": "red"
        }[selectedValue] || "black";
    }
});

// Convert inputs/dropdowns into static text and remove them
document.addEventListener("blur", function (event) {
    if (event.target.classList.contains("card_heading") || event.target.classList.contains("card_details")) {
        let inputField = event.target;
        let staticText = inputField.previousElementSibling; // The <p> before the input

        if (inputField.value.trim() !== "") {
            staticText.textContent = inputField.value;
            inputField.remove(); // Remove input field
        }
    }

    if (event.target.classList.contains("priority-selector")) {
        let selectField = event.target;
        let staticText = selectField.previousElementSibling; // The <p> before the select

        if (selectField.value.trim() !== "") {
            staticText.textContent = selectField.value;
            selectField.remove(); // Remove dropdown
        }
    }
}, true);
