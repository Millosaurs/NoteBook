  'use strict';

  import { generateId, findNotebook, findNotebookIndex, findNote, findNoteIndex } from "./utils.js";

  let notekeeperDB = {};

  const initDB = function () {
    const db = localStorage.getItem('notekeeperDB');

    if (db) {
      notekeeperDB = JSON.parse(db);
    } else {
        notekeeperDB.notebooks = [];
        localStorage.setItem('notekeeperDB', JSON.stringify(notekeeperDB));
      };
    }

  initDB();


  const readDB = function () {
    notekeeperDB = JSON.parse(localStorage.getItem('notekeeperDB'));
  }

  const writeDB = function () {
    localStorage.setItem('notekeeperDB', JSON.stringify(notekeeperDB));
  }
/**
 * @namespace 
 * @property {Object} get 
 * @property {Object} post
 * @property {Object} update
 * @property {Object} delete
 */
  export const db = {

    post: {
        /**
         * @function
         * @param {string} name
         * @returns {Object} 
         */
    notebooks(name) {
        readDB();
        const notebooksData = {
          id: generateId(),
          name,
          notes: []
        }

        notekeeperDB.notebooks.push(notebooksData);

        console.log(notebooksData);
        writeDB();

        return notebooksData;
    },
    /**
     * @function
     * @param {string} notebookId 
     * @param {Object} Object
     * @returns {Object}  
     */
    note(notebookId, Object) {
      readDB();

      const notebook = findNotebook(notekeeperDB, notebookId);

      const noteData = {
        id: generateId(),
        notebookId,
        ...Object,
        postedOn: new Date().getTime()
      }
      
      notebook.notes.unshift(noteData);
      writeDB();

      return noteData;

    }
    },
    get: {
      /**
       * @function
       * @returns {Array<Object>} 
       */
      notebook() {
        readDB();

        return notekeeperDB.notebooks;
      },
      /**
       * @function
       * @param {string} notebookId 
       * @returns {Array<Object>} 
       */
      note(notebookId) {
        readDB();

        const notebook = findNotebook(notekeeperDB, notebookId);
        return notebook.notes;
      }
    },
    update: {
      /**
       * 
       * @param {string} notebookId 
       * @param {string} name
       * @return {Object}  
       */
      notebook(notebookId, name) {
        readDB();
        const notebook = findNotebook(notekeeperDB, notebookId);
        notebook.name = name;
        writeDB();
        return notebook;
      },
      note(noteId, object) {
        readDB();

        const oldNote = findNote(notekeeperDB, noteId);
        const newnote = Object.assign(oldNote, object);
        
        writeDB();

        return newnote;
      }
    },
    delete: {
      /**
       * @function
       * @param {string} notebookId 
       */
      notebook(notebookId){
        readDB();
        const notebookIndex = findNotebookIndex(notekeeperDB, notebookId);
        notekeeperDB.notebooks.splice(notebookIndex, 1);

        writeDB();
      },
      /**
       * @function
       * @param {string} notebookId 
       * @param {string} noteId 
       * @returns {Array<Object>} 
       */
      note(notebookId, noteId) {
        readDB();
        const  notebook = findNotebook(notekeeperDB, notebookId);
        const noteIndex = findNoteIndex(notebook, noteId);

        notebook.notes.splice(noteIndex, 1);
        writeDB();

        return notebook.notes;

      }
    }
  }