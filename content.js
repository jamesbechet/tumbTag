if (typeof(Storage) !== "undefined") {
  window.canStoreList = true;
} else {
  window.canStoreList = false;
}

$('document').ready(function() {
  var tumbTag = {
    $newPost: $('.new_post_label'),
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
      if (window.canStoreList) {
        if (!window.localStorage.tags) {
          // Add example tags list
          window.localStorage.tags = JSON.stringify([{
            name: 'Example',
            list: ['tag1', 'tag2', 'tag3'],
            selected: true
          }]);
        }
        this.tags = JSON.parse(window.localStorage.tags);
        this.getSelectedTagList();
        this.$newPost.click(this.createElems.bind(this));
        this.createElems();
      }
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
        if ($('#create_post').length) {
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

    bindElements: function() {
      var that = this;

      // Final action: Post tags
      this.$tags.find('.post_tagss').first().click(function(e) {
        that.hideAllExceptMe();
        var nbTags        = (!jQuery.isEmptyObject(that.tagsSelected) && that.tagsSelected.list.length) || 0,
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

      // Hide the options when the user click in the page (tumblr behavior)
      $('body').click(function() {
        that.hideAllExceptMe();
      });

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
      return '<li class="' + optionName + '"><div class="option ' + (selected ? 'selected': '') + '">' + optionName + (isDeletable ? '<i class="delete" href="#" style="float:right; color:#f00; font-size: 16px; font-style: none;">X</i>' : '') + '</div></li>';
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
             '<div class="post_options popover popover_gradient popover_menu popover_post_options south" style="display: none; top: auto; bottom: 11px;">' + 
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
      window.localStorage.tags = JSON.stringify(this.tags);
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
      var listName = this.checkListName(this.$createList.find('input').val()),
          tags     = this.$createList.find('textarea').val().replace(/\r\n/g, "\n").split("\n");

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
      window.localStorage.tags = JSON.stringify(this.tags);
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
      window.localStorage.tags = JSON.stringify(this.tags);
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
      var that = this,
          name = $(e.currentTarget).parent().parent().attr('class'),
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
      window.localStorage.tags = JSON.stringify(this.tags);
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