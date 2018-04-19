import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | property/queries/view', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:property/queries/view');
    assert.ok(route);
  });
});
