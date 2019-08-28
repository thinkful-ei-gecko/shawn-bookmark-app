'use strict';
/* global BOOKMARKS, $ */

/* eslint-disable no-console */
/* eslint-disable no-undef */
/* eslint-disable strict */

$(document).ready(function() {
  BOOKMARKS.bindEventListeners();
  BOOKMARKS.render();
});



//API return bookmarks
//LOCAL populates, adds new items
//BOOKMARKS should render
//BOOKMARKS BindEventListeners