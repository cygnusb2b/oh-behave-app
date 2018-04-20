import Route from '@ember/routing/route';
import RouteQueryManager from 'ember-apollo-client/mixins/route-query-manager';

import query from 'oh-behave-app/gql/queries/all-content-query-results';

export default Route.extend(RouteQueryManager, {
  queryParams: {
    first: {
      refreshModel: true
    },
    after: {
      refreshModel: true
    },
    sortBy: {
      refreshModel: true
    },
    ascending: {
      refreshModel: true
    },
  },

  setPagination(pagination) {
    const { totalCount } = pagination;
    const { hasNextPage, endCursor } = pagination.pageInfo;
    this.controllerFor('property.queries.index').setProperties({ totalCount, hasNextPage, endCursor });
    return pagination.edges.map(node => node.node);
  },

  model({ first, after, sortBy, ascending }) {
    const queryId = this.modelFor('property.queries.view').get('id');
    const pagination = { first, after };
    const sort = { field: sortBy, order: ascending ? 1 : -1 };
    const variables = { queryId, pagination, sort };
    if (!sortBy) delete variables.sort.field;
    return this.get('apollo').watchQuery({ query, variables, fetchPolicy: 'network-only' }, 'allContentQueryResults')
      .then(pagination => this.setPagination(pagination))
      .catch(e => this.get('graphErrors').show(e))
    ;
  },

  setupController(controller, model) {
    this._super(controller, model);
    controller.set('property', this.modelFor('property'));
  },
});
