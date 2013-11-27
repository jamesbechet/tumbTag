var tumbTag = {
  listTags: null,
  tagElem: document.getElementById('add-tags'),
  listElem: document.getElementById('add-list'),

  // Init the object
  init: function () {
    this.listTags = this.retrieveList();
    if (this.listTags && this.listTags.length) {
      this.tagElem.className += 'list-loaded';
    }
    this.bindEvents();
  },

  // Bind all the events
  bindEvents: function () {
    this.tagElem.onclick = this.addTags.bind(this);
    this.listElem.onclick = this.createList.bind(this);
  },

  // Retrieve the tags' list in the local storage
  retrieveList: function () {
    return [];
  },

  // Create the tags' list
  createList: function () {
  },

  // Add the tags in the tumblr's input
  addTags: function () {
    if (this.listTags && this.listTags.length) {
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
