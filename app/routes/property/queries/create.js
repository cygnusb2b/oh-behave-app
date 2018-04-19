import Route from '@ember/routing/route';
import RouteQueryManager from 'ember-apollo-client/mixins/route-query-manager';
import LoadingMixin from 'oh-behave-app/mixins/loading-mixin';

import mutation from 'oh-behave-app/gql/mutations/create-content-query';

export default Route.extend(RouteQueryManager, LoadingMixin, {
  model() {
    const property = this.modelFor('property');
    const query = { criteria: [] };
    return { property, query };
  },

  actions: {
    create({ name, criteria }) {
      const propertyId = this.modelFor('property').get('id');
      const formatted = criteria.reduce((agg, group) => {
        const { type, items } = group;
        const ids = items.map(item => item.id);
        agg.push({ type, ids });
        return agg;
      }, []);

      const payload = { propertyId, name, criteria: formatted };
      const variables = { input: { payload } };
      return this.get('apollo').mutate({ mutation, variables }, 'createContentQuery')
        .then(response => this.transitionTo('property.queries.view', response.id))
        .then(() => this.get('notify').success('Query successfully created.'))
        .catch(e => this.get('graphErrors').show(e))
        .finally(() => this.hideLoading())
      ;
    },
  },
});
