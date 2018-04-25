import Route from '@ember/routing/route';
import RouteQueryManager from 'ember-apollo-client/mixins/route-query-manager';
import LoadingMixin from 'oh-behave-app/mixins/loading-mixin';

import mutation from 'oh-behave-app/gql/mutations/create-property';

export default Route.extend(RouteQueryManager, LoadingMixin, {
  model() {
    return {};
  },

  actions: {
    create({ name, key, baseVersion, userSource }) {
      this.showLoading();
      const refetchQueries = ['PropertyDropdown'];
      const payload = { name, key, baseVersion, userSource };
      const variables = { input: { payload } };
      return this.get('apollo').mutate({ mutation, variables, refetchQueries }, 'createProperty')
        .then(response => this.transitionTo('properties.edit', response.id))
        .then(() => this.get('notify').success('Property successfully created.'))
        .catch(e => this.get('graphErrors').show(e))
        .finally(() => this.hideLoading())
      ;
    },
  },
});
