import Route from '@ember/routing/route';

export default Route.extend({
  model() {
    const property = this.modelFor('property');
    return { property };
  },
});
