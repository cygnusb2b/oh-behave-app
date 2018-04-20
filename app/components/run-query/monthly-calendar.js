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
      this.set('range.start', moment(date).startOf('month'));
      const end = this.get('range.end');
      if (!end) return;
      if (this.get('range.start').unix() > moment(end).unix()) {
        this.send('setEnd', moment(end).add(1, 'month'));
      }
    },
    setEnd(date) {
      this.set('range.end', moment(date).startOf('month'));
    },
    setInitialRange() {
      const start = this.get('range.start') || moment();
      const end = this.get('range.end') || moment();
      this.send('setEnd', end);
      this.send('setStart', start);
    },
  },

});
