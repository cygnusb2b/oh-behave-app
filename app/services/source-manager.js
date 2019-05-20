import Service from '@ember/service';

export default Service.extend({
  init() {
    this._super(...arguments);
    this.set('baseVersions', ['3', '4']);
    this.set('userSources', ['Merrick', 'Components', 'Radix']);
    this.set('stacks', ['aerilon', 'picon', 'caprica']);
  },
});
