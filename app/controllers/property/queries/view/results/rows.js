import ListController from '../../../../abstract-list';
import LoadingMixin from 'oh-behave-app/mixins/loading-mixin';

export default ListController.extend(LoadingMixin, {
  init() {
    this._super(...arguments);
    this.set('sortOptions', [
      { key: 'createdAt', label: 'Created' },
      { key: 'email', label: 'Email Address' },
    ]);
    this.set('sortBy', 'email');
    this.set('ascending', true);
  },
});
