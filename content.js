if (typeof(Storage) !== "undefined") {
  window.canStoreList = true;
} else {
  window.canStoreList = false;
}

$('document').ready(function() {
  var tumbTag = {
    $newPost: $('.new_post_label'),
    tagElement: '<div href="#" class="split" id="add_tags" style="margin-left:10px;"> <button class="chrome blue txt post_tagss">Tags</button><div class="chrome blue options"> </div></div>',
    // Static options menu
    optionsElement: '<div id="post_tag_options" style="position:absolute;top:5px;right:28px" class=""><div class="post_options popover popover_gradient popover_menu popover_post_options south" style="display: none; top: auto; bottom: 11px;"><div class="popover_inner"><ul><li class="create_list"><div class="option">Create List</div></li><li class="choose_list"><div class="option">Choose List</div></li><li class="modify_list"><div class="option">Modify List</div></li></ul></div></div></div>',
    tagsSelected: {},
    tags: [],
    $tags: [],
    $options: [],
    $createList: [],
    $modifyList: [],
    $chooseList: [],
    $createListBtn: [],
    $modifyListBtn: [],
    $chooseListBtn: [],
    selectorsHideable: ['post_tag_options', 'create_list_view', 'modify_list_view', 'choose_list_view'],

    init: function() {
      var that = this;

      if (window.canStoreList) {
        if (!window.localStorage.tags) {
          // Add example tags list
          window.localStorage.tags = JSON.stringify([{
            name: 'Example',
            list: ['tag1', 'tag2', 'tag3', 'tag5'],
            selected: true
          }]);
        }
        this.tags = JSON.parse(window.localStorage.tags);
        for (var i = 0; i < this.tags.length; i += 1) {
          if (this.tags[i].selected === true) {
            this.tagsSelected = this.tags[i];
            break;
          }
        }
        this.$newPost.click(that.addTagsButton.bind(this));
        that.addTagsButton();
      }
    },

    addTagsButton: function() {
      var that = this;

      setTimeout(function() {
        if ($('#create_post').length) {
          that.createElems();
          that.bindElements();
        }
      });
    },

    createElems: function() {
      $('#create_post').after(this.tagElement);
      this.$tags = $('#add_tags');
      // Options
      this.$tags.find('.options').after(this.optionsElement);
      this.$options = $('#post_tag_options').find('.post_options');
      // Options actions
      this.$createListBtn = this.$options.find('.create_list');
      this.$modifyListBtn = this.$options.find('.modify_list');
      this.$chooseListBtn = this.$options.find('.choose_list');
      this.buildViews();
    },

    bindElements: function() {
      var that = this;

      // Fill with tags
      this.$tags.find('.post_tagss').first().click(function(e) {
        var nbTags = that.tagsSelected.list.length,
            $tagInput     = $('input.editor'),
            $prevTagInput = $('div.editor_wrapper'),
            $postContent  = $('div#post_content');

        for (var i = 0; i < nbTags; i += 1) {
          if (i === (nbTags - 1)) { // Last value, different behavior
            $tagInput.val(that.tagsSelected.list[i]);
            $postContent.trigger('click'); // Add the last element, avoid one more click
          } else { // Add span
            $prevTagInput.before('<span class="tag">' + that.tagsSelected.list[i] + '</span>');
          }
        }
        return false;
      });

      // Show options
      this.$tags.find('.options').click(this.showOptions.bind(this));

      // Hide the options if it's showed
      $('body').click(function() {
        that.hideAllExceptMe();
      });

      // Avoid to trigger the event above
      $('#post_tag_options .post_options').click(function() {
        return false;
      });

      this.$createListBtn.click(this.createList.bind(this));
      this.$modifyListBtn.click(this.modifyList.bind(this));
      this.$chooseListBtn.click(this.chooseList.bind(this));
    },

    getOptionHtml: function(optionName, selected) {
      return '<li class="' + optionName + '"><div class="option ' + (selected ? 'selected': '') + '">' + optionName + '</div></li>';
    },

    getTextAreaHtml: function(optionName, tagsObj) {
      return '<li style="text-align:center;" class="' + optionName + 
             '"><input style="display:block;margin:10px auto" type="text" value="' + (tagsObj ? tagsObj.name: 'List name') + 
             '"><textarea style="height:250px;" id="tags-list" style="" name="TagsList">' + (tagsObj ? tagsObj.list.toString().replace(/,/g, '\n') : 'tag1\ntag2\ntag3') +
             '</textarea></li><li style="text-align:center;"><button class="chrome blue txt ' + (tagsObj ? 'modify_button' : 'create_button') + 
             '"' +  'style="cursor: pointer; margin-top: 5px; border-radius: 4px;">' + (tagsObj ? 'Modify' : 'Create') + '</button></li>'
    },

    getOptionsHtml: function(optionsId) {
      return '<div id="' + optionsId + '" style="position:absolute;top:5px;right:28px" class=""><div class="post_options popover popover_gradient popover_menu popover_post_options south" style="display: none; top: auto; bottom: 11px;"><div class="popover_inner"><ul></ul></div></div></div>';
    },

    addOption: function($selector, optionHtml) {
      if ($selector.prop('tagName') === 'UL') {
        $selector.append(optionHtml);
      } else if ($selector.prop('tagName') === 'LI') {
        $selector.after(optionHtml);
      }
    },

    showOptions: function() {
      this.$options.show();
      this.hideAllExceptMe(this.$options)
      return false;
    }, 

    createList: function() {
      this.createListView();
      this.hideAllExceptMe(this.$createList);
      this.$createList.show();
      return false;
    },
    
    checkListName: function(name) {
      for (var i = 0; i < this.tags.length; i += 1) {
        if (name === this.tags[i].name) {
          return (this.checkListName(name + '-' + 1))
        }
      }
      return name;
    },

    clearListOfSelected: function($selector) {
      for (var i = 0; i < this.tags.length; i += 1) {
        this.tags[i].selected = false;
      }
      window.localStorage.tags = JSON.stringify(this.tags);
    },

    _createList: function(modify, e) {
      var listName = this.checkListName(this.$createList.find('input').val()),
          tags     = this.$createList.find('textarea').val().replace(/\r\n/g, "\n").split("\n");

      tags = tags.filter(function (tag) { return tag !== ''; });
      this.clearListOfSelected();        

      if (modify === true) {
        for (var i = 0; i < this.tags.length; i += 1) {
          if (this.tags[i].name === $(e.currentTarget).parent().siblings('.create_list_view').children('input').val()) {
            this.tags[i].name = listName;
            this.tags[i].list = tags;
            this.tags[i].selected = true;
            this.tagsSelected = this.tags[i];
            break ;
          }
        }
      } else {
        this.tags.push({ name: listName, list: tags, selected: true });
        this.tagsSelected = this.tags[this.tags.length - 1];
      }
      window.localStorage.tags = JSON.stringify(this.tags);
      this.$createList.hide();
      this.chooseListView();
      this.modifyListView();
      return false;
    },

    modifyList: function() {
      this.hideAllExceptMe(this.$modifyList)
      this.$modifyList.show();
      return false;
    },

    chooseList: function() {
      this.hideAllExceptMe(this.$chooseList);
      this.$chooseList.show();
      return false;
    },

    setTagsSelected: function(selector) {
      for (var i = 0; i < this.tags.length; i += 1) {
        if ($(selector).attr('class') === this.tags[i].name) {
          this.tags[i].selected = true;
          this.tagsSelected = this.tags[i];
          break ;
        }
      }
      window.localStorage.tags = JSON.stringify(this.tags);
    },

    _chooseList: function(e) {
      this.clearListOfSelected();
      this.setTagsSelected(e.currentTarget);
      this.chooseListView();
      this.modifyListView();
    },

    buildViews: function() {
      this.createListView();
      this.modifyListView();
      this.chooseListView();
    },

    // Building Create List View
    createListView: function(tagsObj) {
      if (this.$createList.length) {
        this.$createList.parent().remove();
      }
      this.$tags.find('.options').after(this.getOptionsHtml('create_list_view'));
      this.$createList = $('#create_list_view').find('.post_options');
      this.addOption(this.$createList.find('ul'), this.getTextAreaHtml('create_list_view', tagsObj));
      this.$createList.find('.create_button').click(this._createList.bind(this));
      this.$createList.find('.modify_button').click(this._createList.bind(this, true));
      $('#create_list_view .post_options').click(function() {
        return false;
      })
    },

    // Building Modify List View
    modifyListView: function() {
      var that = this;

      if (this.$modifyList.length) {
        this.$modifyList.parent().remove();
      }
      this.$tags.find('.options').after(this.getOptionsHtml('modify_list_view'));
      this.$modifyList = $('#modify_list_view').find('.post_options');
      if (this.tags) {
        this.tags.forEach(function(tagObj) {
          that.addOption(that.$modifyList.find('ul'), that.getOptionHtml(tagObj.name, tagObj.selected));
        });
        this.$modifyList.find('li').click(this._modifyList.bind(this));
      }
      $('#modify_list_view .post_options').click(function() {
        return false;
      })
    },

    _modifyList: function(e) {
      for (var i = 0; i < this.tags.length; i += 1) {
        if ($(e.currentTarget).attr('class') === this.tags[i].name) {
          break ;
        }
      }
      this.hideAllExceptMe();
      // We can use the Create View which more or less the same
      this.createListView(i < this.tags.length ? this.tags[i]: this.tags[0]);
      this.$createList.show();
      return false;
    },

    // Building Choose List View
    chooseListView: function() {
      if (this.$chooseList.length) {
        this.$chooseList.parent().remove();
      }
      this.$tags.find('.options').after(this.getOptionsHtml('choose_list_view'));
      this.$chooseList = $('#choose_list_view').find('.post_options');
      if (window.localStorage.tags) {
        this.tags = JSON.parse(window.localStorage.tags);
        for (var i = 0; i < this.tags.length; i += 1) {
          this.addOption(this.$chooseList.find('ul'), this.getOptionHtml(this.tags[i].name, this.tags[i].selected));
        }
        this.$chooseList.find('li').click(this._chooseList.bind(this));
      }
      $('#choose_list_view .post_options').click(function() {
        return false;
      });
    },

    // Hide Views
    hideAllExceptMe: function($selector) {
      this.selectorsHideable.forEach(function(sel) {
        // Why the parrent ? Because the $selector is the real content that we show/hide and that doesn't have an ID
        if (($selector && $selector.parent().attr('id')) !== $('#' + sel).attr('id') || !$selector) {
          $('#' + sel).find('.post_options').hide();
        }
      });
    },

  };
  tumbTag.init();  
});

// chrome.extension.onMessage.addListener(function(msg, sender, sendResponse) {
// switch (msg.type) {
//   case "add-tags":
//     var $tagInput     = $('input.editor'),
//         $prevTagInput = $('div.editor_wrapper'),
//         $postContent  = $('div#post_content'),
//         tagsNb        = msg.tagsList && msg.tagsList.length;

//     if ($postContent && !($postContent.length)) {
//       sendResponse({
//         type: "error",
//         msg: 'You have to fill a post first'
//       });
//     } else if (tagsNb && $tagInput.length) {
//       for (var i = 0; i < tagsNb; i += 1) {
//         if (i === (tagsNb - 1)) { // Last value, different behavior
//           $tagInput.val(msg.tagsList[i]);
//           $postContent.trigger('click'); // Add the last element, avoid one more click
//         } else { // Add span
//           $prevTagInput.before('<span class="tag">' + msg.tagsList[i] + '</span>');
//         }
//       }
//     } else {
//       sendResponse({
//         type: "error",
//         msg: 'Oops, an unknown error occured. Sorry.'
//       });
//     }
//     break;
// }
// });