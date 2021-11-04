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