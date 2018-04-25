import Component from '@ember/component';
import { isArray } from '@ember/array';
import { computed } from '@ember/object';
import { task, timeout } from 'ember-concurrency';
import ComponentQueryManager from 'ember-apollo-client/mixins/component-query-manager';

import searchTaxonomy from 'oh-behave-app/gql/queries/search-taxonomy';
import searchCompanies from 'oh-behave-app/gql/queries/search-companies';
import searchSections from 'oh-behave-app/gql/queries/search-sections';

export default Component.extend(ComponentQueryManager, {

  propertyId: null,

  closeOnSelect: true,
  allowClear: true,
  multiple: false,
  timeout: 600,
  type: null,

  disabled: false,
  selected: null,
  placeholder: null,

  _closeOnSelect: computed('results.length', 'multiple', function() {
    const closeOnSelect = this.get('closeOnSelect');
    if (!this.get('multiple')) return closeOnSelect;
    return this.get('results.length') === 1 ? true : closeOnSelect;
  }),

  _query: computed('type', function() {
    const type = this.get('type');
    switch (type) {
      case 'taxonomy':
        return { query: searchTaxonomy, resultKey: 'searchTaxonomy' };
      case 'company':
        return { query: searchCompanies, resultKey: 'searchCompanies' };
      case 'section':
        return { query: searchSections, resultKey: 'searchSections' };
    }
    this.get('graphErrors').show(new Error(`The model type ${type} is not searchable.`));
  }),

  search: task(function* (phrase) {
    const propertyId = this.get('propertyId');
    const variables = { propertyId, phrase };
    const { query, resultKey } = this.get('_query');

    const selected = this.get('selected') || [];
    const filterFrom = isArray(selected) ? selected : [ selected ];
    yield timeout(this.get('timeout'));
    return this.get('apollo').watchQuery({ query, variables, fetchPolicy: 'network-only' }, resultKey)
      .then(r => r.filter(i => filterFrom.filterBy('id', i.id).length === 0))
      .then((f) => {
        this.set('results', f);
        return f;
      })
      .catch(e => this.get('graphErrors').show(e))
    ;
  }),
});
