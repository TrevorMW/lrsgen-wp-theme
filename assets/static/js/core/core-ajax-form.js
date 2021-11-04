/**
 * @package     AjaxForm
 * @version     1.0
 * @author     Trevor Wagner
 */

; (function ($, window, undefined) {

  var AjaxForm = function () {

    this.form = {
      el: null,
      action: null,
      confirm: false,
      submit: null,
      url: null
    };

    this.data = { formData: null };
    this.flags = { canSubmit: false };

    return this;
  };

  AjaxForm.prototype.init = function (form, url) {
    if (form.length > 0) {
      this.form.el = form;
      this.form.submit = form.find('button[type="submit"]');
      this.form.action = form.data('action');
      this.form.url = url;

      if (form.data('confirm') !== undefined) {
        this.form.confirm = form.data('confirm');
      }
    }

    this.collectData();

    if (this.confirmFormRequest()) {
      this.makeRequest(this);
    } else {
      $(document).trigger('core:loader:hide');
    }
  };

  AjaxForm.prototype.setObservers = function (inst, ajaxUrl) {
    $(document).on('submit', '[data-ajax-form]', { inst: inst, ajaxUrl: ajaxUrl }, function (e) {
      e.preventDefault();

      var form = $(this),
        formMsg = form.find('[data-form-msg]');
    
      $(document).trigger('core:message:init', { formMessage: formMsg }).trigger('core:message:hide');
      inst.init(form, ajaxUrl);
    });
  };

  AjaxForm.prototype.collectData = function () {
    this.data.formData = this.form.el.serialize();
  };

  AjaxForm.prototype.confirmFormRequest = function () {
    return this.form.confirm !== false ? confirm(this.form.confirm) : true;
  };

  AjaxForm.prototype.makeRequest = function () {
    $(document).trigger('core:overlay:show');

    // Ajax POST call using native DW library.
    $.ajax({
      method: 'POST',
      action: this.form.action,
      url: this.form.url,
      data: this.data.formData,
      success: this.formSuccess
    });
  };

  AjaxForm.prototype.formSuccess = function (resp) {
    var response;

    $(document).trigger('core:overlay:hide');
    
    try {
       response = JSON.parse(resp);
    } catch (e) {
      
    }

    $(document).trigger('core:message:show', { resp: response });

    if (response.data != null && 'redirectUrl' in response.data) {
      window.location.href = response.data.redirectUrl;
    }
  };

  /**
   * 
   */
  var FormMessage = function () {
    this.el = null;
    return this;
  }

  /**
   * 
   */
  FormMessage.prototype.init = function (el) {
    var self = this;

    if (el.length) {
      self.el = el;
      self.setObservers();
    }
  }

  /**
   * 
   */
  FormMessage.prototype.setObservers = function () {
    var self = this;

    $(document).on('core:message:init', function (e, data) {
      self.init(data.formMessage);
    })

    $(document).on('core:message:show', function (e, data) {
      self.show(data);
    })

    $(document).on('core:message:hide', function (e) {
      self.hide();
    })

    if (self.el != null) {
      self.el.on('click', function (e) {
        self.hide();
      })
    }
  }

  /**
   * 
   */
  FormMessage.prototype.show = function (data) {
    var self = this,
        resp = data.resp;
    
    if ('message' in resp) {
      self.el.text(resp.message)
             .addClass('active')
             .addClass(resp.status ? 'success' : 'error');
    }
  }

  /**
   * 
   */
  FormMessage.prototype.hide = function () {
    var self = this;
    self.el.removeClass('active success error info').text('');
  }

  /**
   * 
   */
  $(document).on('core:load', function (e) {
    var ajaxForm = new AjaxForm(core.ajaxUrl);
    ajaxForm.setObservers(ajaxForm, core.ajaxUrl);

    var formMsg = new FormMessage();
    formMsg.setObservers();
  })

})(jQuery, window);