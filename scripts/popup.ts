(function () {
    function inspect(tab: chrome.tabs.Tab): boolean {
        logA({ msg: `[inspect] Started: ${tab.url}` })

        if (!tab.url || !tab.id
            || (!tab.url.startsWith("https://canvas.skku.edu/courses/") && !tab.url.startsWith("http://canvas.skku.edu/courses/"))
            || (!tab.url.endsWith("/297") && !tab.url.endsWith("/297/"))
            || !tab.url.includes("/items/")) {
            logA({msg: "[inspect] Not Expected URL"})
            return false
        }

        // TODO
        return true
    }


    function logA({ msg, sub = false }: { msg: string, sub?: boolean }): void {
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
            logA({ msg: "Inspect Button Clicked", sub: true })
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                const tab = tabs[0]
                if (tab) inspect(tab)
            })
        })

        const downloadButton = document.getElementById("downloadButton") as HTMLButtonElement
        downloadButton.addEventListener("click", () => {
            logA({ msg: "Download Button Clicked", sub: true })
            chrome.runtime.sendMessage({
                command: "downloadICampus",
                url: "https://vod.skku.edu/contents4/skku100001/660b67074c260/contents/media_files/mobile/ssmovie.mp4",
                filename: "output.mp4"
            })
        })
    })

    logA({ msg: "TS Loaded", sub: true })
})() // IIFE
