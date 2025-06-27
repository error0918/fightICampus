(function () {
    // Logic

    let test = true

    function log(msg: string, tag: string | null = null, err: boolean = false): void {
        if (test) console.log(tag ? `[fightICampus][S/I][${tag}] ${msg}` : `[fightICampus][S/I] ${msg}`)
        chrome.runtime.sendMessage({
            command: "log",
            msg: tag ? `[S/I][${tag}] ${msg}` : `[S/I] ${msg}`,
            err: err
        })
    }


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
