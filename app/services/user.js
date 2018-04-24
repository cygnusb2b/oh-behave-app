import Service, { inject } from '@ember/service';
import { computed } from '@ember/object';
import { isEmpty } from '@ember/utils';
import { Promise } from 'rsvp';

import currentUser from 'oh-behave-app/gql/queries/current-user';

export default Service.extend({
  session: inject(),
  apollo: inject(),
  loadingDisplay: inject(),

  /**
   * The user model from graph.
   *
   * @type {DS.Model}
   */
  model: null,

  /**
   * Determines if the user is authenticated, based on the session.
   * Does not check whether a user model is present, or if the session is verified.
   *
   * @type {boolean}
   */
  isAuthenticated: computed.reads('session.isAuthenticated'),

  role: computed('isAuthenticated', 'model.role', function() {
    if (!this.get('isAuthenticated')) return null;
    return this.get('model.role');
  }),

  roleIs(...roles) {
    const role = this.get('role');
    if (!role) return false;
    return roles.includes(role);
  },

  load() {
    return new Promise((resolve) => {
      const userId = this.get('session.data.authenticated.id');
      if (isEmpty(userId)) return resolve();

      return this.get('apollo').watchQuery({ query: currentUser }, 'currentUser')
        .then(user => this.set('model', user))
        .then(() => resolve())
      ;
    });
  },

  logout() {
    const loader = this.get('loadingDisplay');
    loader.show();
    return this.get('session').invalidate()
      .finally(loader.hide())
    ;
  }
});
