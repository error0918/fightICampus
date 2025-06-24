console.log("dsaf")

function inspect(tabs: browser.tabs.Tab[]): boolean {
    let tab = tabs[0]
    log({ msg: `[inspect] Started: ${tab.url}` })

    if (!tab.url || !tab.id
        || (!tab.url.startsWith("https://canvas.skku.edu/courses/") && !tab.url.startsWith("http://canvas.skku.edu/courses/"))
        || (!tab.url.endsWith("/297") && !tab.url.endsWith("/297/"))
        || !tab.url.includes("/items/")) {
        log({msg: "[inspect] Not Expected URL"})
        return false
    }

    let iframe = document.querySelector("#tool_content")
    if (!iframe) {
        log({msg: "[inspect] iframe Noe Exist"})
        //return false
    }

    let a = document.getElementById("downloadButton") as HTMLButtonElement
    console.log("dafs")
    return true
}


function log({ msg, sub = false }: { msg: string, sub?: boolean }): void {
    const logArea = !sub ?
        document.getElementById("log") as HTMLDivElement :
        document.getElementById("subLog") as HTMLDivElement
    const time = new Date().toLocaleTimeString()
    const logLine = `[${time}] ${msg}`

    const line = document.createElement("div")
    line.textContent = logLine
    logArea.appendChild(line)

    logArea.scrollTop = logArea.scrollHeight
    console.log(logLine)
}


document.addEventListener("DOMContentLoaded", () => {
    const inspectButton = document.getElementById("inspectButton") as HTMLButtonElement
    inspectButton.addEventListener("click", () => {
        log({ msg: "Inspect Button Clicked", sub: true })
        browser.tabs.query({ active: true, currentWindow: true }).then(
            inspect, (tabs: browser.tabs.Tab[]) => { log({ msg: "Tab Query Error" }) }
        )
    })

    const downloadButton = document.getElementById("downloadButton") as HTMLButtonElement
    downloadButton.addEventListener("click", () => {
        log({ msg: "Download Button Clicked", sub: true })
        //
    })
})

log({ msg: "TS Loaded", sub: true })

/*
document.addEventListener("DOMContentLoaded", () => {
    const inspectButton = document.getElementById("inspectButton") as HTMLButtonElement
    inspectButton.addEventListener("click", () => {
        log({ msg: "Inspect Button Clicked", sub: true })
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const tab = tabs[0]
            if (tab) inspect(tab)
        })
    })

    const downloadButton = document.getElementById("downloadButton") as HTMLButtonElement
    downloadButton.addEventListener("click", () => {
        log({ msg: "Download Button Clicked", sub: true })
        chrome.runtime.sendMessage({
            command: "downloadICampus",
            url: "https://vod.skku.edu/contents4/skku100001/646d582510df8/contents/media_files/mobile/ssmovie.mp4",
            filename: "output.mp4"
        })
    })
})
 */
