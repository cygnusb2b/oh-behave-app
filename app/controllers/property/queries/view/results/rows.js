import ListController from '../../../../abstract-list';
import { inject } from '@ember/service';
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

  actions: {
    export(resultId) {
      window.location = `/export/${resultId}?bearer=${this.get('session.data.authenticated.token')}`;
    },
  },
});
