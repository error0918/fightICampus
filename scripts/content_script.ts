(function (){
    // Logic
    function log() {}


    // Inspect

    console.log(`[fightICampus] taget: ${window.location.href}`)

    let targetScript = document.scripts[0].textContent
    let variableList = targetScript?.split("\n")
        .filter((line) => line.trim().length > 0)
        .map((line) => line.split(" = ")[1].split(";")[0].replaceAll("\"", ""))

    let [contentId, contentTitle, playerType, contentType] = ["", "", "", ""]
    if (variableList && variableList.length > 0) {
        [contentId, contentTitle, playerType, contentType] = variableList
        console.log(`[fightICampus] contentId: ${contentId}`)
        console.log(`[fightICampus] contentTitle: ${contentTitle}`)
        console.log(`[fightICampus] contentType: ${contentType}`)
    }
    let userName = document.querySelector("meta[name=\"user_name\"]")?.getAttribute("content")
    let thumbnail = document.querySelector("meta[property=\"og:image\"]")?.getAttribute("content")
    let duration = document.querySelector("meta[name=\"duration\"]")?.getAttribute("content")
    let registrationDate = document.querySelector("meta[name=\"regdate\"]")?.getAttribute("content")
    console.log(`[fightICampus] userName: ${userName}`)
    console.log(`[fightICampus] thumbnail: ${thumbnail}`)
    console.log(`[fightICampus] duration: ${duration}`)
    console.log(`[fightICampus] registrationDate: ${registrationDate}`)


    // UI

    function makeButton(button: HTMLButtonElement, text: string): void {
        button.textContent = text
        button.style.padding = "10px 16px"
        button.style.fontSize = "16px"
        button.style.lineHeight = "1"
        button.style.border = "none"
        button.style.borderRadius = "9999px"
        button.style.backgroundColor = "#0945A0"
        button.style.color = "#ffffff"
        button.style.opacity = "0.7"
        button.style.cursor = "pointer"
    }

    if (!document.getElementById("fightICampusDiv")) {
        console.log(`[fightICampus] UI Load Started`)

        const div = document.createElement("div")
        div.id = "fightICampusDiv"
        div.style.position = "fixed"
        div.style.top = "20px"
        div.style.right = "20px"
        div.style.zIndex = "9999"

        // Popup
        let showInspectPopup = false
        const inspectPopup = document.createElement("div")
        inspectPopup.id = "fightICampusPopupDiv"
        inspectPopup.style.marginLeft = "auto"
        inspectPopup.style.width = "200px"
        inspectPopup.style.height = "300px"
        inspectPopup.style.borderRadius = "16px"
        inspectPopup.style.padding = "20px"
        inspectPopup.style.marginTop = "10px"
        inspectPopup.style.backgroundColor = "#ffffff"

        //

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
            // Popup
            if (showInspectPopup) div.removeChild(inspectPopup)
            else div.appendChild(inspectPopup)
            showInspectPopup = !showInspectPopup
        })
        buttonDiv.appendChild(inspectButton)

        const downloadButton = document.createElement("button")
        makeButton(downloadButton, "다운로드")
        downloadButton.addEventListener("click", () => {
            // TODO : 백그라운드에 요청 보내기
        })
        buttonDiv.appendChild(downloadButton)

        document.body.appendChild(div)

        console.log(`[fightICampus] UI Load Ended`)
    }

    // https://lcms.skku.edu/em/641d33964ca50?startat=0.00&endat=4703.35&TargetUrl=https%3A%2F%2Fcanvas.skku.edu%2Flearningx%2Fapi%2Fv1%2Fcourses%2F63267%2Fsections%2F0%2Fcomponents%2F10348%2Fprogress%3Fuser_id%3D2024312074%26content_id%3D641d33964ca50%26content_type%3Dmovie&sl=1&pr=1&mxpr=2.00&lg=ko

})() // IIFE