const buttons = document.querySelectorAll(".nav button")
const nav = document.querySelector(".nav")

buttons.forEach(button => {
    button.addEventListener("click", () => {
        nav.style.backgroundColor = button.style.backgroundColor;
    })
})