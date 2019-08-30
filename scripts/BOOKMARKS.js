'use strict';
/* global LOCAL, API, $ */

/* eslint-disable no-console */
// eslint-disable-next-line no-unused-vars

const BOOKMARKS = (function () {
  function generateAddBookmarkForm() {
    return `
    <form id="new-bookmark-form" class="add-bookmark">
    <fieldset>
      <h2>Add a bookmark</h2>
      <section class="bookmark-input-top-row">
        <div id="input-label-force-row">
          <label class="input-label" for="title"></label>
          <h4>Title: </h4>
          <input type="text" name="title" id="title" required>
        </div>
        <div id="input-label-force-row">
          <label class="input-label" for="url"></label>
          <h4>URL: </h4>
          <input type="url" name="url" id="url" required>
        </div>
      </section>
      <section class="bookmark-input-bottom-row">
        <div id="input-label-force-row">
          <label class="input-label" for="desc"></label>
          <h4>Notes: </h4>
          <input type="text" name="desc" id="desc" required>
        </div>
        <div id="input-label-force-row">
          <h4>Rating: </h4>
          <label class="input-label" for="rating"></label>
          <span id="filter-star-rating" class="starRating">
            <input id="star-rating-5" type="radio" name="rating" value="5" >
            <label for="star-rating-5">5</label>
            <input id="star-rating-4" type="radio" name="rating" value="4" >
            <label for="star-rating-4">4</label>
            <input id="star-rating-3" type="radio" name="rating" value="3" >
            <label for="star-rating-3">3</label>
            <input id="star-rating-2" type="radio" name="rating" value="2" >
            <label for="star-rating-2">2</label>
            <input id="star-rating-1" type="radio" name="rating" value="1" checked>
            <label for="star-rating-1">1</label>
          </span>
        </div>
      </section>
      <section class="save-cancel-buttons-row">
        <button id="add-bookmark-save-button" class="btn"><i class="fa fa-save"></i> Save </button>
      </section>
    </fieldset>
  </form>
  `;
  }

  function generateAddBookmarkFormCancelButton() {
    return `
    <button id="add-bookmark-cancel-button" class="btn"><i class="fa fa-times"></i> Cancel </button>
    `;
  }


  function generateCollapsedBookmark(bookmark) {
    const starIconString = '<i class="fa fa-star fa-"></i>';
    const starCount = (starIconString.repeat(bookmark.rating));
    return `
    <div class="bookmark-element collapsed-element" data-item-id="${bookmark.id}">
    <section class="bookmark-top-row">
    <a class="url-link change-on-hover bookmark-btn" href="${bookmark.url}" target="_blank"> <strong> ${bookmark.title} </strong> </a> 
    <a class="star-rating change-on-hover" href="${bookmark.url}" target="_blank"> ${starCount} </a> 
      <button class="expand-collapse expand btn"><i class="fas fa-expand"></i> Expand </button>
    </section>
  </div>
    `;
  }

  function generateExpandedBookmark(bookmark) {
    const starIconString = '<i class="fa fa-star"></i>';
    const starCount = (starIconString.repeat(bookmark.rating));
    return `
    <div class="bookmark-element expanded-element" data-item-id="${bookmark.id}">
    <section class="bookmark-top-row">
    <a class="url-link bookmark-btn change-on-hover" href="${bookmark.url}" target="_blank"> <strong> ${bookmark.title} </strong> </a> 
    <a class="star-rating change-on-hover" href="${bookmark.url}" target="_blank"> ${starCount} </a> 
    <button class="expand-collapse collapse btn"><i class="fas fa-compress"></i> Collapse </button>
  </section>
    <section class="bookmark-bottom-row"> 
      <p id="description"> <strong>Notes:</strong> ${bookmark.desc} </p>
      <button class="expand-collapse delete-bookmark-button btn"><i class="far fa-trash-alt"></i> Delete </button>
    </section>
  </div>
    `;
  }

  function render() {
    $('.bookmark-list').empty();
    $('#bookmark-form').empty();
    if (LOCAL.addingBookmark || LOCAL.items.length === 0) {
      console.log('generateAddBookmarkForm() ran...')
      $('#bookmark-form').append(generateAddBookmarkForm());
    }
    if(LOCAL.items.length !== 0) {
      console.log('generateAddBookmarkFormCancelButton() ran...')
      $('.save-cancel-buttons-row').append(generateAddBookmarkFormCancelButton());
    }

    let bookmarkItems = [...LOCAL.items];
    bookmarkItems = bookmarkItems.filter(bookmark => bookmark.rating >= LOCAL.filterValue);
    bookmarkItems.forEach((element) => {
      const longBookmarkHTML = generateExpandedBookmark(element);
      const shortBookmarkHTML = generateCollapsedBookmark(element);
      if (LOCAL.expandedID === element.id) {
        $('.bookmark-list').append(longBookmarkHTML);
      } else {
        $('.bookmark-list').append(shortBookmarkHTML);
      }
    });
    console.log('render() ran...');
  }

  function serializeJson(form) {
    const formData = new FormData(form);
    const obj = {};
    formData.forEach((val, name) => obj[name] = val);
    return JSON.stringify(obj);
  }

  function pullBookmarks() {
    console.log('pullBookmarks() ran...');
    API.getBookmarks()
      .then(() => render());
  }

  function saveNewBookmarkForm() {
    $('#bookmark-form').on('click', '#add-bookmark-save-button', event => {
      event.preventDefault();
      console.log('saveNewBookmarkForm() ran...');
      LOCAL.addingBookmark = false;
      let formElement = document.querySelector('#new-bookmark-form');
      let serialized = serializeJson(formElement);
      console.log(serialized);
      API.postBookmark(serialized)
        .then(() => {
          pullBookmarks();
        });
    });
  }

  function handleCancelBookmarkClicked() {
    $('#bookmark-form').on('click', '#add-bookmark-cancel-button', event => {
      console.log('handleCancelBookmarkClicked() ran...');
      LOCAL.addingBookmark = false;
      render();
    });
  }

  function handleNewBookmarkClicked() {
    $('#new-bookmark-window-button').click(function () {
      LOCAL.addingBookmark = true;
      console.log('handleNewBookmarkClicked() ran...');
      render();
    });
  }

  function handleFilterChange() {
  $('input[name="filter-rating"]').change(function(){
    event.preventDefault();
    let formElement = document.querySelector('#filter-star-form');
    let serialized = serializeJson(formElement);
    let newFilterValue = JSON.parse(serialized);
    console.log(`handleFilterChange() ran...`);
    LOCAL.setFilterValue(newFilterValue['filter-rating']);
    render();
    });
  }

  function getBookmarkIdFromElement(target) {
    return $(target)
      .closest('.bookmark-element')
      .data('item-id');
  }

  function handleDeleteBookmarkClicked() {
    $('.bookmark-list').on('click', '.delete-bookmark-button', function (event) {
      console.log('handleDeleteBookmarkClicked() ran...');
      const id = getBookmarkIdFromElement(event.currentTarget);
      console.log(id);
      API.deleteBookmark(id)
        .then(() => {
          API.getBookmarks()
            .then(() => BOOKMARKS.render());
          render();
        });
    });
  }

  function handleExpandClicked() {
    $('.bookmark-list').on('click', '.expand', event => {
      const id = getBookmarkIdFromElement(event.target);
      console.log(`handleCollapsedClicked() ran... ID = ${id}`);
      $('.bookmarks-section').empty();
      LOCAL.assignExpandedID(id)
      render();
    });
  }

  function handleCollapsedClicked() {
    $('.bookmark-list').on('click', '.collapse', event => {
      const id = getBookmarkIdFromElement(event.target);
      console.log(`handleCollapsedClicked() ran...ID = ${id}`);
      $('.bookmarks-section').empty();
      LOCAL.assignExpandedID(0);
      render();
    });
  }

  function bindEventListeners() {
    saveNewBookmarkForm();
    pullBookmarks();
    handleFilterChange();
    handleCancelBookmarkClicked();
    handleNewBookmarkClicked();
    handleCollapsedClicked();
    handleExpandClicked();
    handleDeleteBookmarkClicked();
  }

  return {
    render: render,
    bindEventListeners: bindEventListeners,
  };
}());