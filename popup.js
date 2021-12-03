let switchButton = document.getElementById('switch-key');

switchButton.addEventListener('change', (obj) => {
    if(obj.checked){
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {action: "active"}, function(response) {
                if(response.status === false){
                    obj.checked = false;
                }
            });
        });
    }
    if(!obj.checked){
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {action: "inactive"}, function(response) {
                if(response.status === false){
                    obj.checked = true;
                }
            });
        });
    }
})

chrome.runtime.sendMessage({action: "get_active_list"}, async function(response) {
  const activeList = response.activeList
  console.log(activeList)
  let [tab] = await chrome.tabs.query({active: true, currentWindow: true});
  if(activeList[tab.id]){
      switchButton.checked = true;
  }
});