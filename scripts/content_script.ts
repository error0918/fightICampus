(function (){
    // Logic

    let test = true

    function log(msg: string, tag: string | null = null, err: boolean = false): void {
        if (test) console.log(tag ? `[fightICampus][${tag}] ${msg}` : `[fightICampus] ${msg}`)
        chrome.runtime.sendMessage({
            command: "log",
            msg: tag ? `[CS][${tag}] ${msg}` : `[CS] ${msg}`,
            err: err
        })
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

    let [contentId, contentTitle, _, contentType] = ["", "", "", ""]
    if (variableList && variableList.length > 0) {
        [contentId, contentTitle,, contentType] = variableList
        log(`contentId: ${contentId}`)
        log(`contentTitle: ${contentTitle}`)
        log(`contentType: ${contentType}`)
    }
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

    function makeButton(button: HTMLButtonElement, text: string): void {
        button.textContent = text
        button.style.padding = "10px 16px"
        button.style.fontFamily = "NanumSquareNeo"
        button.style.fontSize = "16px"
        button.style.lineHeight = "1"
        button.style.borderColor = "#000"
        button.style.borderWidth = "1px"
        button.style.borderStyle = "solid"
        button.style.borderRadius = "9999px"
        button.style.backgroundColor = "#0945A0"
        button.style.color = "#ffffff"
        button.style.opacity = "0.7"
        button.style.cursor = "pointer"
    }

    if (!document.getElementById("fightICampusDiv")) {
        log(`UI Load Started`)

        const div = document.createElement("div")
        div.id = "fightICampusDiv"
        div.style.position = "fixed"
        div.style.top = "20px"
        div.style.right = "20px"
        div.style.zIndex = "9999"

        // Popup
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

        const contentList = [`영상 제목: ${contentTitle}`,
            `담당 교수님: ${userName}`,
            `영상 길이: ${durationStr}`,
            `영상 등록: ${registrationDateStr}`,
            `영상 ID: ${contentId}`,
            `영상 Type: ${contentTypeStr}`]
        for (let content of contentList) {
            const inspectText = document.createElement("p")
            inspectText.textContent = content
            inspectText.style.fontFamily = "NanumSquareNeo"
            inspectText.style.fontSize = "12px"
            inspectText.style.marginTop = "0px"
            inspectText.style.marginBottom = "4px"
            inspectPopup.appendChild(inspectText)
        }

        if (thumbnail) {
            const inspectImage = document.createElement("img")
            inspectImage.src = thumbnail
            inspectImage.style.width = "140px"
            inspectImage.style.display = "block"
            inspectImage.style.marginTop = "8px"
            inspectImage.style.marginLeft = "auto"
            inspectImage.style.marginRight = "auto"
            inspectImage.style.borderColor = "#000000"
            inspectImage.style.borderWidth = "1px"
            inspectImage.style.borderStyle = "solid"
            inspectPopup.appendChild(inspectImage)
        }

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
        makeButton(toggleButton, ">")
        toggleButton.addEventListener("click", () => {
            if (toggle) {
                if (showInspectPopup) {
                    div.removeChild(inspectPopup)
                    showInspectPopup = false
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
        makeButton(inspectButton, "분석")
        inspectButton.addEventListener("click", () => {
            if (showInspectPopup) div.removeChild(inspectPopup)
            else div.appendChild(inspectPopup)
            showInspectPopup = !showInspectPopup
        })
        buttonDiv.appendChild(inspectButton)

        const downloadButton = document.createElement("button")
        makeButton(downloadButton, "다운로드")
        downloadButton.addEventListener("click", () => {
            log(`movLink: ${movLink}`)
            // TODO : 이름 지정, 로딩창
            downloadICampus({ url: movLink, filename: `${contentTitle}.mp4` }).then()
        })
        buttonDiv.appendChild(downloadButton)

        document.body.appendChild(div)

        log(`UI Load Ended`)
    }
})() // IIFE
