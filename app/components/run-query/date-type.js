import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  classNames: ['dropdown'],

  dateType: null,
  disabled: false,

  selectedType: computed('dateType', function() {
    return this.get('dateTypes').find(type => type.key === this.get('dateType'));
  }),

  filteredDateTypes: computed('dateType', function() {
    return this.get('dateTypes').filter(type => type.key !== this.get('dateType'));
  }),

  actions: {
    setType(type) {
      this.set('dateType', type);
      this.get('onChange')();
    },
  },
});
