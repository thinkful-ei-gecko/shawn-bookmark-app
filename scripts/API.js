/* eslint-disable no-console */
'use strict';
/* global LOCAL, BOOKMARKS $ */
/* eslint-disable strict */




const API = (function () {

  const BASE_URL = 'https://thinkful-list-api.herokuapp.com/shawn/bookmarks/';
  const masterFetch = function (...args) {
    let error;
    return fetch(...args)
      .then(res => {
        if (!res.ok) {
          error = { code: res.status };

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
    console.log('getItems() ran...');
    let fetchObj = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    };
    return masterFetch(BASE_URL, fetchObj)
      .then((bookmarkGET) => {
        LOCAL.addBookmark(bookmarkGET);
        //BOOKMARKS.render();
      });

  };

  const createBookmark = function (newBookmark) {
    console.log('createBookmark ran...');
    let fetchObj = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: newBookmark
    };
    return masterFetch(BASE_URL, fetchObj);
  };

  const deleteBookmark = function (id) {
    console.log('deleteBookmark() ran...');
    console.log(`deleteing ${id} from Thinkful server.`);
    let fetchObj = {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    };
    return masterFetch(BASE_URL + `${id}`, fetchObj);
  };

  return {
    getBookmarks,
    createBookmark,
    deleteBookmark
  };
})();





// const API = (function () {
//   const BASE_URL = 'https://thinkful-list-api.herokuapp.com/shawn/bookmarks/';

//   const getBookmarks = function () {
//     LOCAL.dumpItems();
//     let fetchObj = {
//       method: 'GET',
//       headers: { 'Content-Type': 'application/json' },
//     };
//     return fetch(BASE_URL, fetchObj);
//   };

//   const createBookmark = function (newBookmark) {
//     let fetchObj = {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: newBookmark
//     };
//     return fetch(BASE_URL, fetchObj);
//   };

//   const updateBookmark = function (id, updateData) {
//     const newData = JSON.stringify(updateData);   // <= here, the `updateData` is an Object argument, sent by the listeners
//     return fetch(BASE_URL + id, {
//       method: 'PATCH',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: newData
//     });
//   };

//   const deleteBookmark = function (id) {
//     console.log(`Deleteing ${id} from Thinkful server`);
//     return fetch(BASE_URL + id, {
//       method: 'DELETE',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });
//   };
//   return {
//     getBookmarks,
//     createBookmark,
//     updateBookmark,
//     deleteBookmark,
//   };
// })();
