import Route from '@ember/routing/route';
import LoadingMixin from 'oh-behave-app/mixins/loading-mixin';

export default Route.extend({
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
  },
});
