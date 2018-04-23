import Route from '@ember/routing/route';
import RouteQueryManager from 'ember-apollo-client/mixins/route-query-manager';
import { hash } from 'rsvp';

import rowsQuery from 'oh-behave-app/gql/queries/all-content-query-result-rows';
import query from 'oh-behave-app/gql/queries/content-query-result';

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
    this.controllerFor('property.queries.view.results.rows').setProperties({ totalCount, hasNextPage, endCursor });
    return pagination.edges.map(node => node.node);
  },

  model({ result_id, first, after, sortBy, ascending }) {

    const pagination = { first, after };
    const sort = { field: sortBy, order: ascending ? 1 : -1 };
    const variables = { resultId: result_id, pagination, sort };
    if (!sortBy) delete variables.sort.field;

    return hash({
      result: this.get('apollo').watchQuery({ query, variables: { input: { id: result_id } } }, 'contentQueryResult'),
      rows: this.get('apollo').watchQuery({ query: rowsQuery, variables, fetchPolicy: 'network-only' }, 'allContentQueryResultRows')
        .then(pagination => this.setPagination(pagination))
        .catch(e => this.get('graphErrors').show(e)
      ),
    });
  },
});
