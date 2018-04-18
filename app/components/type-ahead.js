import Component from '@ember/component';
import { isArray } from '@ember/array';
import { computed } from '@ember/object';
import { task, timeout } from 'ember-concurrency';
import ComponentQueryManager from 'ember-apollo-client/mixins/component-query-manager';

import searchTaxonomy from 'oh-behave-app/gql/queries/search-taxonomy';
import searchCompanies from 'oh-behave-app/gql/queries/search-companies';

export default Component.extend(ComponentQueryManager, {

  property: null,

  closeOnSelect: true,
  allowClear: true,
  multiple: false,
  timeout: 600,
  type: null,

  selected: null,
  placeholder: null,

  _query: computed('type', function() {
    const type = this.get('type');
    switch (type) {
      case 'taxonomy':
        return { query: searchTaxonomy, resultKey: 'searchTaxonomy' };
      case 'company':
        return { query: searchCompanies, resultKey: 'searchCompanies' };
    }
    this.get('graphErrors').show(new Error(`The model type ${type} is not searchable.`));
  }),

  search: task(function* (phrase) {
    const property = this.get('property');
    const variables = { property, phrase };
    const { query, resultKey } = this.get('_query');

    const selected = this.get('selected') || [];
    const filterFrom = isArray(selected) ? selected : [ selected ];
    yield timeout(this.get('timeout'));
    return this.get('apollo').watchQuery({ query, variables }, resultKey)
      .then(r => r.filter(i => filterFrom.filterBy('id', i.id).length === 0))
      .catch(e => this.get('graphErrors').show(e))
    ;
  }),
});
