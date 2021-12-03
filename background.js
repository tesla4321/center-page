chrome.runtime.onInstalled.addListener(function(){
    let match_urls = ["github.com"]
    chrome.storage.sync.get('urls',({urls})=>{
    if(typeof urls !== 'undefined'){
        match_urls = urls
    }
    chrome.storage.sync.set({'urls': match_urls})
    })

    let activeList = Object.create(null)
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
        if(request.action === 'get_active_list'){
            sendResponse({activeList})
        }
        if(request.action === 'active'){
            console.log('checked');
            try {
                const url = URL(sender.tab.url)
                if(!match_urls.includes(url.hostname)){
                    match_urls.push(url.hostname)
                }
                chrome.storage.sync.set({'urls': match_urls})
                chrome.scripting.executeScript({target: {tabId: tabId}, function: () =>{
                            document.body.style.maxWidth = "65%";
                            document.body.style.minWidth = "1080px"
                            document.body.style.margin = "0 auto";
                        }})
                // chrome.scripting.executeScript({target: {tabId: sender.tab.id}, files: ['center.js']})
                // chrome.scripting.insertCSS({target: {tabId: sender.tab.id}, files: ['center.css']})
                activeList[sender.tab.id] = true
                sendResponse({status: true})
            } catch (error) {
                sendResponse({status: false})
            }
            
        }
        if(request.action === 'inactive'){
            console.log('unchecked');
            try {
                const url = URL(sender.tab.url)
                match_urls.splice(match_urls.indexOf(url.hostname), 1)
                chrome.storage.sync.set({'urls': match_urls})
                // chrome.scripting.removeCSS({target: {tabId: sender.tab.id}, file: 'center.css'})
                activeList[sender.tab.id] = false
                chrome.tabs.reload(sender.tab.id)
                sendResponse({status: true})
            } catch (error) {
                sendResponse({status: false})
            }
            
        }
    })
    chrome.tabs.onUpdated.addListener(
        async function(tabId, changeInfo, tab) {
            if(changeInfo.status === 'complete'){
                let [tab] = await chrome.tabs.query({active: true, currentWindow: true});
                if(tab.id === tabId){
                    const url = new URL(tab.url)
                    if(match_urls.includes(url.hostname)){
                        chrome.scripting.executeScript({target: {tabId: tabId}, function: () =>{
                            document.body.style.maxWidth = "65%";
                            document.body.style.minWidth = "1080px"
                            document.body.style.margin = "0 auto";
                        }})
                        // chrome.scripting.executeScript({target: {tabId: tabId}, files: ['center.js']})
                        // chrome.scripting.insertCSS({target: {tabId: tabId}, files: ['center.css']})
                        activeList[tabId] = true
                    }
                }
            }
        }
)

//todo: 监听前进后退，badge显示，toggle显示
})