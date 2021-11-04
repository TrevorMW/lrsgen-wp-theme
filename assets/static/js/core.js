;(function( $, window, undefined )
{
  // DEFINED GLOBAL EVENTS THAT CAN BE HOOKED INTO THROUGHOUT ALL LOADED JS.
  $(document).ready(function( e ){
    $(document).trigger('core:load').delay(500).trigger('core:load:async');
  });

  $(window).resize(function( e ){
    $(document).trigger('core:resize', e)
  });

})(jQuery, window );



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
/**
 * @package     AjaxForm
 * @version     1.0
 * @author     Trevor Wagner
 */

;(function ( $, window, undefined ) {

  var Overlay = function(){

    this.overlay = {
      el: null
    };

    return this;
  };

  Overlay.prototype.init = function( el )
  {
    if( el.length > 0 ){
      this.overlay.el = el;
    }

    this.setObservers();
  };

  Overlay.prototype.setObservers = function()
  {
    $(document).on( 'core:overlay:show', this, function( e ){
      e.data.show();
    });

    $(document).on( 'core:overlay:hide', this, function( e ){
      e.data.hide();
    });
  };

  Overlay.prototype.show = function()
  {
    this.overlay.el.addClass('active').addClass('visible');
  };

  Overlay.prototype.hide = function()
  {
    setTimeout( function( overlay ){
      overlay.removeClass('visible');
      setTimeout(function( overlay ){
         overlay.removeClass('active')
      }, 1000, overlay )
    }, 1000, this.overlay.el )
  };

  $(document).on( 'core:load', function( e ){
    var overlay = new Overlay();
    overlay.init( $('[data-overlay]') );
  })

})( jQuery, window );
/**
 * @package     core-async-content
 * @version     1.0
 * @author      Trevor Wagner
 */

;(function( $, window, undefined ){

  var AsyncLoad = function(){
    this.allAsyncContent = [];
    this.defaults = {
          el:null,
          core:{
            action:null,
            url:core.ajaxUrl,
            loadEvent:null
          },
          flags:{
            canLoad:true
          }
        };

    return this;
  };

  AsyncLoad.prototype.findAsyncItems = function( element ){
    var asyncs = $('[data-load-async]' ),
        self   = this;

    if( asyncs.length > 0 ){
      asyncs.each( function(){
        var settings = self.init( self.defaults, self.buildOptions( $(this) ) );
        self.allAsyncContent.push( settings );
        self.setObservers( $(this), settings );
      })
    }
  };

  AsyncLoad.prototype.init = function( defaults, options ){
    return $.extend( defaults, options );
  };

  AsyncLoad.prototype.buildOptions = function( element ){
    var options = {
      el:element,
      core:{
        action:element.data('load-async'),
        url:core.ajaxUrl,
        loadEvent:element.data('load-on')
      },
      flags:{
        canLoad:true
      }
    };

    return options;
  };

  AsyncLoad.prototype.setObservers = function( element, settings ){
    var self = this;
    $(document).on( settings.core.loadEvent, { element:element, settings:settings }, function( e ){
      self.loadData( element, settings );
    })
  };

  AsyncLoad.prototype.loadData = function( element, settings ){
    var self = this;
    if( settings.flags.canLoad ){
      $.ajax({
        method:'POST',
        data:{ action : settings.core.action },
        url: settings.core.url
      })
        .success( self.loadSuccess() )
        .error( self.loadError() )
        .always( self.afterLoad() )
    }
  };

  AsyncLoad.prototype.loadSuccess = function() {

  };

  AsyncLoad.prototype.loadError = function() {

  };

  AsyncLoad.prototype.afterLoad = function() {

  };

  $(document).on( 'core:load', function(){
    var async = new AsyncLoad();
    async.findAsyncItems();
  });

})( jQuery, window );
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
/**
 * @package     AjaxForm
 * @version     1.0
 * @author     Trevor Wagner
 */

