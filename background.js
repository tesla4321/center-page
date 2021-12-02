chrome.runtime.onInstalled.addListener(function(){
    let match_urls = ["github.com"]
    chrome.storage.sync.get('urls',({urls})=>{
    if(typeof urls !== 'undefined'){
        match_urls = urls
    }
    chrome.storage.sync.set({'urls': match_urls})
    })

    let activeList = []
    chrome.tabs.onUpdated.addListener(
        async function(tabId, changeInfo, tab) {
            if(changeInfo.status === 'complete'){
                let [tab] = await chrome.tabs.query({active: true, currentWindow: true});
                if(tab.id === tabId){
                    const url = new URL(tab.url)
                    if(match_urls.includes(url.hostname)){
                        chrome.scripting.executeScript({target: {tabId: tabId}, files: ['center.js']})
                    }
                }
            }
        }
)

//todo: 监听前进后退，badge显示
})