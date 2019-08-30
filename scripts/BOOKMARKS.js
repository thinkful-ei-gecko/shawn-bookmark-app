'use strict';
/* global LOCAL, API, $ */

/* eslint-disable no-console */
// eslint-disable-next-line no-unused-vars

const BOOKMARKS = (function () {
  function generateAddBookmarkForm() {
    return `
    <form id='new-bookmark-form' class="add-bookmark">
    <fieldset>
        <h2>Add a bookmark</h2>
      <div class='add-bookmark-input-group'>
      <section class="add-bookmark-label">
        <label class="input-label" for='title'>Title:</label>
          <input type='text' name='title' id='title' required />
        </section>
        <section class="add-bookmark-label">
        <label class="input-label" for='url'>URL:</label>
          <input type='url' name='url' id='url' required />     
        </section>
        <section class="add-bookmark-label">
        <label class="input-label" for='desc'>Description:</label>
          <input type='text' name='desc' id='desc' />
        </section>
        <section class='add-bookmark-label'>
        <div class="bookmark-form-bottom-row">
          <label for='rating'>Rating: </label>
          <div class='starRating'>
            <input id='rating5' type='radio' name='rating' value='5'>
            <label for='rating5'>5</label>
            <input id='rating4' type='radio' name='rating' value='4'>
            <label for='rating4'>4</label>
            <input id='rating3' type='radio' name='rating' value='3'>
            <label for='rating3'>3</label>
            <input id='rating2' type='radio' name='rating' value='2'>
            <label for='rating2'>2</label>
            <input id='rating1' type='radio' name='rating' value='1'>
            <label for='rating1'>1</label>
          </div>
        </section>
        <button id="add-bookmark-save-button" class="btn"><i class="fa fa-save"></i> Save </button>
        <button id="add-bookmark-cancel-button" class="btn"><i class="fa fa-times"></i> Cancel </button>
      </div>
      </div>
    </fieldset>
  </form>
  `;
  }

  function generateCollapsedBookmark(bookmark) {
    const starIconString = '<i class="fa fa-star fa-"></i>';
    const starCount = (starIconString.repeat(bookmark.rating));
    return `
    <div class="bookmark-element collapsed-element" data-item-id="${bookmark.id}">
    <section class="bookmark-top-row">
      <a class="url-link bookmark-btn btn" href="${bookmark.url}" target="_blank"> <strong> ${bookmark.title} </strong>
      <section class="star-rating"> ${starCount} </section> <section></section> </a> 
      <button class="expand-collapse expand btn"><i class="fas fa-expand-arrows-alt"></i> Expand </button>
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
    <a class="url-link bookmark-btn btn" href="${bookmark.url}" target="_blank"> <strong> ${bookmark.title} </strong>
    <section class="star-rating"> ${starCount} </section> <section></section> </a> 
    <button class="expand-collapse collapse btn"><i class="fas fa-expand"></i> Collapse </button>
  </section>
    <section class="bookmark-bottom-row"> 
      <p id="description"> <strong>Description:</strong> ${bookmark.desc} </p>
      <button class="expand-collapse delete-bookmark-button expand-collapse btn"><i class="fa fa-trash"></i> Delete </button>
    </section>
  </div>
    `;
  }

  function render() {
    $('.bookmark-list').empty();
    $('#bookmark-form').empty();
    if (LOCAL.addingBookmark  || LOCAL.items.length === 0) {
      $('#bookmark-form').append(generateAddBookmarkForm());
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

  //working
  //Prepares parameter "form" for push up to server
  function serializeJson(form) {
    const formData = new FormData(form);
    const obj = {};
    formData.forEach((val, name) => obj[name] = val);
    return JSON.stringify(obj);
  }

  //working
  //when "Save" is clicked in the "Add a bookmark" form, the data stored
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
          API.getBookmarks();
          render();
        });
    });
  }

  //working
  function handleCancelBookmarkClicked() {
    $('#bookmark-form').on('click', '#add-bookmark-cancel-button', event => {
      console.log('handleCancelBookmarkClicked() ran...');
      LOCAL.addingBookmark = false;
      render();
    });
  }

  //working
  function handleNewBookmarkClicked() {
    $('#new-bookmark-window-button').click(function () {
      LOCAL.addingBookmark = true;
      console.log('handleNewBookmarkClicked() ran...');
      render();
    });
  }

  //Star filter button click
  //not fully working
  function handleFilterClicked() {
    $('#filter-stars-fieldset').on('click', event => {
      event.preventDefault();
      let formElement = document.querySelector('#filter-star-form');
      let serialized = serializeJson(formElement);
      console.log(`handleFilterClicked() ran... serialized = ${serialized}`);
      newFilterValue = Object.values(serialized);
      console.log(newFilterValue);
      LOCAL.filterValue = serialized[filter-rating];
      render();
    });
  }

  function handleFilterChange() {
  $('input[name=filter-rating]').change(function(){
    //$('#filter-star-form').submit();
    event.preventDefault();
    let formElement = document.querySelector('#filter-star-form');
    let serialized = serializeJson(formElement);
    let newFilterValue = JSON.parse(serialized);
    console.log(`handleFilterClicked() ran... LOCAL.filterValue = ${newFilterValue}`);
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
    // handleFilterClicked();
    handleFilterChange();
    handleCancelBookmarkClicked();
    handleNewBookmarkClicked();
    handleCollapsedClicked();
    handleExpandClicked();
    handleDeleteBookmarkClicked();
  }

  // This object contains the only exposed methods from this module:
  return {
    render: render,
    bindEventListeners: bindEventListeners,
  };
}());