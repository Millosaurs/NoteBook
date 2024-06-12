'use strict';

const $overlay = document.createElement('div');
$overlay.classList.add('overlay', 'modal-overlay');

/**
 * Create a Note Modal.
 * 
 * @param {string} [title='Untitled'] - The title of the note.
 * @param {string} [text='Add a note...'] - The text content of the note.
 * @param {string} [time=''] - The time associated with the note.
 * @returns {Object} - Object containing open, close, and clearText methods.
 */
const NoteModal = function (title = 'Untitled', text = 'Add a note...', time = '') {
    const $modal = document.createElement('div');
    $modal.classList.add('modal');

    $modal.innerHTML = `
        <button class="icon-btn large" aria-label="Close modal" data-close-btn>
            <span class="material-symbols-rounded" aria-hidden="true">close</span>
            <div class="state-layer"></div>
        </button>

        <input type="text" placeholder="${title ? '' : 'Untitled'}" value="${title}" class="modal-title text-title-medium" data-note-field>
        <textarea placeholder="${text ? '' : 'Take a note...'}" class="modal-text text-body-large custom-scrollbar" data-note-field>${text}</textarea>

        <div class="modal-footer">
            <span class="time text-lable-large">${time}</span>
            <button class="btn text" data-submit-btn>
                <span class="text-label-large">Save</span>
                <div class="state-layer"></div>
            </button>
        </div>
    `;

    const $submitBtn = $modal.querySelector('[data-submit-btn]');
    $submitBtn.disabled = true;
    const [$titleField, $textField] = $modal.querySelectorAll('[data-note-field]');

    const enableSubmit = function () {
        $submitBtn.disabled = !$titleField.value && !$textField.value;
    };

    $titleField.addEventListener('keyup', enableSubmit);
    $textField.addEventListener('keyup', enableSubmit);


    // Restore placeholder on blur if the field is empty
    $titleField.addEventListener('blur', function () {
        if (this.value === '') {
            this.value = title;
        }
    });

    $textField.addEventListener('blur', function () {
        if (this.value === '') {
            this.value = text;
        }
    });

    const open = function () {
        document.body.appendChild($modal);
        document.body.appendChild($overlay);
        $textField.focus();
    };

    const close = function () {
        document.body.removeChild($modal);
        document.body.removeChild($overlay);
    };

    const clearText = function () {
        $textField.value = '';
        $textField.focus();
    };

    const $closeBtn = $modal.querySelector('[data-close-btn]');
    $closeBtn.addEventListener('click', close);

    const onSubmit = function (callback) { 
        $submitBtn.addEventListener('click', function () {
            const noteData = {
                title: $titleField.value,
                text: $textField.value
            }

            callback(noteData);
            
        });
    }

    return { open, close, clearText, onSubmit};
};


/**
 * Create a Delete Confirmation Modal.
 * 
 * @param {string} title - The title of the item to be deleted.
 * @returns {Object} - Object containing open, close, and onSubmit methods.
 */
const DeleteConfirmModal = function (title) {
    const $modal = document.createElement('div');
    $modal.classList.add('modal');

    $modal.innerHTML = `
        <h3 class="modal-title text-title-medium">Are you sure you want to delete 
            <strong>"${title}"</strong>?
        </h3>
        <div class="modal-footer">
            <button class="btn text" data-action-btn="false">
                <span class="text-label-large">Cancel</span>
                <div class="state-layer"></div>
            </button>
            <button class="btn fill" data-action-btn="true">
                <span class="text-label-large">Delete</span>
                <div class="state-layer"></div>
            </button>
        </div>
    `;

    const open = function () {
        document.body.appendChild($modal);
        document.body.appendChild($overlay);
        $overlay.classList.add('active');
    };

    const close = function () {
        if (document.body.contains($modal)) {
            document.body.removeChild($modal);
        }
        if (document.body.contains($overlay)) {
            document.body.removeChild($overlay);
        }
        $overlay.classList.remove('active');
    };

    const $actionBtns = $modal.querySelectorAll('[data-action-btn]');

    /**
     * Attaches event listeners to action buttons and invokes the callback with the result.
     * 
     * @param {Function} callback - The callback function to call with the action result.
     */
    const onSubmit = function (callback) {
        $actionBtns.forEach($btn => {
            $btn.addEventListener('click', function () {
                const isConfirm = this.dataset.actionBtn === 'true';
                callback(isConfirm);
                close(); // Automatically close the modal after an action
            });
        });
    };

    return { open, close, onSubmit };
};

export { NoteModal, DeleteConfirmModal };
