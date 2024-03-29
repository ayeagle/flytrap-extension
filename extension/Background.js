

let baseEmail = ''
let usedEmails = [];
let blockedDomains = [];
let currentSubVal = ''


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
    // deleteRecords()
    if (request.type === "setDBVals") {


        chrome.storage.sync.get(["usedEmails"], (result) => {
            console.log("this is the usedemails sync get")
            console.log(result)
            console.log(result.usedEmails)
            console.log(result.usedEmails[0])
            if (result.usedEmails[0]) {
                usedEmails = result.usedEmails
            }
            else {
                chrome.storage.local.get(["usedEmails"], (result) => {
                    if (result.usedEmails[0]) {
                        usedEmails = result.usedEmails
                    }
                })
            }
            console.log("this is usedEmails value locally in the background")
            console.log(usedEmails)
        })

        chrome.storage.sync.get(["blockedDomains"], (result) => {
            // console.log("this is the usedemails sync get")
            // console.log(result)
            // console.log(result.usedEmails)
            // console.log(result.usedEmails[0])
            if (result.blockedDomains[0]) {
                blockedDomains = result.blockedDomains
            }
            else {
                chrome.storage.local.get(["blockedDomains"], (result) => {
                    if (result.blockedDomains.length > 0) {
                        blockedDomains = result.blockedDomains
                    }
                })
            }
            console.log("this is blockeddomains value locally in the background")
            console.log(blockedDomains)
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

        sendResponse({ usedEmails: usedEmails, blockedDomains: blockedDomains })

    }
})

const deleteRecords = () => {
    // chrome.storage.local.set({ 'email': '' })
    // chrome.storage.sync.set({ 'email': '' })
    chrome.storage.local.set({ 'usedEmails': []})
    chrome.storage.sync.set({ 'usedEmails': [] })
    chrome.storage.local.set({ 'blockedDomains': []})
    chrome.storage.sync.set({ 'blockedDomains': [] })
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
    if (request.type === "setCurrentSubVal") {
        console.log("THE SET SUBVAL METHOD WAS INVOKED")
        chrome.storage.local.set({ 'currentSubVal': request.currentSubVal })
        chrome.storage.sync.set({ 'currentSubVal': request.currentSubVal })
        currentSubVal = request.currentSubVal;
        printStorage()
    }
})

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.type === "getCurrentSubVal") {
        console.log("THE GET SUBVAL METHOD WAS INVOKED")
        console.log("THE GET SUBVAL METHOD WAS INVOKED")
        console.log(currentSubVal)
        printStorage()
        sendResponse({ currentSubVal: currentSubVal });
    }
});



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
        // printStorage()
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

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.type === "getBlockedDomains") {
        console.log("THE gET BLOCKED DOMAINS METHOD WAS INVOKED")
        sendResponse({ blockedDomains: blockedDomains })

        printStorage()
    }
})


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.type === "addBlockedDomains") {
        console.log("THE ADD BLOCKED DOMAINS METHOD WAS INVOKED")

        console.log("domain to be blocked")

        console.log(request.blockedDomains)

        if( blockedDomains.length >= 10){
            blockedDomains = []
        }

        chrome.storage.local.set({ 'blockedDomains': request.blockedDomains })
        chrome.storage.sync.set({ 'blockedDomains': request.blockedDomains })
        console.log("current full list of blocked domains")
        console.log(request.blockedDomains)


        printStorage()

        sendResponse({ blockedDomains: blockedDomains })

    }
})