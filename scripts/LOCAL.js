'use strict';
/* global store, $ */

/* eslint-disable no-console */
/* eslint-disable no-undef */
/* eslint-disable strict */

const LOCAL = (function () {
  const items = [];
  const expandedID = 0;
  let addingBookmark = false;
  const filterStatus = false;
  const filterValue = 0;

  function findByID(id) {
    foundByID = this.items.find(item => item.id === id);
    console.log(`findByID ran:  returned ${foundByID}`);
    return foundByID;
  }


  function addBookmark(bookmark) {
    console.log('addBookmark() ran...');
    this.items = [];
    console.log('Dumping LOCAL.items');
    this.items.push(bookmark);
  }

  function assignExpandedID(id) {
    this.expandedID = id;
    console.log(`expandedID now set to ${expandedID}`);
  }

  // Keep both findAndToogleExpand and toggleExpand?
  function findAndToggleExpand(id) {
    let item = this.findByID(id);
    item.expand = !item.checked;
  }

  // Keep both findAndToogleExpand and toggleExpand?
  function toggleExpanded() {
    this.expand = !this.expand;
  }


  function findAndDelete(id) {
    let deleteBookmark = this.findByID(id);
    this.items = this.items.filter(item => item !== deleteBookmark);
  }

  function toggleFilterStatus() {
    this.filterStatus = !this.filterStatus;
  }

  function setFilterValue(newFilterValue) {
    this.filterValue = newFilterValue;
  }

  const globalObj = {
    items: items,
    addingBookmark: addingBookmark,
    expandedID: expandedID,
    filterStatus: filterStatus,
    filterValue: filterValue,
    findByID: findByID,
    addBookmark: addBookmark,
    assignExpandedID: assignExpandedID,
    findAndToggleExpand: findAndToggleExpand,
    toggleExpanded: toggleExpanded,
    // toggleAddingBookmark: toggleAddingBookmark,
    findAndDelete: findAndDelete,
    toggleFilterStatus: toggleFilterStatus,
    setFilterValue: setFilterValue,
  };

  return globalObj;
}());










// {
//   'id': 'cjzsyqcr2004w0kuqdi1u7jyi',
//   'title': 'Article on Cats',
//   'url': 'http://cats.com',
//   'desc': 'Cats are great. I love cats.',
//   'rating': 5,
//   'expand': false
// },
// {
//   'id': 'cjzsys7sr004y0kuqhxxqb5y1',
//   'title': 'Article on Dogs',
//   'url': 'http://dogs.com',
//   'desc': 'Dogs are great. I love dogs.',
//   'rating': 2,
//   'expand': false
// },
// {
//   'id': 'cjzszln5900550kuqp376qxie',
//   'title': 'Article on Birds',
//   'url': 'http://birds.com',
//   'desc': 'Birds are weird. I am apprehensive of birds.',
//   'rating': 1,
//   'expand': false
// },
// {
//   'id': 'cjzt6as6800gq0kuqtm2pqqcv',
//   'title': 'Laser Cat',
//   'url': 'https://www.weaponizedcat.com',
//   'desc': 'LASERS!',
//   'rating': 4,
//   'expand': false
// },
// {
//   'id': 'cjzt6essx00gt0kuqdgzihz1e',
//   'title': 'Hotdogs',
//   'url': 'http://www.hotdogsareweird.com',
//   'desc': 'Why hotdogs?',
//   'rating': 2,
//   'expand': false
// }