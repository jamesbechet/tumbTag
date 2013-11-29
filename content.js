chrome.extension.onMessage.addListener(function(msg, sender, sendResponse) {
switch (msg.type) {
  case "add-tags":
    var $tagInput     = $('input.editor'),
        $prevTagInput = $('div.editor_wrapper'),
        tagsNb        = msg.tagsList && msg.tagsList.length;

    if (tagsNb && $tagInput.length) {
      for (var i = 0; i < tagsNb; i += 1) {
        if (i === (tagsNb - 1)) { // Last value, different behavior
          $tagInput.val(msg.tagsList[i]);
        } else { // Add span
          $prevTagInput.before('<span class="tag">' + msg.tagsList[i] + '</span>');
        }
      }
    }
    break;
}
});