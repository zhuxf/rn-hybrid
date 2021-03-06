/* jshint esversion: 6 */

import Dispatcher from '../dispatcher/Dispatcher';
import { EventEmitter } from 'events';
import assign from 'object-assign';

var CHANGE_EVENT = 'change';

var _todos = {};
var id = 0;
function create(text) {
  _todos[id] = {
    id: id,
    complete: false,
    text: text
  };
  id ++;
}

function update(id, updates) {
  _todos[id] = assign({}, _todos[id], updates);
}

let Store = assign({}, EventEmitter.prototype, {

    /**
     * Get the entire collection of TODOs.
     * @return {object}
     */
    getAll: function() {
      return _todos;
    },

    emitChange: function() {
      this.emit(CHANGE_EVENT);
    },

    /**
     * @param {function} callback
     */
    addChangeListener: function(callback) {
      this.on(CHANGE_EVENT, callback);
    },

    /**
     * @param {function} callback
     */
    removeChangeListener: function(callback) {
      this.removeListener(CHANGE_EVENT, callback);
    }
});

Dispatcher.register((action) => {
    var text;
    switch(action.actionType) {
        case 'create':
            text = action.text.trim();
            if (text !== '') {
                create(text);
                Store.emitChange();
            }
        break;
        case 'updateText':
            text = action.text.trim();
            if (text !== '') {
                update(action.id, {text: text});
                Store.emitChange();
            }
        break;
        default:
        break;
    }
});

export default Store;
