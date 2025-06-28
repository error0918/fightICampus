(async function () {
    // Logic

    function log(msg: string, tag: string | null = null, err: boolean = false): void {
        console.log(tag ? `[PO][${tag}] ${msg}` : `[PO] ${msg}`)
    }

    function getByMessage(message: any): Promise<any> {
        return new Promise((resolve) => {
            chrome.runtime.sendMessage(
                message,
                (response) => { resolve(response) }
            )
        })
    }


    // Popup

    function appySetting(settingId: string, value: any): void {
        if (settingId === "setting-work") {
            if (value) {
                const settingList = document.getElementsByClassName("setting-box under-work")
                for (let setting of Array.from(settingList)) {
                    (setting as HTMLDivElement).style.display = ""
                }
            } else {
                const settingList = document.getElementsByClassName("setting-box under-work")
                for (let setting of Array.from(settingList)) {
                    (setting as HTMLDivElement).style.display = "none"
                }
            }
        }
    }

    const settingList = document.getElementsByClassName("setting-box")
    for (let setting of Array.from(settingList)) {
        const settingSwitch: HTMLInputElement | null = setting.querySelector(".switch-input")
        if (settingSwitch) {
            const settingId = settingSwitch.id
            // Load
            const defaultValue = await getByMessage({
                command: "getDefaultSetting",
                settingId: settingId
            })
            chrome.storage.sync.get([settingId], (result) => {
                log(`Setting Loaded: ${settingId}, ${result[settingId]}(l), ${defaultValue}(d)`)
                if (result[settingId] == undefined) settingSwitch.checked = defaultValue
                else settingSwitch.checked = result[settingId]
                appySetting(settingId, settingSwitch.checked)
            })
            // Send
            settingSwitch.addEventListener("change", () => {
                const sendSetting: Record<string, boolean> = {}
                sendSetting[settingId] = settingSwitch.checked
                chrome.storage.sync.set(sendSetting, () => {
                    log(`Setting Sent: ${settingId}, ${settingSwitch.checked}`)
                    appySetting(settingId, settingSwitch.checked);
                    (document.querySelector("#refresh-message-span") as HTMLSpanElement).style.display = ""
                })
            })
        }
    }

    // 초기화
    document.querySelector("button#button-clear")?.addEventListener("click", async () => {
        chrome.storage.sync.clear()
        const settingList = document.getElementsByClassName("setting-box")
        for (let setting of Array.from(settingList)) {
            const settingSwitch: HTMLInputElement | null = setting.querySelector(".switch-input")
            if (settingSwitch) {
                const settingId = settingSwitch.id
                settingSwitch.checked = await getByMessage({
                    command: "getDefaultSetting",
                    settingId: settingId
                })
                appySetting(settingId, settingSwitch.checked)
            }
        }
    })
})() // IIFE
