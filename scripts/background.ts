(function () {
    function log(msg: any, tag: string | null = null, err: boolean = false): void {
        msg = tag ? `[BG][${tag}] ${msg}` : `[BG] ${msg}`
        if (err) console.error(msg)
        else console.log(msg)
    }

    function downloadICampus(
        { url, filename="output.mp4" }: { url: string, filename?: string }
    ): Promise<boolean> {
        function logD(msg: any, err: boolean = false): void {
            chrome.runtime.sendMessage({
                command: "log",
                msg: `[BG][downloadICampus] ${msg}`,
                err: err
            })
        }
        logD("Started")
        return fetch(url)
            .then((response) => {
                logD("Connected")
                return response.blob()
            })
            .then((blob) => {
                const blobUrl = URL.createObjectURL(blob)
                const a = document.createElement("a")
                a.href = blobUrl
                a.download = filename
                document.body.appendChild(a)
                a.click()
                URL.revokeObjectURL(blobUrl)
                document.body.removeChild(a)
                logD("Ended")
                chrome.runtime.sendMessage({
                    command: "closeTab",
                })
                // 아 근데 blob 안쓰는게 난듯
                return true
            })
            .catch((e) => {
                logD("Exception")
                logD(`${e}`, true)
                return false
            })
    }

    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.command === "log") {
            if (message.err) console.error(message.msg)
            else console.log(message.msg)
        } else {
            log(`Message Received: ${JSON.stringify(message)}`)
            if (message.command === "downloadICampus") {
                log("Received", "downloadICampus")
                chrome.tabs.create({ url: "https://lcms.skku.edu", active: false }, (tab) => {
                    const tabId = tab.id

                    chrome.tabs.onUpdated.addListener(function listener(tabIdUpdated, info) {
                        if (tabIdUpdated === tabId && info.status === "complete") {
                            chrome.tabs.onUpdated.removeListener(listener)
                            log("openTab", "downloadICampus")

                            chrome.scripting.executeScript({
                                target: { tabId },
                                func: downloadICampus,
                                args: [{ url: message.url, filename: message.filename }]
                            })
                        }
                    })
                })
            }
            if (message.command === "closeTab") {
                log("closeTab")
                if (sender.tab != undefined && sender.tab.id != undefined)
                    chrome.tabs.remove(sender.tab.id)
            }
        }
    })
})() // IIFE
