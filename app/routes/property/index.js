import Route from '@ember/routing/route';

export default Route.extend({
  model() {
    // For now, redirect to queries.
    return this.transitionTo('property.queries');
  },
});
