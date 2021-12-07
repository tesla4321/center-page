const switchButton = document.getElementById('switch-key');

switchButton.addEventListener('change', (obj) => {
    if(obj.target.checked){
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.runtime.sendMessage({action: "active", tab: tabs[0]}, function(response) {
                if(response.status === false){
                    console.log("failed")
                    obj.checked = false;
                }
            });

        });
    }
    if(!obj.target.checked){
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.runtime.sendMessage({action: "inactive", tab: tabs[0]}, function(response) {
                if(response.status === false){
                    console.log("failed")
                    obj.checked = true;
                }
            });

        });
    }
})

chrome.runtime.sendMessage({action: "get_active_list"}, async function(response) {
  const activeList = response.activeList
  let [tab] = await chrome.tabs.query({active: true, currentWindow: true});
  if(activeList[tab.id]){
      switchButton.checked = true;
  }
});