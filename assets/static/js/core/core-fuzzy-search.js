/**
 * @package     core-fuzzy-search
 * @version     1.0
 * @author      Trevor Wagner
 */
;
(function($, window, undefined) {
    var FuzzySearch = function() {
        this.search = {
            form: null,
            input: null
        }
        this.searchableElements = [];
        this.urlValue = null;
        this.init();
        return this;
    }

    FuzzySearch.prototype.init = function() {
        var self = this,
            search = $('[data-fuzzy-search]');

        if (search.length) {
            self.search.form = search;
            self.search.input = search.find('input[type="search"]');

            var els = $('[data-fuzzy-item]');

            if (els.length) {
                self.searchableElements = els;
            }

            var urlVal = self.getUrlVars()['fuzzy'];

            if (urlVal != null) {
                self.urlValue = urlVal;
            }

            self.setObservers();
        }
    }

    FuzzySearch.prototype.setObservers = function() {
        var self = this;

        self.search.form.on('submit', function(e) {
            e.preventDefault();
        })

        self.search.input.on('keyup search', function(e, data) {

            var value = self.getSearchQuery();
            if (value.length) {
                var regex = new RegExp(value);

                self.searchableElements.each(function() {
                    var item = $(this),
                        searchableItemValue = item.data('fuzzyItem');

                    if (!searchableItemValue.match(regex)) {
                        self.hideItem(item);
                    }
                }).bind(self);
            } else {
                self.showAllItems();
            }
        }).bind(self);

        $(document).on('core:load:async', function() {
            if (self.urlValue != null) {
                self.fillSearch(self.urlValue)
            }
        }).bind(self);
    }

    FuzzySearch.prototype.getSearchQuery = function() {
        return this.search.input.val();
    }

    FuzzySearch.prototype.showItem = function(el) {
        el.show();
    }

    FuzzySearch.prototype.hideItem = function(el) {
        el.hide();
    }

    FuzzySearch.prototype.showAllItems = function() {
        this.searchableElements.each(function() {
            $(this).show();
        })
    }

    FuzzySearch.prototype.fillSearch = function(val) {
        this.search.input.val(val).trigger('keyup');
    }

    FuzzySearch.prototype.getUrlVars = function() {
        var vars = {};
        var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
            vars[key] = value;
        });
        return vars;
    }

    $(document).on('core:load', function() {
        new FuzzySearch();
    })
})(jQuery, window);