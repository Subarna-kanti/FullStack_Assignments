import { quizData } from "./data.js";

const total_questions = quizData.length
let correct_answers = 0

function update_quiz_page(idx = 0) {
    if (idx >= total_questions) {
        showResults()
        return false
    }
    const question = document.querySelector(".question")
    question.innerHTML = `<h1>${quizData[idx]['question']}</h1>`

    const options = document.querySelector(".options")
    const opt_idx = ["a", "b", "c", "d"]
    options.innerHTML = ""
    opt_idx.forEach(element => {
        const radioHTML = `
            <div style="display: flex; gap: 10px;">
                <input type="radio" id="${element}" name="quizOption" value="${quizData[idx][element]}">
                <label for="${element}"><p>${quizData[idx][element]}</p></label>
            </div>
        `
        options.innerHTML += radioHTML
    });

    const submitBtn = document.getElementById("submitBtn");
    submitBtn.replaceWith(submitBtn.cloneNode(true))
    document.getElementById("submitBtn").addEventListener("click", () => {
        const selectedOption = document.querySelector('input[name="quizOption"]:checked')
        if (selectedOption) {
            if (selectedOption.value === quizData[idx][quizData[idx]["correct"]]) {
                correct_answers++
            }
            options.innerHTML = ""
            update_quiz_page(idx + 1)
        }
    })
    return true
}

function showResults() {
    console.log("Given All Responses")

    const container = document.createElement("div")
    container.classList.add("container")

    const wrapper = document.createElement("div")
    wrapper.classList.add("wrapper")

    const content_section = document.querySelector(".content")
    content_section.classList.replace("content", "dynamic_content")
    const result = document.querySelector(".question")
    result.innerHTML = `<h1>You answered ${correct_answers}/${total_questions} questions correctly</h1>`
    const footer = document.getElementById("submitBtn")
    footer.innerText = "Reload"
    footer.onclick = () => location.reload()

    wrapper.appendChild(content_section)
    wrapper.appendChild(footer)
    container.appendChild(wrapper)
    document.body.innerHTML = ""
    document.body.appendChild(container)
}

const response = update_quiz_page()
