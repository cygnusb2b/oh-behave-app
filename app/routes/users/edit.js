import Route from '@ember/routing/route';
import RouteQueryManager from 'ember-apollo-client/mixins/route-query-manager';
import LoadingMixin from 'oh-behave-app/mixins/loading-mixin';

import query from 'oh-behave-app/gql/queries/user';
import deleteUser from 'oh-behave-app/gql/mutations/delete-user';
import updateUser from 'oh-behave-app/gql/mutations/update-user';

export default Route.extend(LoadingMixin, RouteQueryManager, {
  model({ id }) {
    const variables = { input: { id } };
    return this.get('apollo').watchQuery({ query, variables, fetchPolicy: 'network-only' }, 'user');
  },
  actions: {
    update(model) {
      this.showLoading();
      const mutation = updateUser;
      const { id, email, givenName, familyName, role } = model;
      const payload = { email, givenName, familyName, role };
      const input = { id, payload };
      const variables = { input };
      return this.get('apollo').mutate({ mutation, variables }, 'updateUser')
        .then(() => this.get('notify').success('User successfully updated.'))
        .catch(e => this.get('graphErrors').show(e))
        .finally(() => this.hideLoading())
      ;
    },
    delete(id, routeName) {
      this.showLoading();
      const mutation = deleteUser;
      const variables = { input: { id } };
      return this.get('apollo').mutate({ mutation, variables }, 'deleteUser')
        .then(() => this.transitionTo(routeName))
        .catch(e => this.get('graphErrors').show(e))
        .finally(() => this.hideLoading())
      ;
    },
  },
});
