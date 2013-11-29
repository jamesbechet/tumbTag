// listening for an event / one-time requests
// coming from the popup
chrome.extension.onMessage.addListener(function(req, sender, sendResponse) {
switch(req.type) {
	case "add-tags":
  	sendReq(req, sendResponse);
  	break;
}
return true;
});

// send a message to the content script
var sendReq = function(req, sendResponse) {
  chrome.tabs.getSelected(null, function(tab){
      chrome.tabs.sendMessage(tab.id, {type: req.type, tagsList: req.tagsList}, function (res) {
      	res && sendResponse(res);
      });
  });
}