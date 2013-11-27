if (typeof(Storage)!=="undefined") {
  this.canStoreList = true;
} else {
  this.canStoreList = false;
}

var tumbTag = {
  tagsList: null,
  menuElem: document.getElementById('menu'),
  tagElem: document.getElementById('add-tags'),
  listElem: document.getElementById('add-list'),
  tagsListElem: document.getElementById('tags-list'),
  validateTagsElem: document.getElementById('validate-tags'),

  // Init the object
  init: function () {
    this.tagsList = this.retrieveList();
    if (this.tagsList && this.tagsList.length) {
      this.tagElem.className = 'list-loaded';
    }
    this.bindEvents();
  },

  // Bind all the events
  bindEvents: function () {
    this.tagElem.onclick          = this.addTags.bind(this);
    this.listElem.onclick         = this.createList.bind(this);
    this.validateTagsElem.onclick = this.saveList.bind(this);
  },

  // Retrieve the tags' list in the local storage
  retrieveList: function () {
    if (window.canStoreList && window.localStorage) {
      this.tagsList = window.localStorage.tagsList.split(',');
    }
    return this.tagsList;
  },

  // Create the tags' list
  createList: function () {
    this.menuElem.className         = 'hide';
    this.tagsListElem.className     = 'show';
    this.validateTagsElem.className = 'show';
    if (this.tagsList && this.tagsList.length) {
      this.tagsListElem.value = this.tagsList.join('\n');
      this.tagsListElem.value += '\n';
      this.tagsListElem.scrollTop = this.tagsListElem.scrollHeight;
    }
  },

  // Save the tags' list
  saveList: function (argument) {
    this.tagsList                   = this.tagsListElem.value.replace(/\r\n/g, "\n").split("\n");
    window.localStorage.tagsList    = this.tagsList;
    this.tagsListElem.className     = 'hide';
    this.validateTagsElem.className = 'hide';
    this.menuElem.className         = 'show';
    if (this.tagsList && this.tagsList.length) {
      this.tagElem.className = 'list-loaded';
    }
  },

  // Add the tags in the tumblr's input
  addTags: function () {
    if (this.tagsList && this.tagsList.length) {
      // Can add the tags
    } else {
      // Display buble saying to add a list
    }
  }
}

// Loaded event
document.addEventListener('DOMContentLoaded', function () {
  tumbTag.init();
});
