import ListController from '../../../../abstract-list';

export default ListController.extend({
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
