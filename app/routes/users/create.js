import Route from '@ember/routing/route';
import RouteQueryManager from 'ember-apollo-client/mixins/route-query-manager';
import LoadingMixin from 'oh-behave-app/mixins/loading-mixin';

import mutation from 'oh-behave-app/gql/mutations/create-user';

export default Route.extend(LoadingMixin, RouteQueryManager, {
  model() {
    return {
      role: 'Member',
    };
  },

  actions: {
    create({
      email,
      givenName,
      familyName,
      password,
      confirmPassword,
      role,
    }) {
      this.showLoading();
      const payload = {
        email,
        givenName,
        familyName,
        password,
        confirmPassword,
        role,
      };
      const variables = { input: { payload } };
      return this.get('apollo').mutate({ mutation, variables }, 'createUser')
        .then(response => this.transitionTo('users.edit', response.id))
        .then(() => this.get('notify').info('User created successfully.'))
        .catch(e => this.get('graphErrors').show(e))
        .finally(() => this.hideLoading())
      ;
    },
  },
});
