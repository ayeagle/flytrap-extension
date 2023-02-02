

let baseEmail = ''
let usedEmails = [];


const printStorage = () => {
    chrome.storage.local.get(["email"], (result) => {
        console.log("LOCAL")
        console.log(result)
    })

    chrome.storage.sync.get(["email"], (result) => {
        console.log("SYNC")
        console.log(result)
    })

    console.log("basemail val")
    console.log(baseEmail)
}

// console.log("wwoooooowww this is the background file")
// printStorage()

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.type === "setDBVals") {


        chrome.storage.sync.get(["usedEmails"], (result) => {
            // console.log("this is the usedemails sync get")
            // console.log(result)
            // console.log(result.usedEmails)
            // console.log(result.usedEmails[0])
            if (result.usedEmails[0]) {
                usedEmails = result.usedEmails
            }
            else {
                chrome.storage.local.get(["email"], (result) => {
                    if (result.usedEmails[0]) {
                        usedEmails = result.usedEmails
                    }
                })
            }
            console.log("this is usedEmails value locally in the background")
            console.log(usedEmails)
        })
        
        
        
        chrome.storage.sync.get(["email"], (result) => {
            console.log("local key")
            console.log(result.email)
        
            if (result.email) {
                baseEmail = result.email
            }
            else {
                chrome.storage.local.get(["email"], (result) => {
                    console.log("sync key")
                    console.log(result.email)
        
                    if (result.email) {
                        baseEmail = result.email
                    }
                })
            }
            console.log("this is the base email")
            console.log(baseEmail)
        })

        sendResponse({ usedEmails: usedEmails })

    }
})

const deleteRecords = () => {
    chrome.storage.local.set({ 'email': '' })
    chrome.storage.sync.set({ 'email': '' })
    chrome.storage.local.set({ 'usedEmails': []})
    chrome.storage.sync.set({ 'usedEmails': [] })
}

// deleteRecords()


let img = chrome.runtime.getURL("images/fillbot.png")
let logo = chrome.runtime.getURL("images/logo.png")

// console.log(img)

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.type === "getLogo") {
        sendResponse({ img: img, logo:logo })

        printStorage()

    }
})


chrome.runtime.onMessage.addListener(function (request) {
    if (request.type === "setEmail") {
        console.log("THE SET EMAIL METHOD WAS INVOKED")
        chrome.storage.local.set({ 'email': request.email })
        chrome.storage.sync.set({ 'email': request.email })
        baseEmail = request.email;
        printStorage()
    }
})

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.type === "getEmail") {
        console.log("THE GET EMAIL METHOD WAS INVOKED")
        printStorage()
        sendResponse({ email: baseEmail });
    }
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.type === "addUsedEmail") {
        console.log("THE ADD USED EMAIL METHOD WAS INVOKED")
        usedEmails.push(request.usedEmail)

        if( usedEmails.length >= 5){
            usedEmails = []
        }

        chrome.storage.local.set({ 'usedEmails': usedEmails })
        chrome.storage.sync.set({ 'usedEmails': usedEmails })
        printStorage()

        sendResponse({ usedEmails: usedEmails })

    }
})