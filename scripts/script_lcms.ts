(function (){
    // Logic

    let test = true

    function log(msg: string, tag: string | null = null, err: boolean = false): void {
        if (test) console.log(tag ? `[fightICampus][S/L][${tag}] ${msg}` : `[fightICampus][S/L] ${msg}`)
        chrome.runtime.sendMessage({
            command: "log",
            msg: tag ? `[S/L][${tag}] ${msg}` : `[S/L] ${msg}`,
            err: err
        })
    }

    function nativeVideo(url: string): void {
        function logN(msg: any, err: boolean = false): void { log(msg, "downloadICampus", err) }
        logN("Started")
        const a = document.createElement("a")
        a.href = url
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        logN("Ended")
    }

    function downloadICampus(
        { url, filename="output.mp4" }: { url: string, filename?: string }
    ): Promise<boolean> {
        function logD(msg: any, err: boolean = false): void { log(msg, "downloadICampus", err) }
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
                return true
            })
            .catch((e) => {
                logD("Exception")
                logD(`${e}`, true)
                return false
            })
    }


    // Inspect

    log(`taget: ${window.location.href}`)

    let targetScript = document.scripts[0].textContent
    let variableList = targetScript?.split("\n")
        .filter((line) => line.trim().length > 0)
        .map((line) => line.split(" = ")[1].split(";")[0].replaceAll("\"", ""))

    let [contentId, contentName, _, contentType] = ["", "", "", ""]
    if (variableList && variableList.length > 0) {
        [contentId, contentName,, contentType] = variableList
        log(`contentId: ${contentId}`)
        log(`contentTitle: ${contentName}`)
        log(`contentType: ${contentType}`)
    }

    let contentTitle: string | null = null
    chrome.runtime.sendMessage(
        {
            command: "getItemViewData",
            contentId: contentId
        },
        (response: string | null) => {
            if (response) {
                contentTitle = response
                log(`contentTitle: ${contentTitle}`)

                // UI
                downloadInput.value = contentTitle
                const inspectText = document.createElement("p")
                inspectText.textContent = `영상 제목: ${contentTitle}`
                inspectText.style.fontFamily = "NanumSquareNeo"
                inspectText.style.fontSize = "12px"
                inspectText.style.marginTop = "0px"
                inspectText.style.marginBottom = "4px"
                inspectContentDiv.appendChild(inspectText)
            } else {
                log(`Fail to Load contentTitle`)
            }
        }
    )

    let userName = document.querySelector("meta[name=\"user_name\"]")?.getAttribute("content")
    let thumbnail = document.querySelector("meta[property=\"og:image\"]")?.getAttribute("content")
    let duration = document.querySelector("meta[name=\"duration\"]")?.getAttribute("content")
    let registrationDate = document.querySelector("meta[name=\"regdate\"]")?.getAttribute("content")
    log(`userName: ${userName}`)
    log(`thumbnail: ${thumbnail}`)
    log(`duration: ${duration}`)
    log(`registrationDate: ${registrationDate}`)

    let movLink = ""
    let durationStr = ""
    let registrationDateStr = ""
    let contentTypeStr = ""
    if (duration) {
        let durationInt = parseInt(duration)
        if (Math.floor(durationInt / 3600)) durationStr += `${Math.floor(durationInt / 3600)}시간 `
        durationInt = durationInt % 3600
        if (durationStr || Math.floor(durationInt / 60)) durationStr += `${Math.floor(durationInt / 60)}분 `
        durationInt = durationInt % 60
        if (durationStr || durationInt) durationStr += `${durationInt}초`
    }
    if (registrationDate) {
        registrationDateStr += `${registrationDate.slice(0, 4)}/${registrationDate.slice(4, 6)}/${registrationDate.slice(6, 8)} `
        registrationDateStr += `${registrationDate.slice(8, 10)}:${registrationDate.slice(10, 12)}:${registrationDate.slice(12, 14)}`
    }
    switch (contentType) {
        case "2":
            movLink = `https://vod.skku.edu/contents4/skku100001/${contentId}/contents/media_files/mobile/ssmovie.mp4`
            contentTypeStr = "일반 동영상 (2)"
            break
        case "13":
            movLink = `https://vod.skku.edu/contents4/skku100001/${contentId}/contents/media_files/sub.mp4`
            contentTypeStr = "화면 + 캠 동영상 (13)"
            break
        case "29":
            movLink = `https://vod.skku.edu/contents4/skku100001/${contentId}/contents/media_files/screen.mp4`
            contentTypeStr = "캡쳐 영상 (29)"
            break
        default:
            if (contentType) {
                movLink = `https://vod.skku.edu/contents4/skku100001/${contentId}/contents/media_files/mobile/ssmovie.mp4`
                contentTypeStr = `확인되지 않은 타입: ${contentType}`
            }
    }


    // UI

    let font = `@font-face { font-family: 'NanumSquareNeo'; src: url(https://hangeul.pstatic.net/hangeul_static/webfont/NanumSquareNeo/NanumSquareNeoTTF-bRg.eot); src: url(https://hangeul.pstatic.net/hangeul_static/webfont/NanumSquareNeo/NanumSquareNeoTTF-bRg.eot?#iefix) format("embedded-opentype"), url(https://hangeul.pstatic.net/hangeul_static/webfont/NanumSquareNeo/NanumSquareNeoTTF-bRg.woff) format("woff"), url(https://hangeul.pstatic.net/hangeul_static/webfont/NanumSquareNeo/NanumSquareNeoTTF-bRg.ttf) format("truetype"); }' +
    '@font-face { font-family: 'NanumSquareNeoBold'; src: url(https://hangeul.pstatic.net/hangeul_static/webfont/NanumSquareNeo/NanumSquareNeoTTF-cBd.eot); src: url(https://hangeul.pstatic.net/hangeul_static/webfont/NanumSquareNeo/NanumSquareNeoTTF-cBd.eot?#iefix) format("embedded-opentype"), url(https://hangeul.pstatic.net/hangeul_static/webfont/NanumSquareNeo/NanumSquareNeoTTF-cBd.woff) format("woff"), url(https://hangeul.pstatic.net/hangeul_static/webfont/NanumSquareNeo/NanumSquareNeoTTF-cBd.ttf) format("truetype"); }`
    const fontStyle = document.createElement("style")
    fontStyle.textContent = font
    document.head.append(fontStyle)

    function makeButton(button: HTMLButtonElement, text: string, for_menu: boolean = false): void {
        button.textContent = text
        button.style.padding = "10px 16px"
        button.style.fontFamily = "NanumSquareNeo"
        button.style.fontSize = "12px"
        button.style.lineHeight = "1"
        button.style.borderColor = "#000000"
        button.style.borderWidth = "1px"
        button.style.borderStyle = "solid"
        button.style.borderRadius = "9999px"
        button.style.backgroundColor = "#0945A0"
        button.style.color = "#ffffff"
        button.style.cursor = "pointer"
        if (for_menu) {
            button.style.fontSize = "16px"
            button.style.opacity = "0.7"
        }
    }

    log(`UI Load Started`)

    const div = document.createElement("div")
    div.id = "fightICampusDiv"
    div.style.position = "fixed"
    div.style.top = "20px"
    div.style.right = "20px"
    div.style.zIndex = "9999"

    // InspectPopup
    let showInspectPopup = false
    const inspectPopup = document.createElement("div")
    inspectPopup.style.position = "relative"
    inspectPopup.style.marginLeft = "auto"
    inspectPopup.style.width = "200px"
    inspectPopup.style.borderColor = "#000000"
    inspectPopup.style.borderWidth = "1px"
    inspectPopup.style.borderStyle = "solid"
    inspectPopup.style.borderRadius = "16px"
    inspectPopup.style.padding = "20px"
    inspectPopup.style.marginTop = "10px"
    inspectPopup.style.backgroundColor = "#ffffff"

    const inspectTitle = document.createElement("h3")
    inspectTitle.textContent = "영상 분석"
    inspectTitle.style.fontFamily = "NanumSquareNeoBold"
    inspectPopup.appendChild(inspectTitle)

    const inspectClose = document.createElement("p")
    inspectClose.textContent = "X"
    inspectClose.style.position = "absolute"
    inspectClose.style.top = "0px"
    inspectClose.style.right = "0px"
    inspectClose.style.padding = "25px"
    inspectClose.style.fontFamily = "NanumSquareNeo"
    inspectClose.style.fontSize = "16px"
    inspectClose.style.lineHeight = "1"
    inspectClose.style.cursor = "pointer"
    inspectClose.addEventListener("click", () => {
        div.removeChild(inspectPopup)
        showInspectPopup = false
    })
    inspectPopup.appendChild(inspectClose)

    if (thumbnail) {
        const inspectImage = document.createElement("img")
        inspectImage.src = thumbnail
        inspectImage.style.width = "120px"
        inspectImage.style.display = "block"
        inspectImage.style.marginBottom = "12px"
        inspectImage.style.marginLeft = "auto"
        inspectImage.style.marginRight = "auto"
        inspectImage.style.borderColor = "#000000"
        inspectImage.style.borderWidth = "1px"
        inspectImage.style.borderStyle = "solid"
        inspectPopup.appendChild(inspectImage)
    }

    const inspectContentDiv = document.createElement("div")
    inspectContentDiv.style.display = "flex"
    inspectContentDiv.style.flexDirection = "column-reverse"
    const contentList = [`영상 이름: ${contentName}`,
        `담당 교수님: ${userName}`,
        `영상 길이: ${durationStr}`,
        `영상 등록: ${registrationDateStr}`,
        `영상 ID: ${contentId}`,
        `영상 Type: ${contentTypeStr}`].reverse()
    for (let content of contentList) {
        const inspectText = document.createElement("p")
        inspectText.textContent = content
        inspectText.style.fontFamily = "NanumSquareNeo"
        inspectText.style.fontSize = "12px"
        inspectText.style.marginTop = "0px"
        inspectText.style.marginBottom = "4px"
        inspectContentDiv.appendChild(inspectText)
    }
    inspectPopup.appendChild(inspectContentDiv)

    const nativeVideoButtonDiv = document.createElement("div")
    nativeVideoButtonDiv.style.width = "fit-content"
    nativeVideoButtonDiv.style.display = "flex"
    nativeVideoButtonDiv.style.alignItems = "center"
    nativeVideoButtonDiv.style.marginTop = "12px"
    nativeVideoButtonDiv.style.marginLeft = "auto"
    nativeVideoButtonDiv.style.gap = "8px"
    inspectPopup.appendChild(nativeVideoButtonDiv)

    const nativeVideoLocalButton = document.createElement("button")
    makeButton(nativeVideoLocalButton, "NV", false)
    nativeVideoLocalButton.addEventListener("click", () => {
        nativeVideo(movLink)
    })
    nativeVideoButtonDiv.appendChild(nativeVideoLocalButton)

    const nativeVideoNTButton = document.createElement("button")
    makeButton(nativeVideoNTButton, "NVNT", false)
    nativeVideoNTButton.addEventListener("click", () => {
        chrome.runtime.sendMessage({
            command: "nativeVideo",
            url: movLink
        })
    })
    nativeVideoButtonDiv.appendChild(nativeVideoNTButton)

    // DownloadPopup
    let showDownloadPopup = false
    const downloadPopup = document.createElement("div")
    downloadPopup.style.position = "relative"
    downloadPopup.style.marginLeft = "auto"
    downloadPopup.style.width = "200px"
    downloadPopup.style.borderColor = "#000000"
    downloadPopup.style.borderWidth = "1px"
    downloadPopup.style.borderStyle = "solid"
    downloadPopup.style.borderRadius = "16px"
    downloadPopup.style.padding = "20px"
    downloadPopup.style.marginTop = "10px"
    downloadPopup.style.backgroundColor = "#ffffff"

    const downloadTitle = document.createElement("h3")
    downloadTitle.textContent = "다운로드"
    downloadTitle.style.fontFamily = "NanumSquareNeoBold"
    downloadPopup.appendChild(downloadTitle)

    const downloadClose = document.createElement("p")
    downloadClose.textContent = "X"
    downloadClose.style.position = "absolute"
    downloadClose.style.top = "0px"
    downloadClose.style.right = "0px"
    downloadClose.style.padding = "25px"
    downloadClose.style.fontFamily = "NanumSquareNeo"
    downloadClose.style.fontSize = "16px"
    downloadClose.style.lineHeight = "1"
    downloadClose.style.cursor = "pointer"
    downloadClose.addEventListener("click", () => {
        div.removeChild(downloadPopup)
        showDownloadPopup = false
    })
    downloadPopup.appendChild(downloadClose)

    const downloadInputTitle = document.createElement("p")
    downloadInputTitle.textContent = "파일명"
    downloadInputTitle.style.fontFamily = "NanumSquareNeo"
    downloadInputTitle.style.fontSize = "12px"
    downloadInputTitle.style.lineHeight = "1"
    downloadInputTitle.style.marginBottom = "4px"
    downloadPopup.appendChild(downloadInputTitle)

    const downloadInput = document.createElement("input")
    downloadInput.value = contentName
    downloadInput.type = "text"
    downloadInput.placeholder = "/\\:*?\"<> 금지"
    downloadInput.style.padding = "8px 12px"
    downloadInput.style.fontFamily = "NanumSquareNeo"
    downloadInput.style.fontSize = "14px"
    downloadInput.style.lineHeight = "1"
    downloadInput.style.width = "160px"
    downloadInput.style.marginBottom = "12px"
    downloadInput.addEventListener(
        'keydown',
        (e) => { e.stopImmediatePropagation() },
        true
    )
    downloadPopup.appendChild(downloadInput)

    const downloadPopupButtonDiv = document.createElement("div")
    downloadPopupButtonDiv.style.display = "flex"
    downloadPopupButtonDiv.style.flexDirection = "row-reverse"
    downloadPopupButtonDiv.style.alignItems = "center"
    downloadPopupButtonDiv.style.marginLeft = "auto"
    downloadPopupButtonDiv.style.gap = "12px"
    downloadPopup.appendChild(downloadPopupButtonDiv)

    const downloadSpinnerDiv = document.createElement("div")
    const shadow = downloadSpinnerDiv.attachShadow({ mode: "open" })

    const bootstrapCDN = document.createElement("link")
    bootstrapCDN.href = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/css/bootstrap.min.css"
    bootstrapCDN.rel = "stylesheet"
    bootstrapCDN.integrity = "sha384-LN+7fdVzj6u52u30Kp6M/trliBMCMKTyK833zpbD+pXdCLuTusPj697FH4R/5mcr"
    bootstrapCDN.crossOrigin = "anonymous"
    shadow.appendChild(bootstrapCDN)

    const downloadSpinner = document.createElement("div")
    downloadSpinner.className = "spinner-border"
    downloadSpinner.style.width = "1.5rem"
    downloadSpinner.style.height = "1.5rem"
    downloadSpinner.role = "status"
    shadow.appendChild(downloadSpinner)

    let showDownloadPopupMessage = false
    const downloadPopupMessage = document.createElement("p")
    downloadPopupMessage.textContent = "오류 발생"
    downloadPopupMessage.style.fontFamily = "NanumSquareNeo"
    downloadPopupMessage.style.fontSize = "12px"
    downloadPopupMessage.style.color = "#7a0520"

    const downloadPopupButton = document.createElement("button")
    makeButton(downloadPopupButton, "다운로드", false)
    downloadPopupButton.addEventListener("click", () => {
        log(`movLink: ${movLink}`)
        if (showDownloadPopupMessage) downloadPopupButtonDiv.removeChild(downloadPopupMessage)

        downloadPopupButton.style.backgroundColor = "#5f6b7e"
        downloadPopupButton.style.cursor = "wait"
        downloadPopupButton.disabled = true

        downloadPopupButtonDiv.appendChild(downloadSpinnerDiv)

        let filename = contentTitle ? contentTitle : contentName
        if (downloadInput.value.trim() != "" && !/[\/:*?"<>\\]/.test(downloadInput.value)) filename = downloadInput.value.trim()
        downloadICampus({ url: movLink, filename: `${filename}.mp4` })
            .then((result: boolean) => {
                if (!result) {
                    showDownloadPopupMessage = true
                    downloadPopupButtonDiv.appendChild(downloadPopupMessage)
                }
                downloadPopupButton.style.backgroundColor = "#0945A0"
                downloadPopupButton.style.cursor = "pointer"
                downloadPopupButton.disabled = false

                downloadPopupButtonDiv.removeChild(downloadSpinnerDiv)
            })
    })
    downloadPopupButtonDiv.appendChild(downloadPopupButton)

    // Buttons
    const buttonDiv = document.createElement("div")
    buttonDiv.style.width = "fit-content"
    buttonDiv.style.marginLeft = "auto"
    buttonDiv.style.display = "flex"
    buttonDiv.style.justifyItems = "right"
    buttonDiv.style.gap = "10px"
    div.appendChild(buttonDiv)

    let toggle = true
    const toggleButton = document.createElement("button")
    makeButton(toggleButton, ">", true)
    toggleButton.addEventListener("click", () => {
        if (toggle) {
            if (showInspectPopup) {
                div.removeChild(inspectPopup)
                showInspectPopup = false
            }
            if (showDownloadPopup) {
                div.removeChild(downloadPopup)
                showDownloadPopup = false
            }
            buttonDiv.removeChild(inspectButton)
            buttonDiv.removeChild(downloadButton)
            toggleButton.textContent = "<"
        } else {
            buttonDiv.appendChild(inspectButton)
            buttonDiv.appendChild(downloadButton)
            toggleButton.textContent = ">"
        }
        toggle = !toggle
    })
    buttonDiv.appendChild(toggleButton)

    const inspectButton = document.createElement("button")
    makeButton(inspectButton, "분석", true)
    inspectButton.addEventListener("click", () => {
        if (showInspectPopup) div.removeChild(inspectPopup)
        else {
            if (showDownloadPopup) {
                div.removeChild(downloadPopup)
                showDownloadPopup = false
            }
            div.appendChild(inspectPopup)
        }
        showInspectPopup = !showInspectPopup
    })
    buttonDiv.appendChild(inspectButton)

    const downloadButton = document.createElement("button")
    makeButton(downloadButton, "다운로드", true)
    downloadButton.addEventListener("click", () => {
        if (showDownloadPopup) div.removeChild(downloadPopup)
        else {
            if (showInspectPopup) {
                div.removeChild(inspectPopup)
                showInspectPopup = false
            }
            div.appendChild(downloadPopup)
        }
        showDownloadPopup = !showDownloadPopup
    })
    buttonDiv.appendChild(downloadButton)

    document.body.appendChild(div)

    log(`UI Load Ended`)
})() // IIFE
