function downloadICampus(
    { url, filename="output.mp4" }: { url: string, filename?: string }
): Promise<boolean> {
    function logConsole(msg: any, err: boolean = false): void {
        chrome.runtime.sendMessage({
            command: "log",
            msg: msg,
            err: err
        })
    }
    logConsole("[downloadICampus] Started")
    return fetch(url)
        .then((response) => response.blob())
        .then((blob) => {
            logConsole("[downloadICampus] Connetected")
            const blobUrl = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = blobUrl;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(blobUrl);
            logConsole("[downloadICampus] Ended")
            chrome.runtime.sendMessage({
                command: "closeTab",

            })
            return true
        })
        .catch((e) => {
            logConsole("[downloadICampus] Exception")
            logConsole(`${e}`, true)
            return false
        })
}


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.command === "log") {
        if (request.err) console.error(request.msg)
        else console.log(request.msg)
    } else {
        console.log(`[BG] Message Received: ${JSON.stringify(request)}`)
        if (request.command === "downloadICampus") {
            console.log("[BG] downloadICampus Started")
            chrome.tabs.create({ url: "https://lcms.skku.edu", active: false }, (tab) => {
                const tabId = tab.id

                chrome.tabs.onUpdated.addListener(function listener(tabIdUpdated, info) {
                    if (tabIdUpdated === tabId && info.status === "complete") {
                        chrome.tabs.onUpdated.removeListener(listener)
                        console.log("[BG] Tab Opened")

                        chrome.scripting.executeScript({
                            target: { tabId },
                            func: downloadICampus,
                            args: [{ url: request.url, filename: request.filename }]
                        })
                    }
                })
            })
        }
        if (request.command === "closeTab") {
            console.log("[BG] closeTab")
            if (sender.tab != undefined && sender.tab.id != undefined)
                chrome.tabs.remove(sender.tab.id)
        }
    }
})
