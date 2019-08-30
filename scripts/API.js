/* eslint-disable no-console */
'use strict';
/* global LOCAL, BOOKMARKS, $ */
/* eslint-disable strict */

const API = (function () {

  const BASE_URL = 'https://thinkful-list-api.herokuapp.com/shawn/bookmarks/';

  const masterFetch = function (...args) {
    console.log('masterFetch() ran...');
    let error;
    return fetch(...args)
      .then(res => {
        if (!res.ok) {
          error = {
            code: res.status
          };

          if (!res.headers.get('content-type').includes('json')) {
            error.message = res.statusText;
            return Promise.reject(error);
          }
        }
        return res.json();
      })
      .then(data => {
        if (error) {
          error.message = data.message;
          return Promise.reject(error);
        }
        return data;
      });
  };

  const getBookmarks = function () {
    console.log('getBookmarks() ran...');
    let fetchObj = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    };
    return masterFetch(BASE_URL, fetchObj)
      .then((bookmarkGET) => {
        LOCAL.addBookmark(bookmarkGET);
      });
  };

  const postBookmark = function (newBookmark) {
    console.log('postBookmark() ran...');
    let fetchObj = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: newBookmark
    };
    return masterFetch(BASE_URL, fetchObj);
  };

  const deleteBookmark = function (id) {
    console.log(`deleteBookmark() ran... Attempting to deleted ID: ${id} from server.`);
    let fetchObj = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
    };
    return masterFetch(BASE_URL + `${id}`, fetchObj);
  };

  return {
    masterFetch,
    getBookmarks,
    postBookmark,
    deleteBookmark
  };
})();