'use strict';

/**
 * Adds an event listener to multiple elements.
 * @param {Array<HTMLElement>} $elements - An array of DOM elements to attach event listeners to.
 * @param {string} eventType - Type of event to listen for (e.g., 'click', 'mouseover').
 * @param {Function} callback - Callback function to execute when the event is triggered.
 */
const addEventOnElements = function ($elements, eventType, callback) {
  $elements.forEach($element => $element.addEventListener(eventType, callback));
}
/**
 * Generates a greeting message based on the current hour.
 * @param {Number} currentHour - Hour (0-23)
 * @returns {string} Greeting message
 */
const getGreetingMsg = function(currentHour) {
  let greeting;
  
  if (currentHour < 5) {
    greeting = 'Late night';
  } else if (currentHour < 12) {
    greeting = 'Morning';
  } else if (currentHour < 17) {
    greeting = 'Afternoon';
  } else if (currentHour < 21) {
    greeting = 'Evening';
  } else {
    greeting = 'Night';
  }
  
  return `Good ${greeting}`;
};

let $lastActiveNavItem;

const activeNotebook = function() {
  $lastActiveNavItem?.classList.remove('active');
  this.classList.add('active');
  $lastActiveNavItem = this;
}

const makeElemEditable = function($element) {
  $element.setAttribute('contenteditable', true);
  $element.focus();
  $element.addEventListener('blur', function() {
    $element.setAttribute('contenteditable', 'false');
  });

}
 /**
   * @return {string}
   */

const generateId = function () {
 return new Date().getTime().toString();

}

/**
 * 
 * @param {Object} db 
 * @param {string} notebookId 
 * @returns {Object | undefined }
 */
const findNotebook = function (db, notebookId) {
  return db.notebooks.find(notebook => notebook.id === notebookId)
}
  /**
 * Finds the index of a notebook in the database by its ID.
 *
 * @param {Object} db 
 * @param {string} notebookId 
 * @returns {number} 
 */
const findNotebookIndex = function (db, notebookId) {
  return db.notebooks.findIndex(item => item.id === notebookId);
}
/**
 * 
 * @param {number} milliseconds
 * @returns {string}  
 */
const getRelativeTime = function (milliseconds) {
  const currentTime = new Date().getTime();
  const secondsDiff = Math.floor((currentTime - milliseconds) / 1000);
  const minutesDiff = Math.floor(secondsDiff / 60);
  const hoursDiff = Math.floor(minutesDiff / 60);
  const daysDiff = Math.floor(hoursDiff / 24);

  if (secondsDiff < 60) {
    return 'Just now';
  } else if (minutesDiff < 60) {
    return `${minutesDiff} min ago`;
  } else if (hoursDiff < 24) {
    return `${hoursDiff} hour ago`;
  } else {
    return `${daysDiff} day ago`;
  }
}
/**
 * 
 * @param {Object} db 
 * @param {string} noteId 
 * @returns {Object | undefined} 
 */
const findNote = (db, noteId) => {

  let note;
  for (const notebook of db.notebooks) {
    note = notebook.notes.find(note => note.id === noteId);
    if(note) break;
  }
  return note;
}
/**
 * 
 * @param {Object} notebook 
 * @param {string} noteId 
 * @returns {number} 
 */
const findNoteIndex = function (notebook, noteId) {
  return notebook.notes.findIndex(note => note.id === noteId)
}

export {
  addEventOnElements,
  getGreetingMsg,
  activeNotebook,
  makeElemEditable,
  generateId,
  findNotebook,
  findNotebookIndex,
  getRelativeTime,
  findNote,
  findNoteIndex
}
