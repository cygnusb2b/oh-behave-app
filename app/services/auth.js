import Service from '@ember/service';
import ObjectQueryManager from 'ember-apollo-client/mixins/object-query-manager';

import checkSession from 'oh-behave-app/gql/queries/check-session';
import deleteSession from 'oh-behave-app/gql/mutations/delete-session';
import loginUser from 'oh-behave-app/gql/mutations/login-user';

export default Service.extend(ObjectQueryManager, {
  user: null,

  /**
   * Checks the current session.
   *
   * @param {string} token
   * @return {Promise}
   */
  check(token) {
    const variables = {
      input: { token },
    };
    return this.get('apollo').watchQuery({ query: checkSession, variables }, "checkSession").then((auth) => {
      const { session, user } = auth;
      this.set('user', user);
      return session;
    });
  },

  /**
   * Submits authentication credentials (logs a user in).
   *
   * @param {string} email
   * @param {string} password
   * @return {Promise}
   */
  submit(email, password) {
    const variables = {
      input: { email, password },
    };
    return this.get('apollo').mutate({ mutation: loginUser, variables }, "loginUser").then((auth) => {
      const { session, user } = auth;
      this.set('user', user);
      return session;
    })
  },

  /**
   * Deletes the current auth session token.
   *
   * @return {Promise}
   */
  delete() {
    return this.get('apollo').mutate({ mutation: deleteSession }, "deleteSession").then(() => {
      this.set('user', null);
    });
  },
});
