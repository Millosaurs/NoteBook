'use strict';
import { 
  addEventOnElements,
   getGreetingMsg, 
   activeNotebook,
   makeElemEditable} from "./utils.js"; 

import { Tooltip } from "./components/Tooltip.js";
import { db } from "./db.js";
import { client } from "./client.js";
import { NoteModal } from "./components/Modal.js";

const $sidebar = document.querySelector('[data-sidebar]');
const $sidebarTogglers = document.querySelectorAll('[data-sidebar-toggler]');
const $overlay = document.querySelector('[data-sidebar-overlay]');

addEventOnElements($sidebarTogglers, 'click', function () {
  $sidebar.classList.toggle('active');
  $overlay.classList.toggle('active');
});

const $tooltipElements = document.querySelectorAll('[data-tooltip]');
$tooltipElements.forEach($element => Tooltip($element));



/*Greetings mf */
const $greeElem = document.querySelector('[data-greeting]');
const currentHour = new Date().getHours();
$greeElem.textContent = getGreetingMsg(currentHour);

/*date mf */

const $dateElem = document.querySelector('[data-current-date]');
const dateString = new Date().toDateString().replace(/(\w{3})\s/, '$1, ');
$dateElem.textContent = dateString;


/*notebook mf */
const $sidebarList = document.querySelector('[data-sidebar-list]');
const $addnotebookBtn = document.querySelector('[data-add-notebook]');

const showNotebookField = function(){
  const $navItem = document.createElement('div');
  $navItem.classList.add('nav-item');
  $navItem.innerHTML = `
  <span class="text text-lable-large" data-notebook-field></span>

  <div class="state-layer"></div>
  `;
  $sidebarList.appendChild($navItem);

  const $navItemField = $navItem.querySelector('[data-notebook-field]');
  activeNotebook.call($navItem);
  makeElemEditable($navItemField);
  $navItemField.addEventListener('keydown',createNotebook);
}

$addnotebookBtn.addEventListener('click', showNotebookField);

/**
 * 
 * @param {KeyboardEvent} event 
 */
const createNotebook = function (event) {
  if (event.key === 'Enter') {
    const notebookData= db.post.notebooks(this.textContent || 'Untitled')
    this.parentElement.remove();
    
    client.notebook.create(notebookData);
  }
}

const renderExistedNotebook = function () {
  const notebookList = db.get.notebook();
  client.notebook.read(notebookList);
}

renderExistedNotebook();


/** NEW NOTE BABY */
const $noteCreateBtns = document.querySelectorAll('[data-note-create-btn]');
addEventOnElements($noteCreateBtns, 'click', function () {
  const modal = NoteModal();
  modal.open();

  modal.onSubmit(noteObj => {
    const activeNotebookId = document.querySelector('[data-notebook].active').dataset.notebook;
    
    const noteData = db.post.note(activeNotebookId, noteObj);
    client.note.create(noteData);
    modal.close();
    

  })

});

/**Render note */

const renderExistedNote = function () {
  const activeNotebookId = document.querySelector('[data-notebook].active').dataset.notebook;

  if (activeNotebookId) {
    const noteList = db.get.note(activeNotebookId);
    client.note.read(noteList);

  }
}

renderExistedNote();