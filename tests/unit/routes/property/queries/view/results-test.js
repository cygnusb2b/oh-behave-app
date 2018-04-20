import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | property/queries/view/history', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:property/queries/view/history');
    assert.ok(route);
  });
});
