'use strict';
/* global store, $ */

/* eslint-disable no-console */
/* eslint-disable no-undef */
/* eslint-disable strict */

const LOCAL = (function () {
  let items = [];
  let expandedID;
  let addingBookmark = false;
  let filterValue = 0;

  function findByID(id) {
    foundByID = this.items.find(item => item.id === id);
    console.log(`findByID ran:  returned ${foundByID}`);
    return foundByID;
  }

  function addBookmark(bookmarkArray) {
    this.items = [];
    console.log(`addBookmark() complete... LOCAL.items = ${LOCAL.items}`);
    bookmarkArray.forEach(function(element){
      LOCAL.items.push(element)
      console.log(`Pushing ${element} to LOCAL.items`)
    });
    console.log(`addBookmark() complete... LOCAL.items = ${LOCAL.items}`);
  }

  function assignExpandedID (id) {
    this.expandedID = id;
    console.log(`expandedID now set to ${expandedID}`);
  }

  function findAndDelete(id) {
    let deleteBookmark = this.findByID(id);
    this.items = this.items.filter(item => item !== deleteBookmark);
  }

  function setFilterValue(newFilterValue) {
    this.filterValue = newFilterValue;
  }

  const globalObj = {
    items: items,
    addingBookmark: addingBookmark,
    expandedID: expandedID,
    filterValue: filterValue,
    findByID: findByID,
    addBookmark: addBookmark,
    assignExpandedID: assignExpandedID,
    findAndDelete: findAndDelete,
    setFilterValue, setFilterValue,
  };

  return globalObj;
}());










