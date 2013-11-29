chrome.extension.onMessage.addListener(function(msg, sender, sendResponse) {
switch (msg.type) {
  case "add-tags":
    var $tagInput     = $('input.editor'),
        $prevTagInput = $('div.editor_wrapper'),
        $postContent  = $('div#post_content'),
        tagsNb        = msg.tagsList && msg.tagsList.length;

    if ($postContent && !($postContent.length)) {
      sendResponse({
        type: "error",
        msg: 'You have to fill a post first'
      });
    } else if (tagsNb && $tagInput.length) {
      for (var i = 0; i < tagsNb; i += 1) {
        if (i === (tagsNb - 1)) { // Last value, different behavior
          $tagInput.val(msg.tagsList[i]);
          $postContent.trigger('click'); // Add the last element, avoid one more click
        } else { // Add span
          $prevTagInput.before('<span class="tag">' + msg.tagsList[i] + '</span>');
        }
      }
    } else {
      sendResponse({
        type: "error",
        msg: 'Oops, an unknown error occured. Sorry.'
      });
    }
    break;
}
});