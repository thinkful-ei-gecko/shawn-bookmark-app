'use strict';
/* global LOCAL, API, $ */

/* eslint-disable no-console */
// eslint-disable-next-line no-unused-vars

const BOOKMARKS = (function(){
  function generateBookmarkElement(bookmark) {
    const starIconString = '<i class="fa fa-star"></i>';
    const starCount = (starIconString.repeat(bookmark.rating));
    return `
    <div class="bookmark-item">
    <section class="url-expand-collapse-group">
    <a class="url-link bookmark-btn" href="${bookmark.url}" target="_blank"> ${bookmark.title} ${starCount} </a>
    <button bookmark-id="${bookmark.id}" class="id-locator expand hide-when-expanded bookmark-btn"><i class="fa fa-plus"></i> Expand </button>
    <button bookmark-id="${bookmark.id}" class="id-locator collapse hide-when-collapsed bookmark-btn"><i class="fa fa-minus"></i> Collapse </button>
    </section>
    <section class="bookmark-hide-on-collapse">
    <section class="description-block">Description: ${bookmark.desc}</section>
    <button bookmark-id="${bookmark.id}" class="id-locator delete-bookmark-button btn"><i class="fa fa-trash"></i> Delete </button>
    </section>
  </div>
  </section>
    `;
  }


  function generateAddBookmarkForm() {
    return `
    <form id='new-bookmark-form' class="add-bookmark">
    <fieldset>
      <legend>
        <h2>Add a bookmark</h2>
      </legend>
      <div class='add-bookmark-top-row'>
        <label for='title'>
          <h3>Title:</h3>
          <input type='text' name='title' id='title' required />
        </label>
        <label for='url'>
          <h3>URL:</h3>
          <input type='url' name='url' id='url' required />
        </label>
        <section id='star-rating-section'>
          <h3>Rating:</h3>
          <span class='starRating'>
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
          </span>
        </section>
      </div>
      <div class='add-bookmark-bottom-row'>
        <label for='desc'>
          <h3>Description:</h3>
          <input type='text' name='desc' id='desc' />
        </label>
      </div>
      <div class='save-cancel-row'>
        <button id="add-bookmark-save-button" class="btn"><i class="fa fa-save"></i> Save </button>
        <button id="add-bookmark-cancel-button" class="btn"><i class="fa fa-times"></i> Cancel </button>
      </div>
    </fieldset>
  </form>
    `;
  }


  function render() {
    $('main').empty();
    $('#bookmark-form').empty();
    if(LOCAL.addingBookmark){
      $('#bookmark-form').append(generateAddBookmarkForm());
    }
    API.getBookmarks();
    let localBookmark = [...LOCAL.items];
    localBookmark.forEach((element) => {
      const bookmarkHTML = generateBookmarkElement(element);
      $('main').append(bookmarkHTML);
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
      console.log('saveNewBookmarkForm clicked');
      let formElement = document.querySelector('#new-bookmark-form');
      let serialized = serializeJson(formElement);
      console.log(serialized);
      API.createBookmark(serialized)
        .then(() => {
          render();
        });
    });
  }

  //working
  function handleCancelBookmarkClicked() {
    $('#bookmark-form').on('click', '#add-bookmark-cancel-button', event => {
      console.log('clicked');
      LOCAL.addingBookmark = false;
      render();
    });
  }

  //working
  function handleNewBookmarkClicked() {
    $('#new-bookmark-window-button').click(function(){
      LOCAL.addingBookmark = true;
      console.log('handleNewBookmarkClicked ran');
      render();
    });
  }

  //Star filter button click
  //not fully working
  function handleFilterClicked() {
    $('#filter-stars-fieldset').on('click', event =>{
      event.preventDefault();
      let newFilterRating = $('#filter-stars-fieldset').val();
      console.log(newFilterRating);
      LOCAL.filterValue = newFilterRating;
      LOCAL.filterStatus = true;
      render();
      console.log('handleFilterClicked ran');
    });
  }

  
  function getBookmarkIdFromElement(target) {
    return $(target)
      .closest('.id-locator')
      .data('bookmark-id');
  }
  

  function handleDeleteBookmarkClicked() {
    $('main').on('click', '.delete-bookmark-button', event => {
      console.log('handleDeleteBookmarkClicked() ran...');
      console.log(getBookmarkIdFromElement(event.target));
      const id = getBookmarkIdFromElement(event.target); //TEST IF THIS LINE WORKS
      // const id = event.currentTarget.attributes[1].nodeValue;  //WORKS, BUT IT'S PROBABLY EASILY BROKEN
      $('.bookmarks-section').empty();
      API.deleteBookmark(id)    // <= we send the needed property
        .then(() => {
          render();
        });
    });
  }


  function handleCollapsedClicked() {
    $('main').on('click', '.hide-when-collapsed', event => {
      console.log('handleCollapsedClicked() ran...');
      const id = getBookmarkIdFromElement(event.target);
      console.log(id);
      $('.bookmarks-section').empty();
      API.deleteBookmark(id)    // <= we send the needed property
        .then(() => {
          render();
        });
    });
  }

  
  function bindEventListeners() {
    saveNewBookmarkForm();
    handleFilterClicked();
    handleCancelBookmarkClicked();
    handleNewBookmarkClicked(); 
    handleCollapsedClicked();
    handleDeleteBookmarkClicked();
  }

  // This object contains the only exposed methods from this module:
  return {
    render: render,
    bindEventListeners: bindEventListeners,
  };
}());