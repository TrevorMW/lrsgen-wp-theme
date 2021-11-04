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