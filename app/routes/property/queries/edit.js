import Route from '@ember/routing/route';
import RouteQueryManager from 'ember-apollo-client/mixins/route-query-manager';
import LoadingMixin from 'oh-behave-app/mixins/loading-mixin';

import query from 'oh-behave-app/gql/queries/content-query';
import updateContentQuery from 'oh-behave-app/gql/mutations/update-content-query';

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
    update(model) {
      this.showLoading();
      const propertyId = this.modelFor('property').get('id');
      const mutation = updateContentQuery;
      const { id, name, criteria } = model;

      const formatted = criteria.reduce((agg, group) => {
        const { type, items } = group;
        const ids = items.map(item => item.id);
        agg.push({ type, ids });
        return agg;
      }, []);

      const payload = { name, criteria: formatted, propertyId };
      const input = { id, payload };
      const variables = { input };
      return this.get('apollo').mutate({ mutation, variables }, 'updateContentQuery')
        .then(() => this.get('notify').info('Query successfully updated.'))
        .catch(e => this.get('graphErrors').show(e))
        .finally(() => this.hideLoading())
      ;

    },
  },
});
