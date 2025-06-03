function log({ msg, sub = false }: { msg: string, sub?: boolean }): void {
    const logArea = !sub ? document.getElementById("log") as HTMLDivElement : document.getElementById("subLog") as HTMLDivElement
    const time = new Date().toLocaleTimeString()
    const logLine = `[${time}] ${msg}`

    const line = document.createElement("div")
    line.textContent = logLine
    logArea.appendChild(line)

    logArea.scrollTop = logArea.scrollHeight
    console.log(logLine)
}


document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("downloadBtn") as HTMLButtonElement
    btn.addEventListener("click", () => {
        log({ msg: "Button Clicked", sub: true })
        chrome.runtime.sendMessage({
            command: "downloadICampus",
            url: "https://vod.skku.edu/contents4/skku100001/646d582510df8/contents/media_files/mobile/ssmovie.mp4",
            filename: "output.mp4"
        })
    })
})

log({ msg: "TS Loaded", sub: true })
