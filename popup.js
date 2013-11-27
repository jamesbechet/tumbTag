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
      this.tagElem.className += 'list-loaded';
    }
    this.bindEvents();
  },

  // Bind all the events
  bindEvents: function () {
    this.tagElem.onclick  = this.addTags.bind(this);
    this.listElem.onclick = this.createList.bind(this);
  },

  // Retrieve the tags' list in the local storage
  retrieveList: function () {
    return [];
  },

  // Create the tags' list
  createList: function () {
    this.menuElem.className             = 'hide';
    this.tagsListElem.className     = 'show';
    this.validateTagsElem.className = 'show';
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
