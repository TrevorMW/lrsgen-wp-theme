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