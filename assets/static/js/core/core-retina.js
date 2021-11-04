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