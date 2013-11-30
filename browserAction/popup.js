if (typeof(Storage) !== "undefined") {
  this.canStoreList = true;
} else {
  this.canStoreList = false;
}

// There you go
var tumbTag = {
  tagsList: null,
  $menuElem: $('#menu'),
  $tagElem: $('#add-tags'),
  $listElem: $('#add-list'),
  $tagsListElem: $('#tags-list'),
  $validateTagsElem: $('#validate-tags'),
  $errors: $('p#errors'),

  // Init the object
  init: function () {
    this.tagsList = this.retrieveList();
    if (this.tagsList && this.tagsList.length) {
      this.$tagElem.addClass('list-loaded');
    }
    this.bindEvents();
  },

  // Bind all the events
  bindEvents: function () {
    this.$tagElem.on('click', this.addTags.bind(this));
    this.$listElem.on('click', this.createList.bind(this));
    this.$validateTagsElem.on('click', this.saveList.bind(this));
  },

  // Retrieve the tags' list in the local storage
  retrieveList: function () {
    if (window.canStoreList && window.localStorage) {
      this.tagsList = window.localStorage.tagsList.split(',');
      if (this.tagsList && !this.tagsList[0]) {
        this.tagsList = null;
      }
    }
    return this.tagsList;
  },

  // Create the tags' list
  createList: function () {
    this.$menuElem.hide();
    this.$tagsListElem.show();
    this.$validateTagsElem.show();
    if (this.tagsList && this.tagsList.length) {
      this.$tagsListElem.val(this.tagsList.join('\n') + '\n');
      this.$tagsListElem.scrollTop(this.$tagsListElem[0].scrollHeight);
    }
    if (this.$errors.css('display') !== 'none') {
      clearTimeout(this.hideTimeout);
      this.$errors.hide();
    }
  },

  // Save the tags' list
  saveList: function (argument) {
    this.tagsList                 = this.$tagsListElem.val().replace(/\r\n/g, "\n").split("\n");
    this.tagsList                 = this.tagsList.filter(function (tag) {return tag !== '';});
    window.localStorage.tagsList  = this.tagsList;

    this.$tagsListElem.hide();
    this.$validateTagsElem.hide();
    this.$menuElem.show();
    if (this.tagsList && this.tagsList.length) {
      this.$tagElem.addClass('list-loaded');
    } else {
      this.$tagElem.removeClass('list-loaded');
    }
  },

  // Display errors
  showError: function (err) {
    var that = this;

    if (this.$errors.css('display') === 'none') {
      this.$errors.text(err);
      this.$errors.show(1000);
      this.hideTimeout = setTimeout(function () {
        that.$errors.hide(1000);
      }, 4000)
    }
  },

  // Add the tags in the tumblr's input
  addTags: function () {
    var that = this,
        $inputTagsElem = $('input.editor_wrapper');

    if (this.tagsList && this.tagsList.length) {
      chrome.extension.sendMessage({
        type: "add-tags",
        tagsList: this.tagsList
      }, function (res) {
        res && that.showError(res.msg);
      });
    } else {
      // Display buble saying to add a list
      this.showError('You have to create your list of tags first');
    }
  }
}

// Loaded event
document.addEventListener('DOMContentLoaded', function () {
  tumbTag.init();
});

