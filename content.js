$(function () {
  // The app
  var $root
  var ROOT_SELECTOR = '#tumblrTag'
  var ROOT_ELEM = '<div id="tumblrTag"></div>'
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
  var ACTIONS_SELECTOR = '#tumblrTag-actions'
  var ACTIONS_ELEM = '<div id="tumblrTag-actions"></div>'
  var ACTIONS_ELEM_CSS = {
    'font-size': '1.5em',
    'cursor': 'pointer',
    'margin-bottom': '.5em'
  }

  // The icon to create the lists
  var $createList
  var CREATE_LIST_SELECTOR = '#tumblrTag-createListButton'
  var CREATE_LIST_BUTTON_ELEM = '<button id="tumblrTag-createListButton">Create</button>'
  var CREATE_LIST_BUTTON_CSS = {
    'border-radius': '2px',
    'background-color': '#00b8ff',
    'padding': '0.3em 0.6em',
    'font-size': '.8em',
    'font-weight': '600',
    'margin-bottom': '0.5em',
    'display': 'block'
  }

  // The editor container
  var $editor
  var EDITOR_ELEM = '<div id="tumblrTag-editor"></div>'
  var EDITOR_HEIGHT = 250
  var EDITOR_CSS = {
    'width': '200px',
    'height': EDITOR_HEIGHT + 'px',
    'background-color': '#fff',
    'box-sizing': 'border-box',
    'padding': '1em'
  }

  // The input to edit the list name
  var $editorListName
  var EDITOR_LIST_NAME_SELECTOR = '#tumblrTag-editListNameInput'
  var EDITOR_LIST_NAME_ELEM = '<input id="tumblrTag-editListNameInput"/>'
  var EDITOR_LIST_NAME_CSS = {
    'width': '100%',
    'margin-bottom': '1em'
  }

  // The textarea to edit the list content
  var $editorListContent
  var EDITOR_LIST_CONTENT_SELECTOR = '#tumblrTag-editListTagsTextArea'
  var EDITOR_LIST_CONTENT_ELEM = '<textarea id="tumblrTag-editListTagsTextArea"></textarea>'
  var EDITOR_LIST_CONTENT_CSS = {
    'width': '100%',
    'height': '100px'
  }

  // The button to create/edit the list
  var $doneButton
  var EDITOR_BUTTON_SELECTOR = '#tumblrTag-doneEditingListButton'
  var EDITOR_BUTTON_ELEM = '<button id="tumblrTag-doneEditingListButton">Done</button>'
  var EDITOR_BUTTON_CSS = {
    'border-radius': '2px',
    'padding': '0.3em 0.6em',
    'display': 'block',
    'font-weight': '600',
    'font-size': '.8em',
    'margin': '0 auto',
    'background-color': '#00b8ff'
  }

  // The lists
  var $lists
  var LISTS_SELECTOR = '#tumblrTag-lists'
  var LISTS_ELEM = '<ul id="tumblrTag-lists"></ul>'
  var LISTS_CSS = {
    'max-height': '250px',
    'overflow-y': 'scroll'
  }

  // A list
  var LIST_SELECTOR = '.tumblrTag-list'
  var LIST_CSS = {
    'cursor': 'pointer',
    'padding': '10px',
    'border-radius': '2px',
    'background-color': 'rgba(0, 0, 0, 0.07)',
    'margin-bottom': '1em'
  }

  // The icon to delete a list
  var DELETE_LIST_BUTTON_SELECTOR = '.tumblrTag-deleteListButton'
  var DELETE_LIST_BUTTON_ELEM = '<i class="tumblrTag-deleteListButton icon_close"></i>'
  var DELETE_LIST_BUTTON_CSS = {
    'float': 'right',
    'font-size': '1.3em',
    'padding': '0.1em',
    'border-radius': '2px',
    'background-color': 'rgba(51, 51, 51, 0.5)',
    'line-height': '1em'
  }

  // The icon to edit a list
  var EDIT_LIST_BUTTON_SELECTOR = '.tumblrTag-editListButton'
  var EDIT_LIST_BUTTON_ELEM = '<i class="tumblrTag-editListButton icon_edit_pencil"></i>'
  var EDIT_LIST_BUTTON_ELEM_CSS = {
    'float': 'right',
    'margin-right': '.4em',
    'font-size': '1.3em',
    'padding': '0.1em',
    'border-radius': '2px',
    'background-color': 'rgba(51, 51, 51, 0.5)',
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
    RESIZE: 'resize',
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
  }

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

    updatePosition()

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
    $actions.append(CREATE_LIST_BUTTON_ELEM)
    $createList = $(CREATE_LIST_SELECTOR)
    $createList.css(CREATE_LIST_BUTTON_CSS)
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
    var listsCount = store.tags.length
    store.tags.forEach(function (tagObj) {
      var elementStr
      if (listsCount > 1) {
        elementStr = '<li class="' + LIST_SELECTOR.slice(1) + '"><span style="display: inline-block; max-width: 70%; overflow: hidden; white-space: nowrap; text-overflow: ellipsis">' + tagObj.name + '</span>' + DELETE_LIST_BUTTON_ELEM + EDIT_LIST_BUTTON_ELEM + '</li>'
      } else {
        elementStr = '<li class="' + LIST_SELECTOR.slice(1) + '"><span style="display: inline-block; max-width: 70%; overflow: hidden; white-space: nowrap; text-overflow: ellipsis">' + tagObj.name + '</span>' + EDIT_LIST_BUTTON_ELEM + '</li>'
      }
      $lists.append(elementStr)
    })

    $lists.css(LISTS_CSS)
    $(LIST_SELECTOR).css(LIST_CSS)
    $(DELETE_LIST_BUTTON_SELECTOR).css(DELETE_LIST_BUTTON_CSS)
    $(EDIT_LIST_BUTTON_SELECTOR).css(EDIT_LIST_BUTTON_ELEM_CSS)
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
    $createList.after($editor)
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
    $doneButton = $(EDITOR_BUTTON_SELECTOR)
    $doneButton.css(EDITOR_BUTTON_CSS)
  }

  /**
   * Renders the editor.
   */
  function updateEditorData () {
    debug('updateEditorData')

    if (!isEditorVisible()) {
      $editor.show()
    }

    // Get the list data
    var name
    var list
    if (editingList) {
      name = editingList
      list = findList(editingList).list
    } else {
      name = 'Blogging'
      list = [
        'tag1',
        'tag2',
        'tag3'
      ]
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
    $createList.remove()
    $actions.remove()
    $editor.remove()
    $editorListName.remove()
    $editorListContent.remove()
    $doneButton.remove()
    $root.remove()

    $createList = null
    $actions = null
    $editor = null
    $editorListName = null
    $editorListContent = null
    $doneButton = null
    $root = null
  }

  /**
   * Periodically check if `tumblrTag` should be rendered.
   */
  function shouldRender () {
    setTimeout(function () {
      debug('check')
      if ($(POST_CONTAINER_TAGS_SELECTOR).length) {
        if (!$root) {
          debug('render')
          render()
        }
      } else if ($root) {
        debug('unmount')
        unmount()
      }
      shouldRender()
    }, 2000)
  }

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

  /**
   * Binds events on the element created.
   */
  function bind () {
    debug('bind')

    // Tumblr
    $(POST_CONTAINER_SELECTOR).on(EVENT.DOM_SUBTREE_MODIFIED, handleDOMSubtreeModified)
    window.addEventListener(EVENT.RESIZE, handleWindowResize)

    // Add list
    $(CREATE_LIST_SELECTOR).on(EVENT.CLICK, handleClickCreateList)

    // List
    $(LIST_SELECTOR).on(EVENT.CLICK, handleClickList)

    // List item actions
    $(DELETE_LIST_BUTTON_SELECTOR).on(EVENT.CLICK, handleClickDeleteList)
    $(EDIT_LIST_BUTTON_SELECTOR).on(EVENT.CLICK, handleClickEditList)

    // Editor
    $doneButton.on(EVENT.CLICK, handleClickDone)
  }

  /**
   * Unbinds evens on the element created.
   */
  function unbind () {
    debug('unbind')

    // Tumblr
    $(POST_CONTAINER_SELECTOR).off(EVENT.DOM_SUBTREE_MODIFIED, handleDOMSubtreeModified)
    window.removeEventListener(EVENT.RESIZE, handleWindowResize)

    // Add/edit list
    $(CREATE_LIST_SELECTOR).off(EVENT.CLICK, handleClickCreateList)

    // List
    $(LIST_SELECTOR).off(EVENT.CLICK, handleClickList)
    $(DELETE_LIST_BUTTON_SELECTOR).off(EVENT.CLICK, handleClickDeleteList)

    // Editor
    if ($doneButton) {
      $doneButton.off(EVENT.CLICK, handleClickDone)
    }
  }

  /**
   * Callback triggered when a list is clicked.
   * @param  {Event} event
   * @return {Boolean}
   */
  function handleClickList (event) {
    debug('handleClickList: event ', event)

    let index = $(event.currentTarget).index()
    if (isEditorVisible()) {
      // If the add list selector is open, edit the list
      getListAndRender(index)
    } else {
      //  If the add list selector is closed, append the tags
      appendTagsToPost(index)
    }

    return false
  }

  /**
   * Sets the `editingList` and renders the editor.
   * @param  {Number} index
   */
  function getListAndRender (index) {
    debug('getListAndRender: index', index)

    // Get the list being edited
    var list = store.tags[index]
    editingList = list.name

    // Render the list
    updateEditorData()
  }

  /**
   * Delete the list.
   * @param  {String} name
   */
  function deleteList (name) {
    debug('deleteList: name ', name)

    // Delete the list that match the given name
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
  function handleClickDeleteList (event) {
    debug('handleClickDeleteList: event', event)
    event.preventDefault()
    deleteList($(event.currentTarget).parent().text())
    return false

  }

  /**
   * Callback triggered when the edit list icon is clicked.
   * @param  {Event} event
   * @return {Boolean}
   */
  function handleClickEditList (event) {
    debug('handleClickEditList: event', event)
    var currentTarget = event.currentTarget.parentElement
    var ulElement = event.currentTarget.parentElement.parentElement.children
    var listIndex = Array.prototype.indexOf.call(ulElement, currentTarget)
    if (listIndex === -1) {
      listIndex = 0
    }
    getListAndRender(listIndex)
    event.preventDefault()
    return false
  }

  /**
   * Callback triggered when the post container's subtree is modified.
   * It adjusts the position of the `tumblrTag` element.
   */
  function handleDOMSubtreeModified () {
    updatePosition()
  }

  function handleWindowResize () {
    updatePosition()
  }

  /**
   * Callback triggered when the pencil is clicked.
   * It shows/hide the editor.
   */
  function handleClickCreateList () {
    toggleEditor()
  }

  /**
   * Callback triggered when the editor button is clicked.
   * It add/edit the list and set it to the storage.
   * @return {Boolean}
   */
  function handleClickDone () {
    let listName = getUniqueListName($editorListName.val())
    let tags = $editorListContent.val().replace(/\r\n/g, '\n').split('\n')
    tags = tags.filter(function (tag) { return !!tag })

    if (editingList) {
      editList(listName, tags)
      editingList = null
    } else {
      addList(listName, tags)
    }

    set()
    render()

    return false

  }

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
   * Adjusts the position of the `tumblrTag` element.
   */
  function updatePosition () {
    debug('updatePosition')
    var $postContainer = $('.post-container')
    var postLeft = $postContainer.offset().left
    // var postHeight = $postContainer.height()
    var postWidth = $postContainer.width()

    var finalTop = (window.innerHeight / 1.8)
    if (isEditorVisible()) {
      finalTop += EDITOR_HEIGHT
    }
    $root.css('top', finalTop.toString() + 'px')
    $root.css('left', (postLeft + postWidth + 200).toString() + 'px')
  }

  /**
   * Toggles the editor, creates it if necessary.
   */
  function toggleEditor () {
    // If the editor is visible, hide it
    if (isEditorVisible()) {
      hideEditor(updatePosition)
      return
    }

    // If the editor doesn't exist, create it
    if (!$editor) {
      renderEditor()
    }

    // If the editor is hidden, show it
    updateEditorData()
    showEditor(updatePosition)
  }

  /**
   * Hides the editor.
   */
  function hideEditor (callback) {
    $editor.hide('medium', callback)
  }

  /**
   * Shows the editor.
   */
  function showEditor (callback) {
    $editor.show('medium', callback)
  }

  /**
   * Checks whether or not the editor is visible.
   * @return {Boolean}
   */
  function isEditorVisible () {
    debug('isEditorVisible: ', $editor.css('display'))
    return $editor && $editor.css('display') === 'block'
  }

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

  /**
   * Logs the `arguments` if the `isDebugging` flag is on.
   */
  var log = console.log.bind(null, '[tumblrTag]')

  function debug () {
    // If it's not in debug mode, noop
    if (!isDebugging) {
      return
    }

    // If it's debug mode, log it
    log.apply(null, arguments)
  }

  /**
   * Sorts the `store.tags` by alphabetical order.
   */
  function sort () {
    debug('sort: %o', store)

    store.tags = store.tags.sort(function (obj1, obj2) {
      return obj1.name.toLowerCase().localeCompare(obj2.name.toLowerCase())
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

  // Init
  try {
    init()
  } catch (error) {
    debug('[error]: ', error)
  }
})
