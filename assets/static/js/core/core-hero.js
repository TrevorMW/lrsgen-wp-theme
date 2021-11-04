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