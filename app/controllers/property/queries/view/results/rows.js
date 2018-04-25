import ListController from '../../../../abstract-list';
import { inject } from '@ember/service';
import { get } from '@ember/object';
import LoadingMixin from 'oh-behave-app/mixins/loading-mixin';

export default ListController.extend(LoadingMixin, {
  session: inject(),

  init() {
    this._super(...arguments);
    this.set('sortOptions', [
      { key: 'createdAt', label: 'Created' },
      { key: 'email', label: 'Email Address' },
    ]);
    this.set('sortBy', 'email');
    this.set('ascending', true);
  },

  isExportLogOpen: false,

  actions: {
    export(resultId) {
      const data = this.get('session.data.authenticated');
      window.location = `/export/${resultId}?bearer=${get(data, 'session.token')}`;
    },
    displayExportLog() {
      this.set('isExportLogOpen', true);
    },
  },
});
