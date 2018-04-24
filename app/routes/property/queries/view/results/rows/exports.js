import Route from '@ember/routing/route';
import RouteQueryManager from 'ember-apollo-client/mixins/route-query-manager';

import query from 'oh-behave-app/gql/queries/all-exports-for-query-result';

export default Route.extend(RouteQueryManager, {

  model() {
    const resultId = this.modelFor('property.queries.view.results.rows').result.get('id');

    const pagination = { first: 100 };
    const sort = { field: 'exportedAt', order:  -1 };
    const variables = { resultId, pagination, sort };
    return this.get('apollo').watchQuery({ query, variables, fetchPolicy: 'network-only' }, 'allExportsForQueryResult')
      .then(pagination => pagination.edges.map(node => node.node))
      .catch(e => this.get('graphErrors').show(e))
    ;
  },
});
