import Component from '@ember/component';
import { computed } from '@ember/object';
import { isArray } from '@ember/array';

export default Component.extend({
  classNames: ['btn-group'],
  attributeBindings: ['role', 'aria-label'],

  role: 'group',
  'aria-label': 'Sort filter',

  /**
   * The sortBy field value, e.g. `createdAt` or `name`.
   * @public
   * @type {string}
   */
  sortBy: null,

  /**
   * Whether the sort is ascending. A false value signifies descending.
   * @public
   * @type {boolean}
   */
  ascending: true,

  /**
   * Whether the sort dropdown control is completely disabled.
   * @public
   * @type {boolean}
   */
  disabled: false,

  /**
   * The class to apply to buttons within this group
   * @public
   * @type {string}
   */
  buttonClass: 'btn-primary',

  /**
   * The dropdown menu direction.
   * An empty value will use the default `down` direction.
   * Can be one of `up`, `right` or `left`.
   * @public
   * @type {string}
   */
  direction: null,

  /**
   * Aligns the menu.
   * An empty value will use the default `left` alignment.
   * A value of `right` will right-align the menu.
   */
  alignment: null,

  /**
   * Based on the `sortBy` value, computes the selected sort object.
   * For example, if the `sortBy` value equals `createdAt`, this would return
   * something like `{ key: 'createdAt', label: 'Created' }`.
   */
  selected: computed('options.[]', 'sortBy', function() {
    return this.get('options').findBy('key', this.get('sortBy'));
  }),

  /**
   * Displays filtered sort options by removing the currently selected `sortBy` value.
   * Returns an array of sort option objects.
   */
  filteredOptions: computed('options.[]', 'sortBy', function() {
    return this.get('options').rejectBy('key', this.get('sortBy'));
  }),

  /**
   * Determines the menu direction class based off the `direction` property.
   */
  directionClass: computed('direction', function() {
    switch (this.get('direction')) {
      case 'up':
        return 'dropup';
      case 'left':
        return 'dropleft';
      case 'right':
        return 'dropright';
      default:
        return '';
    }
  }),

  /**
   * Determines the menu alignment class based off the `alignment` property.
   */
  alignmentClass: computed('alignment', function() {
    if (this.get('alignment') === 'right') return 'dropdown-menu-right';
    return '';
  }),

  /**
   * Initializes the component.
   * If the `options` property is not an array, it will set it as an empty array.
   */
  init() {
    this._super(...arguments);
    if (!isArray(this.get('options'))) {
      this.set('options', []);
    }
  },

  actions: {
    toggleAscending() {
      this.toggleProperty('ascending');
    },
    sortBy(key) {
      this.set('sortBy', key);
    },
  },
});
