import Route from '@ember/routing/route';
import { inject } from '@ember/service';
import LoadingMixin from 'oh-behave-app/mixins/loading-mixin';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';
import RouteQueryManager from 'ember-apollo-client/mixins/route-query-manager';

import allProperties from 'oh-behave-app/gql/queries/all-properties';

export default Route.extend(LoadingMixin, ApplicationRouteMixin, RouteQueryManager, {
  session: inject(),

  beforeModel() {
    return this._loadCurrentUser();
  },

  model() {
    const query = allProperties;
    const pagination = { first: 100 };
    const sort = { field: 'name', order: 11 };
    const variables = { pagination, sort };
    return this.get('apollo').watchQuery({ query, variables, fetchPolicy: 'network-only' }, 'allProperties')
      .then(paginated => paginated.edges.map(edge => edge.node))
      .catch(e => this.get('graphErrors').show(e))
    ;
  },

  sessionAuthenticated() {
    this._super(...arguments);
    this._loadCurrentUser().catch((e) => {
      this.get('graphErrors').show(e);
      this.get('session').invalidate();
    });
  },

  setupController(controller, model) {
    controller.set('session', this.get('session'));
    this._super(controller, model);
  },

  _loadCurrentUser() {
    return this.get('user').load();
  },

  /**
   *
   */
  actions: {
    /**
     *
     * @param {string} name The route name to transition to.
     */
    transitionTo(name) {
      this.transitionTo(name);
    },

    /**
     *
     * @param {*} transition
     */
    loading(transition) {
      this.showLoading();
      transition.finally(() => this.hideLoading());
    },

    /**
     *
     * @param {Error} e
     */
    error(e) {
      if (this.get('graphErrors').isReady()) {
        this.get('graphErrors').show(e);
      } else {
        this.intermediateTransitionTo('application_error', e);
      }
    },
  },
});
