(async function () {
    // Logic

    let test = false

    function log(msg: string, tag: string | null = null, err: boolean = false): void {
        if (test) console.log(tag ? `[fightICampus][S/I][${tag}] ${msg}` : `[fightICampus][S/I] ${msg}`)
        chrome.runtime.sendMessage({
            command: "log",
            msg: tag ? `[S/I][${tag}] ${msg}` : `[S/I] ${msg}`,
            err: err
        })
    }

    function getByMessage(message: any): Promise<any> {
        return new Promise((resolve) => {
            chrome.runtime.sendMessage(
                message,
                (response) => { resolve(response) }
            )
        })
    }

    async function getSetting<T>(settingId: string): Promise<T> {
        const defaultValue = await getByMessage({
            command: "getDefaultSetting",
            settingId: settingId
        })
        return new Promise((resolve) => {
            chrome.storage.sync.get([settingId], (result) => {
                log(`Setting Loaded: ${settingId}, ${result[settingId]}(l), ${defaultValue}(d)`)
                if (result[settingId] == undefined) resolve(defaultValue)
                else resolve(result[settingId])
            })
        })
    }
    if (!await getSetting("setting-work")) return
    test = await getSetting("setting-test-mode")


    // Inspect

    log(`taget: ${window.location.href}`)

    const observer = new MutationObserver(() => {
        const title = document.querySelector(".xnlailct-title")?.textContent
        const contentId = document.querySelector("iframe")?.src
            .split("content_id%3D")[1]
            .split("%26")[0]

        log(`title: ${title}`)
        log(`contentId: ${contentId}`)

        if (title && contentId) {
            chrome.runtime.sendMessage({
                command: "sendItemViewData",
                title: title,
                contentId: contentId
            })
            log("Sent to Background")
        }

        observer.disconnect()
    })

    observer.observe(document.body, {
        childList: true,
        subtree: true
    })
})() // IIFE
