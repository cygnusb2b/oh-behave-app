import Route from '@ember/routing/route';
import RouteQueryManager from 'ember-apollo-client/mixins/route-query-manager';
import LoadingMixin from 'oh-behave-app/mixins/loading-mixin';

import query from 'oh-behave-app/gql/queries/property';
import deleteProperty from 'oh-behave-app/gql/mutations/delete-property';
import updateProperty from 'oh-behave-app/gql/mutations/update-property';

export default Route.extend(LoadingMixin, RouteQueryManager, {
  model({ id }) {
    const variables = { input: { id } };
    return this.get('apollo').watchQuery({ query, variables, fetchPolicy: 'network-only' }, 'property');
  },
  actions: {
    update(model) {
      this.showLoading();
      const mutation = updateProperty;
      const { id, name, key, baseVersion, userSource, stack } = model;
      const payload = { name, key, baseVersion, userSource, stack };
      const input = { id, payload };
      const variables = { input };
      return this.get('apollo').mutate({ mutation, variables }, 'updateProperty')
        .then(() => this.get('notify').success('Property successfully updated.'))
        .catch(e => this.get('graphErrors').show(e))
        .finally(() => this.hideLoading())
      ;
    },
    delete(id, routeName) {
      this.showLoading();
      const refetchQueries = ['PropertyDropdown'];
      const mutation = deleteProperty;
      const variables = { input: { id } };
      return this.get('apollo').mutate({ mutation, variables, refetchQueries }, 'deleteProperty')
        .then(() => this.transitionTo(routeName))
        .catch(e => this.get('graphErrors').show(e))
        .finally(() => this.hideLoading())
      ;
    },
  },
});
