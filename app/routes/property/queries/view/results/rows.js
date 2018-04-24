import Route from '@ember/routing/route';
import RouteQueryManager from 'ember-apollo-client/mixins/route-query-manager';
import { getObservable } from 'ember-apollo-client';
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

  model({ result_id, first, after, sortBy, ascending }) {
    const controller = this.controllerFor(this.get('routeName'));

    const pagination = { first, after };
    const sort = { field: sortBy, order: ascending ? 1 : -1 };
    const variables = { resultId: result_id, pagination, sort };
    if (!sortBy) delete variables.sort.field;

    let rows;
    if (this.get('user').roleIs('Administrator', 'Member')) {
      rows = this.get('apollo').watchQuery({ query: rowsQuery, variables, fetchPolicy: 'network-only' }, 'allContentQueryResultRows')
        .then((result) => {
          controller.set('observable', getObservable(result));
          return result;
        })
        .catch(e => this.get('graphErrors').show(e)
      );
    } else {
      rows = [];
    }
    return hash({
      result: this.get('apollo').watchQuery({ query, variables: { input: { id: result_id } } }, 'contentQueryResult'),
      rows,
    });
  },
});