;(function ( $, window, undefined )
{
  var Hero = function(){
    this.hero = {
      el:'',
      img:'',
      imgHeight:null,
      aspectRatio:null,
      heroOff: null,
      overlay:null
    }
  };

  Hero.prototype.init = function(){

    var hero = $('[data-hero]');

    if( hero.length === 1 ){
      this.hero.el           = hero;
      this.hero.img          = this.hero.el.find('img');
      this.hero.aspectRatio  = this.initialRatio( this.hero.img );
      this.hero.imgHeight    = this.hero.img.height();
      this.hero.heroOff      = this.hero.el.data('hero-off');
      this.hero.overlay      = this.hero.el.find('[data-hero-overlay]');

      this.setObservers();
      this.resizeHero();
    }
  };

  Hero.prototype.setObservers = function(){
    var self = this;

    $(document).on( 'core:resize', function(){
      self.resizeHero();
    })
  };

  Hero.prototype.resizeHero = function(){
    var height = Math.max( this.hero.imgHeight, this.getAspectRatioHeight() );

    setTimeout( function( data, height ){
      data.activate( height );
      data.show();
    }, 300, this, height )
  };

  Hero.prototype.getAspectRatioHeight = function(){
    return parseInt( $( window ).width() * this.hero.aspectRatio );
  };

  Hero.prototype.initialRatio = function( img ) {
    return parseFloat( img.attr( 'height' ) / img.attr( 'width' ) );
  };

  Hero.prototype.activate = function( height ){
    this.hero.overlay.css( 'height', height );
  };

  Hero.prototype.show = function(){
    this.hero.overlay.addClass( 'active' )
  };

  $(document).on( 'core:load', function(){
    hero = new Hero();
    hero.init();
  })

})(jQuery, window );
/**
 * @package     Popup
 * @version     1.0
 * @author      Trevor Wagner
 */

;(function ( $, window, undefined ) {

  var Popup = function(){

    this.popup = {
      el:null,
      canShow:false
    };

    return this;
  };

  Popup.prototype.init = function( el )
  {
    if( el.length > 0 )
    {
      this.popup.el = el;
      this.popup.canShow = true;
    }
  };

  Popup.prototype.setObservers = function()
  {
    $(document).on( 'click', '[data-trigger="popup"]', this, function( e ){
      var triggerData = $(this).data('trigger-data' ),
          popup =  $('[data-popup="' + triggerData + '"]');
      e.data.init( popup );


      if( e.data.popup.canShow ){
        $(document).trigger('core:popup:show')
      }
    });

    $(document).on( 'click', '[data-destroy]', this, function(){
      $(document).trigger('core:popup:hide', $(this).parent() );
    });

    $(document).on( 'core:popup:show', this, function( e ){
      e.data.show();
    });

    $(document).on( 'core:popup:hide', this, function( e ){
      e.data.hide();
    });
  };

  Popup.prototype.show = function()
  {
    this.popup.el.addClass('active');

    setTimeout(function( popup ){
      popup.addClass('visible');
    }, 300, this.popup.el );
  };

  Popup.prototype.hide = function()
  {
    this.popup.el.removeClass('visible');
    this.popup.el.removeClass('active');
  };

  $(document).on( 'core:load', function( e ){
    var popup = new Popup();
    popup.setObservers();
  })

})( jQuery, window );
/**
 * @package     AjaxForm
 * @version     1.0
 * @author     Trevor Wagner
 */

;(function ( $, window, undefined )
{
  var Retina = function(){
    this.img = {
      el:null,
      src:null
    }
  };

  Retina.prototype.init = function ( el ){

    if( el.length > 0 ){
      this.img.el     = el;
      this.img.src    = el.data('retina');
    }

    if( true ){
      this.replaceImages();
    }
  };

  Retina.prototype.replaceImages = function (){
    this.img.el.attr('src', this.img.src );
    this.img.el.css( 'height', this.img.height() );
    this.img.el.css( 'width', this.img.width() );
  };

  Retina.prototype.isRetina = function ()
  {
    if( window.matchMedia )
    {
      var mq = window.matchMedia( "only screen and (min--moz-device-pixel-ratio: 1.3), only screen and (-o-min-device-pixel-ratio: 2.6/2), only screen and (-webkit-min-device-pixel-ratio: 1.3), only screen and (min-device-pixel-ratio: 1.3), only screen and (min-resolution: 1.3dppx)" );

      return ( mq && mq.matches || ( window.devicePixelRatio > 1 ) );
    }
  };

  $(document).on('core:load', function( e ){
    var retinaImgs = $('img[data-retina]');

    if( retinaImgs.length >= 1 ){
      retinaImgs.each(function(){
        retina = new Retina();
        retina.init( $(this) );
      })
    }
  })

})(jQuery, window);