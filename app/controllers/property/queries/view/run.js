import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { inject } from '@ember/service';
import LoadingMixing from 'oh-behave-app/mixins/loading-mixin';
import moment from 'moment';

import mutation from 'oh-behave-app/gql/mutations/create-content-query-result';

export default Controller.extend(LoadingMixing, {
  apollo: inject(),

  dateType: 'latest',

  isRunning: false,
  hasSelectedDates: computed.and('range.{start,end}'),

  isDisabled: computed('isRunning', 'hasSelectedDates', function() {
    if (this.get('isRunning')) return true;
    if (this.get('hasSelectedDates')) return false;
    return true;
  }),

  calendarComponent: computed('dateType', function() {
    const key = this.get('dateType');
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
    const start = moment().subtract(7, 'days').startOf('day');
    const end = moment().endOf('day');
    this.set('range', { start, end });
  },
  actions: {
    run() {
      this.showLoading();
      this.set('isRunning', true);

      const payload = {
        queryId: this.get('model.id'),
        startDate: this.get('range.start').valueOf(),
        endDate: this.get('range.end').valueOf(),
        sourceType: this.get('dateType'),
      };
      const variables = { input: { payload } };
      return this.get('apollo').mutate({ mutation, variables }, 'createContentQueryResult')
        .then((response) => {
          this.get('notify').success('Query result successfully created.');
          this.transitionToRoute('property.queries.view.results.rows', response.id);
        })
        .catch(e => this.get('graphErrors').show(e))
        .finally(() => {
          this.set('isRunning', false);
          this.hideLoading();
        })
      ;
    },
  },
});
