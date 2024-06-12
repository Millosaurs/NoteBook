'use strict';

import { NavItem } from "./components/NavItem.js";
import { activeNotebook } from "./utils.js";
import { Card } from "./components/Card.js";

const $sidebarList = document.querySelector('[data-sidebar-list]');
const $notePanelTitle = document.querySelector('[data-note-panel-title]');
const $notePanel = document.querySelector('[data-note-panel]');
const $noteCreateBtns = document.querySelectorAll('[data-note-create-btn]');
const emptyNotesTamplete = `
<div class="empty-notes">
    <span class="material-symbols-rounded" aria-hidden="true">note_stack</span>
    <div class="text-headline-small">No notes</div>
</div>
`;

/**
 * @param {boolean} isThereAnyNotebooks
 */
const disableNoteCreateBtns = function (isThereAnyNotebooks) {
    $noteCreateBtns.forEach($item => {
        if (isThereAnyNotebooks) {
            $item.removeAttribute('disabled');
        } else {
            $item.setAttribute('disabled', '');
        }
    });
}

/**
 * @namespace React
 * @property {Object} notebook
 * @property {Object} note
 */
export const client = {
    notebook: {
        /**
         * @param {Object} notebookData
         */
        create(notebookData) {



            const $navItem = NavItem(notebookData.id, notebookData.name);
            $sidebarList.appendChild($navItem);
            activeNotebook.call($navItem);
            $notePanelTitle.textContent = notebookData.name;
            $notePanel.innerHTML = emptyNotesTamplete;
            disableNoteCreateBtns(true);
        },
        /**
         * @param {Object[]} notebookList
         */
        read(notebookList) {
            disableNoteCreateBtns(notebookList.length > 0);

            notebookList.forEach((notebookData, index) => {
                const $navItem = NavItem(notebookData.id, notebookData.name);
                if (index === 0) {
                    activeNotebook.call($navItem);
                    $notePanelTitle.textContent = notebookData.name;
                }

                $sidebarList.appendChild($navItem);
            });
        },
        update(notebookId, notebookData) {
            const $oldNotebook = document.querySelector(`[data-notebook="${notebookId}"]`);
            const $newNotebook = NavItem(notebookData.id, notebookData.name);

            $notePanelTitle.textContent = notebookData.name;
            $sidebarList.replaceChild($newNotebook, $oldNotebook);
            activeNotebook.call($newNotebook);
        },
        /**
         * @param {string} notebookId
         */
        delete(notebookId) {
            const $deletedNotebook = document.querySelector(`[data-notebook="${notebookId}"]`);
            const $activeNavItem = $deletedNotebook.nextElementSibling ?? $deletedNotebook.previousElementSibling;

            if ($activeNavItem) {
                $activeNavItem.click();
            } else {
                $notePanelTitle.innerHTML = '';
                $notePanel.innerHTML = '';
                disableNoteCreateBtns(false);
            }
            $deletedNotebook.remove();
            console.log(`deleted ${notebookId}`);
        }
    },

    note: {
        /**
         * @param {Object} noteData
         */
        create(noteData) {

            if(!$notePanel.querySelector('[data-note]')) $notePanel.innerHTML = '';

            const $card = Card(noteData);
            $notePanel.appendChild($card);
        },

        /**
         * @param {Object[]} noteList
         */
        read(noteList) {
            if (noteList.length) {
                $notePanel.innerHTML = '';

                noteList.forEach(noteData => {
                    const $card = Card(noteData);
                    $notePanel.appendChild($card);
                });
            } else {
                $notePanel.innerHTML = emptyNotesTamplete;
            }
        },

        /**
         * 
         * @param {string} noteId 
         * @param {Object} noteData 
         */
        update(noteId, noteData) {
            const $oldCard = document.querySelector(`[data-note="${noteId}"]`);
            const $newCard = Card(noteData);
            $notePanel.replaceChild($newCard, $oldCard);
        },
        /**
         * 
         * @param {string} noteId 
         * @param {boolean} isNoteExisits 
         */
        delete(noteId, isNoteExisits) {
            document.querySelector(`[data-note="${noteId}]`).remove();
            if (!isNoteExisits) $notePanel.innerHTML = emptyNotesTamplete;
            
        }
    }
}