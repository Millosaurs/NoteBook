'use strict';

import { Tooltip } from "./Tooltip.js";
import { getRelativeTime } from "../utils.js";
import { DeleteConfirmModal, NoteModal } from "./Modal.js";
import { db } from "../db.js";
import { client } from "../client.js";

/**
 * Creates a note card element.
 * @param {Object} noteData - The data for the note.
 * @param {string} noteData.id - The ID of the note.
 * @param {string} noteData.title - The title of the note.
 * @param {string} noteData.text - The text of the note.
 * @param {string} noteData.postedOn - The posted date of the note.
 * @param {string} noteData.notebookId - The notebook ID to which the note belongs.
 * @returns {HTMLElement} The note card element.
 */
export const Card = function(noteData) {
    const { id, title, text, postedOn, notebookId } = noteData;
    const $card = document.createElement('div');
    $card.classList.add('card');
    $card.setAttribute('data-note', id);

    $card.innerHTML = `
        <h3 class="card-title text-title-medium">${title}</h3>
        <p class="card-text text-body-large">${text}</p>
        <div class="wrapper">
            <span class="card-time text-label-large">${getRelativeTime(postedOn)}</span>
            <button class="icon-btn large" aria-label="Delete note" data-tooltip="Delete note" data-delete-btn>
                <span class="material-symbols-rounded" aria-hidden="true">delete</span>
                <div class="state-layer"></div>
            </button>
        </div>
        <div class="state-layer"></div>
    `;
    Tooltip($card.querySelector('[data-tooltip]'));

    const $deleteBtn = $card.querySelector('[data-delete-btn]');

    const openNoteModal = () => {
        const modal = NoteModal(title, text, getRelativeTime(postedOn));
        modal.open();

        modal.onSubmit((updatedNoteData) => {
            const updatedData = db.update.note(id, updatedNoteData);
            client.note.update(id, updatedData);
            modal.close();
        });
    };

    const openDeleteModal = () => {
        const modal = DeleteConfirmModal(title);
        modal.open();

        modal.onSubmit((isConfirm) => {
            if (isConfirm) {
                const existedNotes = db.delete.note(notebookId, id);
                client.note.read(existedNotes);
            }
            modal.close();
        });
    };

    $card.addEventListener('click', openNoteModal);
    $deleteBtn.addEventListener('click', (event) => {
        event.stopImmediatePropagation();
        openDeleteModal();
    });

    return $card;
};