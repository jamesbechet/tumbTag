chrome.extension.onMessage.addListener(function(msg, sender, sendResponse) {
switch(msg.type) {
        case "add-tags":
                console.log(msg);
        break;
}
});