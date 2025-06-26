(function () {
    function log(msg: any, tag: string | null = null, err: boolean = false): void {
        msg = tag ? `[BG][${tag}] ${msg}` : `[BG] ${msg}`
        if (err) console.error(msg)
        else console.log(msg)
    }

    function nativeVideo(url: string): void {
        function logN(msg: any): void { log(msg, "nativeVideo") }
        logN("Started")
        chrome.tabs.create({ url: "https://lcms.skku.edu", active: true }, (tab) => {
            logN("Tab Opened")
            const tabId = tab.id
            chrome.tabs.onUpdated.addListener(function listener(tabIdUpdated, info) {
                if (tabIdUpdated === tabId && info.status === "complete") {
                    chrome.tabs.onUpdated.removeListener(listener)
                    logN("Tab Completed")
                    chrome.scripting.executeScript({
                        target: { tabId },
                        func: (url: string) => {
                            function logN2(msg: string) {
                                chrome.runtime.sendMessage({
                                    command: "log",
                                    msg: `[BG][nativeVideo] ${msg}`,
                                    err: false
                                })
                            }
                            logN2("ExecuteScript")
                            const a = document.createElement("a")
                            a.href = url
                            document.body.appendChild(a)
                            a.click()
                            logN2("Moved")
                        },
                        args: [url]
                    })
                }
            })
        })
    }

    function downloadICampus(
        { url, filename="output.mp4" }: { url: string, filename?: string }
    ): void {
        function logD(msg: any): void { log(msg, "downloadICampus") }
        logD("Started")
        chrome.tabs.create({ url: "https://lcms.skku.edu", active: false }, (tab) => {
            logD("Tab Opened")
            const tabId = tab.id
            chrome.tabs.onUpdated.addListener(function listener(tabIdUpdated, info) {
                if (tabIdUpdated === tabId && info.status === "complete") {
                    chrome.tabs.onUpdated.removeListener(listener)
                    logD("Tab Completed")
                    chrome.scripting.executeScript({
                        target: { tabId },
                        func: (url: string, filename: string) => {
                            function logD2(msg: string, err: boolean = false) {
                                chrome.runtime.sendMessage({
                                    command: "log",
                                    msg: `[BG][downloadICampus] ${msg}`,
                                    err: err
                                })
                            }
                            logD2("ExecuteScript")
                            return fetch(url)
                                .then((response) => {
                                    logD2("Connected")
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
                                    logD2("Ended")
                                })
                                .catch((e) => {
                                    logD2("Exception")
                                    logD2(`${e}`, true)
                                })
                        },
                        args: [url, filename]
                    }).then(() => {
                        if (tab != undefined && tab.id != undefined) {
                            chrome.tabs.remove(tab.id)
                            logD("Tab Closed")
                        }
                    })
                }
            })
        })
    }


    chrome.runtime.onMessage.addListener((message/*, sender, sendResponse*/) => {
        if (message.command === "log") {
            if (message.err) console.error(message.msg)
            else console.log(message.msg)
        } else {
            log(`Message Received: ${JSON.stringify(message)}`)
            if (message.command === "downloadICampus") {
                log("Received", "downloadICampus")
                downloadICampus({ url: message.url, filename: message.filename })
            }
            else if (message.command === "nativeVideo") {
                log("Received", "nativeVideo")
                nativeVideo(message.url)
            }
        }
    })
})() // IIFE
