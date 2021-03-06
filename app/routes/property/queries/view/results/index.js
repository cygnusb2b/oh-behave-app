import Route from '@ember/routing/route';
import RouteQueryManager from 'ember-apollo-client/mixins/route-query-manager';
import { getObservable } from 'ember-apollo-client';

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

  model({ first, after, sortBy, ascending }) {
    const controller = this.controllerFor(this.get('routeName'));

    const queryId = this.modelFor('property.queries.view').get('id');
    const pagination = { first, after };
    const sort = { field: sortBy, order: ascending ? 1 : -1 };
    const variables = { queryId, pagination, sort };
    if (!sortBy) delete variables.sort.field;

    return this.get('apollo').watchQuery({ query, variables, fetchPolicy: 'network-only' }, 'allContentQueryResults')
      .then((result) => {
        controller.set('observable', getObservable(result));
        return result;
      }).catch(e => this.get('graphErrors').show(e))
    ;
  },
});
