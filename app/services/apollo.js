import ApolloService from 'ember-apollo-client/services/apollo';
import { computed } from '@ember/object';
import { inject } from '@ember/service';
import { setContext } from 'apollo-link-context';
import { Promise } from 'rsvp';
import { IntrospectionFragmentMatcher, InMemoryCache } from 'apollo-cache-inmemory';
import introspectionQueryResultData from 'oh-behave-app/gql/fragment-types';


export default ApolloService.extend({
  session: inject(),

  fragmentMatcher: computed(function() {
    return new IntrospectionFragmentMatcher({
      introspectionQueryResultData
    });
  }),

  clientOptions: computed(function() {
    return {
      link: this.get('link'),
      cache: new InMemoryCache({ fragmentMatcher: this.get('fragmentMatcher') }),
    };
  }),

  link: computed(function() {
    const httpLink = this._super(...arguments);

    const authLink = setContext((request, context) => {
      return this._runAuthorize(request, context);
    });
    return authLink.concat(httpLink);
  }),

  _runAuthorize() {
    if (!this.get('session.isAuthenticated')) {
      return {};
    }
    return new Promise((resolve) => {
      const headers = {
        'Authorization': `Bearer ${this.get('session.data.authenticated.token')}`,
      }
      resolve({ headers })
    });
  }

});
