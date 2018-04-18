import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | properties/create', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:properties/create');
    assert.ok(route);
  });
});
