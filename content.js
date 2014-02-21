$('document').ready(function() {
  var tumbTag = {
    $newPost: $('.new_post_label, .reblog'),
    tagsSelected: {},
    tags: [],
    $tags: [],
    $optionsList: [],
    $createList: [],
    $modifyList: [],
    $chooseList: [],
    $createListBtn: [],
    $modifyListBtn: [],
    $chooseListBtn: [],
    selectorsHideable: ['post_tag_options', 'create_list_view', 'modify_list_view', 'choose_list_view'],

    init: function() {
      var that = this;

      if (window.localStorage.tags) {
        this.syncStorages();
      } else {
        this.createExampleList();
      }

      setInterval(function() {
        that.$newPost = $('.new_post_label, .reblog');
        that.$newPost.click(that.createElems.bind(that));
      }, 2000);
  },

  displayTagButton: function() {
    var that = this;

    if (window.location.pathname && /new/i.test(window.location.pathname)) {
      setTimeout(function() {
        that.createElems()
      }, 0);
    }
  },

  // Retrieve tags in the localstorage and store it in chrome.storage
  syncStorages: function() {
    var that = this,
        tags = JSON.parse(window.localStorage.tags);

    chrome.storage.sync.set({'tags': tags});
    chrome.storage.sync.get('tags', function(tags) {
      that.tags = tags.tags;
      that.getSelectedTagList();
      that.createElems();
      window.localStorage.clear();
      that.displayTagButton();
    });
  },

  // Create an example list when the tags' list is empty (after delete or at the beginning)
  createExampleList: function() {
    var that = this;

    chrome.storage.sync.get('tags', function(tags){
      if (!tags || !tags.tags || !tags.tags.length) {
        chrome.storage.sync.set({'tags': [{name: 'Example', list: ['tag1', 'tag2', 'tag3'], selected: true}]});
        chrome.storage.sync.get('tags', function(tags) {
          that.tags = tags.tags;
          that.tagsSelected = that.tags[0];
          that.buildModifyView();
          that.buildChooseView();
        });
      } else {
        that.tags = tags.tags;
        that.getSelectedTagList();
      }
        that.displayTagButton();
    });
  },

  getSelectedTagList: function() {
      for (var i = 0; i < this.tags.length; i += 1) {
        if (this.tags[i].selected === true) {
          this.tagsSelected = this.tags[i];
          break;
        }
      }
    },

    createElems: function() {
      var that = this;

      setTimeout(function() {
        if ($('#create_post').length && !$('#add_tags').length) {
          $('#create_post').after(that.getTagBtnHtml());
          that.$tags = $('#add_tags');
          // Options
          that.$tags.find('.options').after(that.getOptionsMenuHtml());
          that.$optionsList = $('#post_tag_options').find('.post_options');
          // Options actions
          that.$createListBtn = that.$optionsList.find('.create_list');
          that.$modifyListBtn = that.$optionsList.find('.modify_list');
          that.$chooseListBtn = that.$optionsList.find('.choose_list');
          that.buildViews();
          that.bindElements();
        }
      }, 0);
    },

    postTags: function() {
      this.hideAllExceptMe();
      var nbTags        = (!jQuery.isEmptyObject(this.tagsSelected) && this.tagsSelected.list.length) || 0,
          $tagInput     = $('input.editor'),
          $prevTagInput = $('div.editor_wrapper'),
          $postContent  = $('div#post_content');

      for (var i = 0; i < nbTags; i += 1) {
        if (i === (nbTags - 1)) { // Last value, different behavior
          $tagInput.val(this.tagsSelected.list[i]);
          $postContent.trigger('click'); // Add the last element, avoid one more click
        } else { // Add span
          $prevTagInput.before('<span class="tag">' + this.tagsSelected.list[i] + '</span>');
        }
      }
      return false;
    },

    bindElements: function() {
      // Final action: Post tags
      this.$tags.find('.post_tagss').first().click(this.postTags.bind(this));

      // Show options
      this.$tags.find('.options').click(this.showOptions.bind(this));

      // Hide the options when the user click in the page (tumblr behavior)
      $('body').click(this.hideAllExceptMe.bind(this));

      // Avoid to hide the options (body click event)
      $('#post_tag_options .post_options').click(function() {
        return false;
      });

      // Bind the actions available on the options
      this.$createListBtn.click(this.createList.bind(this));
      this.$modifyListBtn.click(this.modifyList.bind(this));
      this.$chooseListBtn.click(this.chooseList.bind(this));
    },

    // HTML strings
    getOptionHtml: function(optionName, selected, isDeletable) {
      return '<li class="' + optionName + '"><div class="option ' + (selected ? 'selected': '') + '" style="width: 250px">' + '<span style="display: inline-block; float: left; max-width: 200px; overflow: hidden; text-overflow: ellipsis">' + optionName + '</span>' + (isDeletable ? '<i class="delete" href="#" style="margin-left: 10px; display: inline-block; float: right; color:#f00; font-size: 16px; font-style: none;">X</i>' : '') + '</div></li>';
    },

    getTextAreaHtml: function(optionName, tagsObj) {
      return '<li style="text-align:center;" class="' + optionName + 
             '"><input style="display:block;margin:10px auto" type="text" value="' + (tagsObj ? tagsObj.name: 'List name') + 
             '"><textarea style="height:250px;" id="tags-list" style="" name="TagsList">' + (tagsObj ? tagsObj.list.toString().replace(/,/g, '\n') : 'tag1\ntag2\ntag3') +
             '</textarea></li><li style="text-align:center;"><button class="chrome blue txt ' + (tagsObj ? 'modify_button' : 'create_button') + 
             '"' +  'style="cursor: pointer; margin-top: 5px; border-radius: 4px;">' + (tagsObj ? 'Modify' : 'Create') + '</button></li>'
    },

    getOptionsHtml: function(optionsId) {
      return '<div id="' + optionsId + '" style="position:absolute;top:5px;right:28px" class="">' + 
             '<div class="post_options popover popover_gradient popover_menu popover_post_options south" style="display: none; top: auto; bottom: 11px; max-height: 352px; overflow: auto;">' + 
             '<div class="popover_inner"><ul></ul></div></div></div>';
    },

    getTagBtnHtml: function() {
      return '<div href="#" class="split" id="add_tags" style="margin-left:10px;">' + 
             '<button class="chrome blue txt post_tagss">Tags</button><div class="chrome blue options"></div></div>';
    },

    getOptionsMenuHtml: function() {
      return '<div id="post_tag_options" style="position:absolute;top:5px;right:28px" class="">' + 
             '<div class="post_options popover popover_gradient popover_menu popover_post_options south" style="display: none; top: auto; bottom: 11px;">' + 
             '<div class="popover_inner"><ul><li class="create_list"><div class="option">Create List</div></li><li class="choose_list"><div class="option">Choose List</div>' + 
             '</li><li class="modify_list"><div class="option">Modify List</div></li></ul></div></div></div>';
    },


    // Utils //

    addOption: function($selector, optionHtml) {
      if ($selector.prop('tagName') === 'UL') {
        $selector.append(optionHtml);
      } else if ($selector.prop('tagName') === 'LI') {
        $selector.after(optionHtml);
      }
    },

    // Handle the case of same List's name
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
      chrome.storage.sync.set({'tags': this.tags});
    },


    // Views //

    showOptions: function() {
      this.$optionsList.show();
      this.hideAllExceptMe(this.$optionsList)
      return false;
    }, 

    createList: function() {
      this.buildCreateView();
      this.hideAllExceptMe(this.$createList);
      this.$createList.show();
      return false;
    },

    _createList: function(modify, e) {
      var tags = this.$createList.find('textarea').val().replace(/\r\n/g, "\n").split("\n"),
          listName;

      if (modify !== true || (modify && this.$createList.find('input').val() !== this.tagsSelected.name)) {
        listName = this.checkListName(this.$createList.find('input').val());
      } else if (modify === true) {
        listName = this.$createList.find('input').val();
      }

      tags = tags.filter(function (tag) { return tag !== ''; });
      this.clearListOfSelected();        

      if (modify === true) {
        this.tagsSelected.name = listName;
        this.tagsSelected.list = tags;
        this.tagsSelected.selected = true;
      } else {
        this.tags.push({ name: listName, list: tags, selected: true });
        this.tagsSelected = this.tags[this.tags.length - 1];
      }
      chrome.storage.sync.set({'tags': this.tags});
      this.$createList.hide();
      this.buildChooseView();
      this.buildModifyView();
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
      chrome.storage.sync.set({'tags': this.tags});
    },

    _chooseList: function(e) {
      this.clearListOfSelected();
      this.setTagsSelected(e.currentTarget);
      this.buildChooseView();
      this.buildModifyView();
    },

    buildViews: function() {
      this.buildCreateView();
      this.buildModifyView();
      this.buildChooseView();
    },

    // Building Create List View
    buildCreateView: function(tagsObj) {
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
    buildModifyView: function() {
      var that = this;

      if (this.$modifyList.length) {
        this.$modifyList.parent().remove();
      }
      this.$tags.find('.options').after(this.getOptionsHtml('modify_list_view'));
      this.$modifyList = $('#modify_list_view').find('.post_options');
      if (this.tags) {
        this.tags.forEach(function(tagObj) {
          that.addOption(that.$modifyList.find('ul'), that.getOptionHtml(tagObj.name, tagObj.selected, true));
        });
        this.$modifyList.find('li').click(this._modifyList.bind(this));
        this.$modifyList.find('.delete').click(this._deleteList.bind(this));
      }
      $('#modify_list_view .post_options').click(function() {
        return false;
      })
    },

    _deleteList: function(e) {
      var that        = this,
          name        = $(e.currentTarget).parent().parent().attr('class'),
          wasSelected = false;

      for (var i = 0; i < this.tags.length; i += 1) {
        if (this.tags[i].name === name) {
          wasSelected = this.tags[i].selected;
          this.tags.splice(i, 1);
          break ;
        }
      }

      // When we delete a list, change the selected list
      if (wasSelected && this.tags.length) {
        this.tagsSelected = this.tags[this.tags.length - 1];
        this.tagsSelected.selected = true;
      } else if (wasSelected) {
        this.tagsSelected = {};
      }
      // When we updated the list, check if there is still a list available otherwise create the example one
      chrome.storage.sync.set({'tags': this.tags}, function() {
        if (!that.tags.length) {
          that.hideAllExceptMe();
          that.createExampleList();
        }
      });
      this.buildModifyView();
      this.buildChooseView();
      setTimeout(function() {
        that.$modifyList.show();
      }, 0);
    },

    _modifyList: function(e) {
      for (var i = 0; i < this.tags.length; i += 1) {
        if ($(e.currentTarget).attr('class') === this.tags[i].name) {
          break ;
        }
      }
      this.hideAllExceptMe();
      // We can use the Create View which more or less the same
      this.clearListOfSelected();
      this.tagsSelected = i < this.tags.length ? this.tags[i]: this.tags[0];
      this.buildCreateView(i < this.tags.length ? this.tags[i]: this.tags[0]);
      this.$createList.show();
      return false;
    },

    // Building Choose List View
    buildChooseView: function() {
      if (this.$chooseList.length) {
        this.$chooseList.parent().remove();
      }
      this.$tags.find('.options').after(this.getOptionsHtml('choose_list_view'));
      this.$chooseList = $('#choose_list_view').find('.post_options');
      for (var i = 0; i < this.tags.length; i += 1) {
        this.addOption(this.$chooseList.find('ul'), this.getOptionHtml(this.tags[i].name, this.tags[i].selected));
      }
      this.$chooseList.find('li').click(this._chooseList.bind(this));
      $('#choose_list_view .post_options').click(function() {
        return false;
      });
    },

    // Hide Views
    hideAllExceptMe: function($selector) {
      this.selectorsHideable.forEach(function(sel) {
        // Why the parrent ? Because the $selector is the real content that we show/hide and that doesn't have an ID
        if (!$selector || ($selector && !$selector.currentTarget && $selector.parent().attr('id') !== $('#' + sel).attr('id'))) {
          $('#' + sel).find('.post_options').hide();
        }
      });
    },

  };
  tumbTag.init();  
});