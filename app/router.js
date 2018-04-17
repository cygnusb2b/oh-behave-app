import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('property', { path: ':key' }, function() {

  });
  this.route('login');
  this.route('users', function() {
    this.route('create');
    this.route('edit', { path: ':id' });
  });
});

export default Router;
