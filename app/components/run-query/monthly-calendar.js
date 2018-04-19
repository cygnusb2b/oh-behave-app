import Component from '@ember/component';
import { computed } from '@ember/object';
import moment from 'moment';

export default Component.extend({
  disabled: false,

  nowStartOf: computed(function() {
    return moment().startOf('month');
  }),

  nowEndOf: computed(function() {
    return moment().endOf('month');
  }),

  startEndOf: computed('range.start', function() {
    const start = this.get('range.start');
    if (start) return moment(start).endOf('month');
  }),

  init() {
    this._super(...arguments);
    this.send('setInitialRange');
  },

  actions: {
    setStart(date) {
      this.set('range.start', date.startOf('month'));
      const end = this.get('range.end');
      if (!end) return;
      if (moment(date).endOf('month').unix() >= end.unix()) {
        this.send('setEnd', moment(end).add(1, 'month'));
      }
    },
    setEnd(date) {
      this.set('range.end', date.endOf('month'));
    },
    setInitialRange() {
      const start = this.get('range.start');
      const end = this.get('range.end');
      if (!start) {
        this.send('setStart', moment());
      }
      if (!end) {
        this.send('setEnd', moment());
      }
    },
  },

});
