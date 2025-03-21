function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
}

const field_selector = document.getElementById("field-selector");
const submit = document.getElementById("submit");
const form_preview = document.getElementById("form_preview");
const add_labels = document.getElementById("add_labels");
const nav_field_labels = document.getElementById("nav_field_labels");
let counter = 0;

// Handle field selection visibility
field_selector.addEventListener("change", function () {
    if (this.value === "checkbox" || this.value === "radio") {
        add_labels.style.display = "block";
    } else {
        add_labels.style.display = "none";
    }
});

// Add more labels dynamically
add_labels.addEventListener("click", function () {
    const newInput = document.createElement("input");
    newInput.type = "text";
    newInput.placeholder = "Enter field label";
    newInput.required = true;
    nav_field_labels.appendChild(newInput);
});

// Add new field to form preview
submit.addEventListener("click", function () {
    const field_type = field_selector.value;
    const inputs = document.querySelectorAll("#nav_field_labels input");

    if (!field_type) {
        alert("Empty field type is not allowed!");
        field_selector.focus();
        return;
    }

    const hasBlankInput = Array.from(inputs).some(input => input.value.trim() === "");
    if (hasBlankInput) {
        alert("Empty Inputs are not allowed!");
        return;
    }

    const input_values = Array.from(inputs).map(input => input.value);
    const form_container = document.querySelector("form");

    // Create a wrapper div for inline styling
    let wrapperDiv = document.createElement("div");
    wrapperDiv.classList.add("inline-group");

    input_values.forEach((input, index) => {
        let label = document.createElement("label");
        let inputElement = document.createElement("input");
        
        if (field_type === "text") {
            inputElement.type = "text";
            inputElement.id = input;
            inputElement.name = input;
        } 
        else if (field_type === "checkbox") {
            inputElement.type = "checkbox";
            inputElement.id = input;
            inputElement.name = input;
            inputElement.value = input;
        } 
        else if (field_type === "radio") {
            inputElement.type = "radio";
            inputElement.name = `radio-group_${counter}`;
            inputElement.value = input;
            if (index === 0) inputElement.checked = true;
        }

        label.append(` ${input}`);
        label.appendChild(inputElement);
        wrapperDiv.appendChild(label);
    });

    form_container.appendChild(wrapperDiv);
    
    // Reset input fields
    nav_field_labels.innerHTML = `<input type="text" placeholder="Enter field label" required>`;
    field_selector.value = "";
    add_labels.style.display = "none";
    
    counter++;
});
