import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | property/query/create', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:property/query/create');
    assert.ok(route);
  });
});
