import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  classNames: ['collapse'],
  attributeBindings: ['data-parent', 'aria-labelledby'],
  classNameBindings: ['show'],

  model: null,

  show: computed('model.new', function() {
    return this.get('model.new');
  }),

  searchType: computed('model.type', function() {
    const type = this.get('model.type');
    if (!type) return null;
    return type.toLowerCase();
  }),

  searchDisabled: computed('searchType', function() {
    if (this.get('searchType')) return false;
    return true;
  }),

  actions: {
    setType(type) {
      this.set('model.type', type);
      this.set('model.items', []);
    },
  },
});
