import Component from '@ember/component';
import { computed } from '@ember/object';
import ComponentQueryManager from 'ember-apollo-client/mixins/component-query-manager';
import LoadingMixin from 'oh-behave-app/mixins/loading-mixin';

import query from 'oh-behave-app/gql/queries/test-content-query';

export default Component.extend(LoadingMixin, ComponentQueryManager, {
  tagName: 'button',
  classNames: ['btn'],
  attributeBindings: ['disabled', 'type'],

  type: 'button',
  disabled: computed.readOnly('isRunning'),

  isRunning: false,
  result: null,
  hasRun: false,

 click() {
  this.set('isRunning', true);
  this.set('result', null);
  this.set('hasRun', false);
  this.showLoading();
  const { id } = this.get('model');
  const variables = { input: { id } };
  this.get('apollo').watchQuery({
    query,
    variables,
    fetchPolicy: 'network-only'
  }, 'testContentQuery')
    .then(result => this.set('result', result))
    .catch(e => this.get('graphErrors').show(e))
    .finally(() => {
      this.hideLoading();
      this.set('hasRun', true);
      this.set('isRunning', false);
    })
  ;
 },

});
