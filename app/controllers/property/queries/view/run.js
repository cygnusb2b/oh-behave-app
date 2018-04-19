import Controller from '@ember/controller';
import { computed } from '@ember/object';

export default Controller.extend({
  dateType: null,

  isRunning: false,
  hasSelectedDates: computed.and('range.{start,end}'),

  isDisabled: computed('isRunning', 'hasSelectedDates', function() {
    if (this.get('isRunning')) return true;
    if (this.get('hasSelectedDates')) return false;
    return true;
  }),

  calendarComponent: computed('dateType', function() {
    const type = this.get('dateType');
    switch (type) {
      case 'Within Last 30-Days':
        return 'run-query/30-day-calendar';
      case 'From Monthly Archive':
        return 'run-query/monthly-calendar';
      default:
        return null;
    }
  }),

  init() {
    this._super(...arguments);
    this.clearDateRange();
    this.set('dateTypes', [
      'Within Last 30-Days',
      'From Monthly Archive',
    ]);
  },

  clearDateRange() {
    this.set('range', { start: null, end: null });
  },
  actions: {
    run() {
      this.set('isRunning', true);
    },
  },
});
