// listening for an event / one-time requests
// coming from the popup
chrome.extension.onMessage.addListener(function(req, sender, sendResponse) {
    switch(req.type) {
        case "add-tags":
            addTags(req);
        break;
    }
    return true;
});

// send a message to the content script
var addTags = function(req) {
        chrome.tabs.getSelected(null, function(tab){
            chrome.tabs.sendMessage(tab.id, {type: req.type, tagsList: req.tagsList});
        });
}