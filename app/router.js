import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('property', { path: ':id' }, function() {
    this.route('queries', function() {
      this.route('create');
      this.route('edit', { path: '/edit/:query_id' });
      this.route('view', { path: '/view/:query_id' }, function() {
        this.route('run');
        this.route('results', function() {
          this.route('rows', { path: ':result_id' });
        });
      });

    });
  });
  this.route('login');
  this.route('users', function() {
    this.route('create');
    this.route('edit', { path: ':id' });
  });
  this.route('properties', function() {
    this.route('create');
    this.route('edit', { path: ':id' });
  });
});

export default Router;
