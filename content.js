$(function () {
  // The app
  var $root
  var ROOT_SELECTOR = '#tumbTag'
  var ROOT_ELEM = '<div id="tumbTag"></div>'
  var ROOT_CSS = {
    'position': 'absolute',
    'left': '1200px',
    'top': '400px',
    '-webkit-transform': 'translateX(-50%) translateY(-100%)',
    'z-index': '1011',
    'width': '200px',
    'color': '#fff',
    'margin-bottom': '1em',
    '-webkit-transition': 'top .3s ease-in-out'
  }

  // The actions container
  var $actions
  var ACTIONS_SELECTOR = '#tumbTag-actions'
  var ACTIONS_ELEM = '<div id="tumbTag-actions"></div>'
  var ACTIONS_ELEM_CSS = {
    'font-size': '1.5em',
    'cursor': 'pointer',
    'margin-bottom': '.5em'
  }

  // The icon to create/edit the lists
  var $addList
  var ADD_EDIT_LIST_SELECTOR = '.tumbTag-iconPencil'
  var ADD_EDIT_LIST_ELEM = '<i class="tumbTag-iconPencil icon_edit_pencil"></i>'
  var ADD_EDIT_LIST_ELEM_CSS = {
    'font-size': '1.5em',
    'line-height': '1em'
  }

  // The editor container
  var $editor
  var EDITOR_ELEM = '<div id="tumbTag-editor"></div>'
  var EDITOR_CSS = {
    'width': '200px',
    'height': '250px',
    'background-color': '#fff',
    'box-sizing': 'border-box',
    'padding': '1em'
  }

  // The input to edit the list name
  var $editorListName
  var EDITOR_LIST_NAME_SELECTOR = '#tumbTag-addListName'
  var EDITOR_LIST_NAME_ELEM = '<input id="tumbTag-addListName"/>'
  var EDITOR_LIST_NAME_CSS = {
    'width': '100%',
    'margin-bottom': '1em'
  }

  // The textarea to edit the list content
  var $editorListContent
  var EDITOR_LIST_CONTENT_SELECTOR = '#tumbTag-addListTags'
  var EDITOR_LIST_CONTENT_ELEM = '<textarea id="tumbTag-addListTags"></textarea>'
  var EDITOR_LIST_CONTENT_CSS = {
    'width': '100%',
    'height': '100px'
  }

  // The button to create/edit the list
  var $editorButton
  var EDITOR_BUTTON_SELECTOR = '#tumbTag-addListButton'
  var EDITOR_BUTTON_ELEM = '<button id="tumbTag-addListButton">Done</button>'
  var EDITOR_BUTTON_CSS = {
    'padding': '.2em 1em',
    'display': 'block',
    'margin': '0 auto',
    'background-color': '#529ecc'
  }

  // The lists
  var $lists
  var LISTS_SELECTOR = '#tumbTag-lists'
  var LISTS_ELEM = '<ul id="tumbTag-lists"></ul>'
  var LISTS_CSS = {
    'max-height': '250px',
    'overflow-y': 'scroll'
  }

  // A list
  var LIST_SELECTOR = '.tumbTag-list'
  var LIST_CSS = {
    'cursor': 'pointer',
    'padding': '10px',
    'background-color': 'rgba(0, 0, 0, 0.07)',
    'margin-bottom': '1em'
  }

  // The icon to delete a list
  var DELETE_LIST_SELECTOR = '.tumbTag-iconClose'
  var DELETE_LIST_ELEM = '<i class="tumbTag-iconClose icon_close"></i>'
  var DELETE_LIST_CSS = {
    'float': 'right',
    'margin-right': '.4em',
    'font-size': '1.3em',
    'line-height': '1em'
  }

  // Other Selectors
  var POST_CONTAINER_SELECTOR = '.post-container'
  var POST_CONTAINER_TAGS_SELECTOR = '.post-form--tag-editor'
  var POST_CONTAINER_TAGS_INPUT_SELECTOR = '.tag-input-wrapper .editor-plaintext'
  var POST_CONTAINER_TAGS_INPUT_WRAPPER_SELECTOR = '.tag-input-wrapper .editor-placeholder'

  // Events
  var EVENT = {
    DOM_SUBTREE_MODIFIED: 'DOMSubtreeModified',
    CLICK: 'click',
    FOCUS: 'focus',
    BLUR: 'blur'
  }

  /**
   * The list's name being edited.
   * @type {String}
   */
  var editingList

  /**
   * Contains the tags.
   * It gets saved in the `chrome.storage`.
   * @type {Object}
   */
  var store

  /**
   * Whether or not the app is in debug mode.
   * TODO
   * @type {Boolean}
   */
  var isDebugging

  //////////
  // INIT //
  //////////

  /**
   * Inits the app.
   */
  function init () {
    debug('init')

    // Get the store
    initStore()

    // Init the debug flags
    initDebug()

  }

  /**
   * Gets the stored data.
   */
  function initStore () {
    debug('initStore')
    get(onAfterGetStore)
  }

  /**
   * Gets the stored data.
   * If there is no data stored, create an example
   * and set it in the storage.
   *
   * @param  {Object} storage
   */
  function onAfterGetStore (storage) {
    debug('onAfterGetStore: storage %o', storage)
    // If there are tags store, return them
    if (storage && storage.tags && storage.tags.length) {
      store = storage
    }
    // If there are no tags stored, set the example
    else {
      setExample()
    }
    shouldRender()
  }

  /**
   * Sets the example in the storage.
   */
  function setExample () {
    debug('setExample')
    store = {
      tags: [
        {
          name: 'Example',
          list: [
            'tag1',
            'tag2',
            'tag3'
          ]
        }
      ]
    }
    set()
  }

  /**
   * Inits the debug flag.
   */
  function initDebug () {
    // TODO handle `isDebugging` flag
    isDebugging = true
    console.group('Tumblr Tag')
  }

  ////////////
  // RENDER //
  ////////////

  /**
   * Renders the app.
   */
  function render () {
    debug('render: store %o', store)
    if ($root) {
      unmount()
    }

    $('body').append(ROOT_ELEM)

    $root = $(ROOT_SELECTOR)
    $root.css(ROOT_CSS)

    renderActions()

    renderLists()

    renderEditor()

    adjustPosition()

    // Bind the events
    bind()
  }

  /**
   * Renders the actions.
   */
  function renderActions () {
    debug('renderActions')

    // Append the actions container
    $root.append(ACTIONS_ELEM)
    $actions = $(ACTIONS_SELECTOR)
    $actions.css(ACTIONS_ELEM_CSS)

    // Append the add/edit button
    $actions.append(ADD_EDIT_LIST_ELEM)
    $addList = $(ADD_EDIT_LIST_SELECTOR)
    $addList.css(ADD_EDIT_LIST_ELEM_CSS)
  }

  /**
   * Renders the lists.
   */
  function renderLists () {
    debug('renderLists')

    // Append the lists container
    $root.append(LISTS_ELEM)

    // Append the lists
    $lists = $(LISTS_SELECTOR)
    store.tags.forEach(function (tagObj) {
      $lists.append('<li class="' + LIST_SELECTOR.slice(1) + '">' + tagObj.name + DELETE_LIST_ELEM + '</li>')
    })

    $lists.css(LISTS_CSS)
    $(LIST_SELECTOR).css(LIST_CSS)
    $(DELETE_LIST_SELECTOR).css(DELETE_LIST_CSS)
  }

  /**
   * Creates the editor.
   */
  function renderEditor () {
    debug('renderEditor')

    // Create the editor
    $editor = $(EDITOR_ELEM)
    $editor.hide()

    // Container
    $addList.after($editor)
    $editor.css(EDITOR_CSS)

    // List name
    $editor.append(EDITOR_LIST_NAME_ELEM)
    $editorListName = $(EDITOR_LIST_NAME_SELECTOR)
    $editorListName.css(EDITOR_LIST_NAME_CSS)
    $editorListName.before('<p style="font-size:13px;font-weight:700;color:#444">List name</p>')

    // List tags
    $editor.append(EDITOR_LIST_CONTENT_ELEM)
    $editorListContent = $(EDITOR_LIST_CONTENT_SELECTOR)
    $editorListContent.css(EDITOR_LIST_CONTENT_CSS)
    $editorListContent.before('<p style="font-size:13px;font-weight:700;color:#444">List tags</p>')

    // Validate List
    $editor.append(EDITOR_BUTTON_ELEM)
    $editorButton = $(EDITOR_BUTTON_SELECTOR)
    $editorButton.css(EDITOR_BUTTON_CSS)
  }

  /**
   * Renders the editor.
   */
  function fillEditor () {
    debug('fillEditor')

    // Get the list data
    var name
    var list
    if (editingList) {
      name = editingList
      list = findList(editingList).list
      $editorButton.text('Edit')
    }
    else {
      name = 'Blogging'
      list = [
        'tag1',
        'tag2',
        'tag3'
      ]
      $editorButton.text('Done')
    }

    $editorListName.val(name)
    $editorListContent.val(list.join('\n'))
  }

  /**
   * Unbinds the events  and remove all the elements from the dom.
   */
  function unmount () {
    debug('unmount')

    // Unbind the events
    unbind()

    // Cleanup
    $addList.remove()
    $actions.remove()
    $editor.remove()
    $editorListName.remove()
    $editorListContent.remove()
    $editorButton.remove()
    $root.remove()

    $addList = null
    $actions = null
    $editor = null
    $editorListName = null
    $editorListContent = null
    $editorButton = null
    $root = null
  }

  /**
   * Periodically check if `tumbTag` should be rendered.
   */
  function shouldRender () {
    setTimeout(function () {
      if ($(POST_CONTAINER_TAGS_SELECTOR).length) {
        if (!$root) {
          render()
        }

      }
      else if ($root) {
        unmount()
      }

      shouldRender()

    }, 2000)
  }

  /////////////
  // ACTIONS //
  /////////////

  /**
   * Sets the store in the `chrome.storage`.
   */
  function set () {
    sort()

    debug('set: store %o', store)
    chrome.storage.sync.set(store)
  }

  /**
   * Gets the `chrome.storage`
   * @param  {Function} callback
   */
  function get (callback) {
    chrome.storage.sync.get('tags', callback)
  }

  /**
   * Adds the list to the store.
   * @param {String} name
   * @param {String[]} list
   */
  function addList (name, list) {
    debug('addList: name %o, list %o', name, list)

    store = {
      tags: store.tags.concat([
        {
          name: name,
          list: list
        }
      ])
    }
  }

  /**
   * Edits the list with the given name.
   * @param  {String} name
   * @param  {String[]} list
   */
  function editList (name, list) {
    debug('editList: name %o, list %o', name, list)

    // Remove the old list
    store.tags = store.tags.filter(function (obj) {
      return obj.name !== editingList
    })

    // Add the new list
    addList(name, list)
  }

  ////////////
  // EVENTS //
  ////////////

  /**
   * Binds events on the element created.
   */
  function bind () {
    debug('bind')

    // Tumblr
    $(POST_CONTAINER_SELECTOR).on(EVENT.DOM_SUBTREE_MODIFIED, onDOMSubtreeModified)

    // Add/edit list
    $(ADD_EDIT_LIST_SELECTOR).on(EVENT.CLICK, onClickPencil)

    // List
    $(LIST_SELECTOR).on(EVENT.CLICK, onClickList)
    $(DELETE_LIST_SELECTOR).on(EVENT.CLICK, onClickDeleteList)

    // Editor
    $editorButton.on(EVENT.CLICK, onClickEditorButton)
  }

  /**
   * Unbinds evens on the element created.
   */
  function unbind () {
    debug('unbind')

    // Tumblr
    $(POST_CONTAINER_SELECTOR).off(EVENT.DOM_SUBTREE_MODIFIED, onDOMSubtreeModified)

    // Add/edit list
    $(ADD_EDIT_LIST_SELECTOR).off(EVENT.CLICK, onClickPencil)

    // List
    $(LIST_SELECTOR).on(EVENT.CLICK, onClickList)
    $(DELETE_LIST_SELECTOR).on(EVENT.CLICK, onClickDeleteList)

    // Editor
    if ($editorButton) {
      $editorButton.off(EVENT.CLICK, onClickEditorButton)
    }
  }

  ////////////////////
  // EVENT HANDLERS //
  ////////////////////

  /**
   * Callback triggered when a list is clicked.
   * @param  {Event} event
   * @return {Boolean}
   */
  function onClickList (event) {
    debug('onClickList: event ', event)

    // If the add list selector is open, edit the list
    let index = $(event.currentTarget).index()
    if (isEditorVisible()) {
      editTagList(index)
    }
    //  If the add list selector is closed, append the tags
    else {
      appendTagsToPost(index)
    }

    return false
  }

  /**
   * Sets the `editingList` and renders the editor.
   * @param  {Number} index
   */
  function editTagList (index) {
    debug('editTagList: index', index)

    // Get the list being edited
    var list = store.tags[index]
    editingList = list.name

    // Render the list
    fillEditor()

  }

  /**
   * Delete the list.
   * @param  {String} name
   */
  function deleteList (name) {
    debug('deleteList: name ', name)

    // Delete the list that match the givne name
    store.tags = store.tags.filter(function (obj) {
      return obj.name !== name
    })

    // Set the list to the storage
    set()

    // Re-render
    render()

  }

  /**
   * Callback triggered when the delete list icon is clicked.
   * @param  {Event} event
   * @return {Boolean}
   */
  function onClickDeleteList (event) {
    debug('onClickDeleteList: event', event)

    deleteList($(event.currentTarget).parent().text())
    return false

  }

  /**
   * Callback triggerd when the post container's subtree is modified.
   * It adjusts the position of the `tumbTag` element.
   */
  function onDOMSubtreeModified () {
    adjustPosition()
  }

  /**
   * Callback triggered when the pencil is clicked.
   * It shows/hide the editor.
   */
  function onClickPencil () {
    toggleEditor()
    adjustPosition()
  }

  /**
   * Callback triggered when the editor button is clicked.
   * It add/edit the list and set it to the storage.
   * @return {Boolean}
   */
  function onClickEditorButton () {
    let listName = getUniqueListName($editorListName.val())
    let tags = $editorListContent.val().replace(/\r\n/g, '\n').split('\n')
    tags = tags.filter(function (tag) { return !!tag })

    if (editingList) {
      editList(listName, tags)
      editingList = null
    }
    else {
      addList(listName, tags)
    }

    set()
    render()

    return false

  }

  ///////////////////////
  // DOM MANIPULATIONS //
  ///////////////////////

  /**
   * Appends the tags to the post.
   * @param  {Number} index
   */
  function appendTagsToPost (index) {
    debug('appendTagsToPost: index ', index)

    // Get the list
    var obj = store.tags[index]

    // Append the tags
    var $tagInput = $(POST_CONTAINER_TAGS_INPUT_SELECTOR)
    obj.list.forEach(function (tag) {
      $tagInput.append('<span>' + tag + '</span>')
      $tagInput.trigger(EVENT.FOCUS)
      $tagInput.trigger(EVENT.BLUR)
    })

    // HACK, validate the tags input
    setTimeout(function () {
      $(POST_CONTAINER_TAGS_INPUT_WRAPPER_SELECTOR).text('')
    }, 0)

  }

  /**
   * Adjusts the position of the `tumbTag` element.
   */
  function adjustPosition () {
    var $postContainer = $('.post-container')
    var postTop = $postContainer.offset().top
    var postLeft = $postContainer.offset().left
    var postHeight = $postContainer.height()
    var postWidth = $postContainer.width()
    var extraHeight = isEditorVisible() ? 250 : 0

    var finalTop = (postTop + postHeight + extraHeight)
    $root.css('top', finalTop.toString() + 'px')
    $root.css('left', (postLeft + postWidth + 200).toString() + 'px')

  }

  /**
   * Toggles the editor, creates it if necessary.
   */
  function toggleEditor () {
    // If the editor is visible, hide it
    if (isEditorVisible()) {
      hideEditor()
      return
    }

    // If the editor doesn't exist, create it
    if (!$editor) {
      renderEditor()
    }

    // If the editor is hidden, show it
    fillEditor()
    showEditor()

  }

  /**
   * Hides the editor.
   */
  function hideEditor () {
    $editor.hide('medium')
  }

  /**
   * Shows the editor.
   */
  function showEditor () {
    $editor.show('medium')
  }

  /**
   * Checks whether or not the editor is visible.
   * @return {Boolean}
   */
  function isEditorVisible () {
    return $editor && $editor.css('display') === 'block'
  }

  /////////////
  // GETTERS //
  /////////////

  /**
   * Gets an unique list name.
   * @param {String} listName
   */
  function getUniqueListName (listName) {
    debug('getUniqueListName: listName %o, editingList %o', listName, editingList)

    // The list is being edited, noop
    if (editingList) {
      return listName
    }

    var loop = 5

    existingName = findList(listName)

    while (existingName && loop) {
      listName = listName + '1'
      existingName = findList(listName)
      loop--
    }

    return listName
  }

  ///////////
  // UTILS //
  ///////////

  /**
   * Logs the `arguments` if the `isDebugging` flag is on.
   */
  function debug () {
    // If it's not in debug mode, noop
    if (!isDebugging) {
      return
    }

    // If it's debug mode, log it
    console.log.apply(null, arguments)
  }

  /**
   * Sorts the `store.tags` by alphabetical order.
   */
  function sort () {
    debug('sort: %o', store)

    store.tags = store.tags.sort(function (tagObj) {
      return tagObj.name.toLowerCase()
    })
  }

  /**
   * Finds the list with the given `name`.
   * @param  {String} name
   * @return {Object}
   */
  function findList (name) {
    debug('findList: %o', name)
    return store.tags.find(function (obj) {
      return obj.name === name
    })
  }

  ///////////
  // ENTRY //
  ///////////

  // Init
  init()
})
