async function downloadICampus(
    { url, filename="output.mp4" }: { url: string, filename?: string }
): Promise<boolean> {
    log("[DOWNLOAD_ICAMPUS] STARTED")

    let response: Response
    try {
        response = await fetch(url, {
            method: "GET",
            headers: {
                "referer": "https://lcms.skku.edu/"
            }
        })
        if (!response.ok || !response.body) {
            log("[DOWNLOAD_ICAMPUS] Exception during Fetch")
            log(response.status.toString())
            return false
        }
        log("[DOWNLOAD_ICAMPUS] Connected")
    } catch (e: unknown) {
        log("[DOWNLOAD_ICAMPUS] Exception during Fetch")
        log(`${e}`)
        return false
    }

    try {
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = blobUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(blobUrl);
        log("[DOWNLOAD_ICAMPUS] End")
    } catch (e: unknown) {
        log("[DOWNLOAD_ICAMPUS] Exception during IO")
        log(`${e}`)
        return false
    }

    return true
}


function log(msg: string): void {
    const logArea = document.getElementById("log") as HTMLDivElement
    const time = new Date().toLocaleTimeString()
    const logLine = `[${time}] ${msg}`

    const line = document.createElement("div")
    line.textContent = logLine
    logArea.appendChild(line)

    logArea.scrollTop = logArea.scrollHeight
    console.log(logLine)
}


function subLog(msg: string): void {
    const logArea = document.getElementById("subLog") as HTMLDivElement
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
        subLog("Button Clicked")
        downloadICampus({
            url: "https://vod.skku.edu/contents4/skku100001/646d582510df8/contents/media_files/mobile/ssmovie.mp4",
            filename: "output.mp4"
        }).then((result: boolean) => {
            if (result) subLog("success")
            else subLog("fail")
        })
    })
})
subLog("TS Loaded")
