const outer_container = document.getElementById("taskify");
const nav_headings = { "To Do": 0, "In Progress": 0, "Under Review": 0, "Finished": 0 };

// Generates a column section with a header and add button
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

// Generates status selection radio buttons
function get_status_checkboxes(parent_ele, parent_counter) {
    return `
        <div class="checkboxes" id="checkboxes_${parent_ele}_${parent_counter}">
            ${Object.keys(nav_headings).map(ele => `
                <div>
                    <label for="complete_${ele}_${parent_counter}">${ele}</label>
                    <input type="radio" id="complete_${ele}_${parent_counter}" value="${ele}" name="status_${parent_ele}_${parent_counter}" ${ele === parent_ele ? 'checked' : ''}>
                </div>
            `).join('')}
        </div>
    `;
}

// Creates a new task card
function get_todo_card(ele, counter) {
    return `
        <div id="card_${ele}_${counter}" class="card">
            <!-- Task Heading -->
            <p class="card_heading_text" onclick="toggleInput(this)">Click to add task</p>
            <input class="card_heading hidden" type="text" placeholder="Enter task" onblur="saveInput(this)">

            <!-- Task Details -->
            <p class="card_details_text" onclick="toggleInput(this)">Click to add details</p>
            <input class="card_details hidden" type="text" placeholder="Enter details" onblur="saveInput(this)">

            <!-- Priority Selection -->
            <p class="priority_value_text" onclick="toggleDropdown(this)">Select a Category</p>
            <select class="priority-selector hidden" onchange="saveDropdown(this)">
                <option value="" disabled selected>Select a Category</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
            </select>

            ${get_status_checkboxes(ele, counter)}
        </div>
    `;
}

// Initialize board sections
Object.keys(nav_headings).forEach(ele => {
    outer_container.innerHTML += get_nav_heading_comp(ele);
});

// Add event listeners for adding new task cards
Object.keys(nav_headings).forEach(ele => {
    document.getElementById(`btn_${ele}`).addEventListener("click", () => {
        nav_headings[ele]++;
        document.getElementById(`nav_${ele}`).innerHTML += get_todo_card(ele, nav_headings[ele]);
    });
});

// Handle radio button task movement
document.addEventListener("change", function (event) {
    if (event.target.type === "radio") {
        const [_, parent_ele, parent_counter] = event.target.name.split('_');
        const taskCard = document.getElementById(`card_${parent_ele}_${parent_counter}`);
        if (taskCard) {
            document.getElementById(`nav_${event.target.value}`).append(taskCard);
        }
    }
});

// Converts <p> into input field on click
function toggleInput(element) {
    let inputField = element.nextElementSibling;
    inputField.classList.remove("hidden");
    inputField.value = element.textContent !== "Click to add task" && element.textContent !== "Click to add details"
        ? element.textContent : "";
    inputField.focus();
    element.classList.add("hidden");
}

// Saves input field text and converts it back to <p>
function saveInput(inputField) {
    let staticText = inputField.previousElementSibling;
    if (inputField.value.trim() !== "") {
        staticText.textContent = inputField.value;
    } else {
        staticText.textContent = staticText.classList.contains("card_heading_text") ? "Click to add task" : "Click to add details";
    }
    inputField.classList.add("hidden");
    staticText.classList.remove("hidden");
}

// Toggle dropdown visibility
function toggleDropdown(element) {
    let dropdown = element.nextElementSibling;
    dropdown.classList.remove("hidden");
    dropdown.focus();
}

// Save dropdown selection
function saveDropdown(selectField) {
    let staticText = selectField.previousElementSibling;
    staticText.textContent = selectField.value;
    staticText.style.color = {
        "Low": "green",
        "Medium": "orange",
        "High": "red"
    }[selectField.value] || "black";
    selectField.classList.add("hidden");
}
