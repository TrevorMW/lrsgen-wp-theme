;
(function($, window, undefined) {

    var RatesTable = function() {
        this.editableCells = [];

        this.init();
        return this;
    }

    RatesTable.prototype.init = function() {
        var self = this,
            editableCells = $('[contenteditable]');

        if (editableCells.length) {
            self.editableCells = editableCells;

            self.setObservers();
        }
    }

    RatesTable.prototype.setObservers = function() {
        var self = this;

        self.editableCells.each(function() {
            $(this).on('focus', function() {
                self.setRateRowStatus($(this), 'notSaved');
            }).bind(self)

            $(this).closest('tr').on('focusout', function() {

            }).bind(self)
        }).bind(self)
    }

    RatesTable.prototype.setRateRowStatus = function(el, status) {
        el.closest('tr').addClass('notSaved').find('[data-rate-row-status] i').toggleClass('fa-check fa-times')
    }

    $(document).on('core:load', function() {
        new RatesTable();

    })

})(jQuery, window)