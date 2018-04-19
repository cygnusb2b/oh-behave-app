import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  classNames: ['dropdown'],

  dateType: null,
  disabled: false,

  filteredDateTypes: computed('dateType.key', function() {
    return this.get('dateTypes').filter(type => type.key !== this.get('dateType.key'));
  }),

  actions: {
    setType(type) {
      this.set('dateType', type);
      this.get('onChange')();
    },
  },
});
