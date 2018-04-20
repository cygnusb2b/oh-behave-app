import Route from '@ember/routing/route';
import RouteQueryManager from 'ember-apollo-client/mixins/route-query-manager';
import LoadingMixin from 'oh-behave-app/mixins/loading-mixin';

import query from 'oh-behave-app/gql/queries/content-query';

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
});
