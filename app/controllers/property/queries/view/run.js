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

  calendarComponent: computed('dateType.key', function() {
    const key = this.get('dateType.key');
    switch (key) {
      case 'latest':
        return 'run-query/30-day-calendar';
      case 'archive':
        return 'run-query/monthly-calendar';
      default:
        return null;
    }
  }),

  init() {
    this._super(...arguments);
    this.clearDateRange();
    this.set('dateTypes', [
      { key: 'latest', label: 'Within Last 30-Days' },
      { key: 'archive', label: 'From Monthly Archive' },
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
