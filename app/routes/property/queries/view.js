import Route from '@ember/routing/route';
import RouteQueryManager from 'ember-apollo-client/mixins/route-query-manager';
import LoadingMixin from 'oh-behave-app/mixins/loading-mixin';

import query from 'oh-behave-app/gql/queries/content-query';
import testContentQuery from 'oh-behave-app/gql/queries/test-content-query';

export default Route.extend(RouteQueryManager, LoadingMixin, {
  model({ query_id }) {
    const propertyId = this.modelFor('property').get('id');
    const variables = { input: { propertyId, id: query_id } };
    return this.get('apollo').watchQuery({ query, variables, fetchPolicy: 'network-only' }, 'contentQuery');
  },

  setupController(controller, model) {
    this._super(controller, model);
    controller.set('property', this.modelFor('property'));
  },

  actions: {
    test(model) {
      this.showLoading();
      const { id } = model;
      const variables = { input: { id } };
      this.get('apollo').watchQuery({
        query: testContentQuery,
        variables,
        fetchPolicy: 'network-only'
      }, 'testContentQuery')
        .then((res) => console.info(res))
        .catch(e => this.get('graphErrors').show(e))
        .finally(() => this.hideLoading())
      ;
    },
  },
});
