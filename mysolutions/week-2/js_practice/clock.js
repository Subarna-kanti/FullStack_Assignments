function updateTime() {
    const currentTime = new Date();

    //24hours format
    const hours24 = currentTime.getHours().toString().padStart(2, "0")
    const minutes = currentTime.getMinutes().toString().padStart(2, "0")
    const seconds = currentTime.getSeconds().toString().padStart(2, "0")

    //12hours format
    const hours12 = ((currentTime.getHours() + 11) % 12 + 1).toString().padStart(2, "0")
    const ampm = currentTime.getHours() >= 12 ? "PM" : "AM"

    console.clear()
    console.log(`Current Time in 24 Hours Format: ${hours24}:${minutes}:${seconds}`)
    console.log(`Current Time in 12 Hours Format: ${hours12}:${minutes}:${seconds} ${ampm}`)
    setTimeout(updateTime, 1000)
}

updateTime()