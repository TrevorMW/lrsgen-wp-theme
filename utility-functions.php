<?php

/**
 * 
 */
function get_current_template($echo = false)
{
  if (!isset($GLOBALS['current_theme_template']))
    return false;

  if ($echo)
    echo $GLOBALS['current_theme_template'];
  else
    return $GLOBALS['current_theme_template'];
}

/**
 * 
 */
function get_excerpt_by_id($post_id, $length = 35)
{
  $new_post       = get_post($post_id); //Gets post ID
  $the_excerpt    = strip_tags($new_post->post_content); //Strips tags and images
  $words          = explode(' ', $the_excerpt, $length + 1);

  if (count($words) > $length) {
    array_pop($words);
    array_push($words, '…');
    $the_excerpt = implode(' ', $words);
  };

  return apply_filters('the_content', $the_excerpt);
}

/**
 * 
 */
function build_pagination($loop, $paged)
{
  global $wp;

  $args = array(
    'format'     => 'page/%#%',
    'total'      => $loop->max_num_pages,
    'current'    => max(1, $paged),
    'prev_text'  => __('<i data-previous class="fa fa-caret-left"></i>'),
    'next_text'  => __('<i data-next     class="fa fa-caret-right"></i>'),
    'type'       => 'array'
  );

  return formatted_pagination(paginate_links($args));
}

/**
 * 
 */
function formatted_pagination($data)
{
  $html = '';

  if (count($data) > 0) {
    $html .= '<ul class="pagination">';

    foreach ($data as $link) {
      $class = '';
      strpos($link, 'current') != false ? $class = 'active' : '';
      $html .= '<li class="' . $class . '">' . $link . '</li>';
    }

    $html .= '</ul>';
  }

  return $html;
}

/**
 * 
 */
function get_template_part_with_data($slug = null, $name = null, array $params = array())
{
  global $posts, $post, $wp_did_header, $wp_query, $wp_rewrite, $wpdb, $wp_version, $wp, $id, $comment, $user_ID;

  do_action("get_template_part_{$slug}", $slug, $name);

  $templates = array();
  if (isset($name))
    $templates[] = "/views/{$slug}-{$name}.php";

  $templates[] = "/views/{$slug}.php";

  $_template_file = locate_template($templates, false, false);

  if (is_array($wp_query->query_vars)) {
    extract($wp_query->query_vars, EXTR_SKIP);
  }
  extract($params, EXTR_SKIP);

  require($_template_file);
}

/**
 * 
 */
function __is_blog()
{
  global $post;
  $posttype = get_post_type($post);
  return (((is_archive()) || (is_home())) && ($posttype == 'post')) ? true : false;
}

/**
 * 
 */
function get_array_from_object($array = array())
{
  $result = array();

  if (is_array($array)) {
    foreach ($array as $obj) {
      $result[$obj->ID] = $obj->post_title;
    }
  }

  return $result;
}

/**
 * 
 */
function var_template_include($t)
{
  $GLOBALS['current_theme_template'] = basename($t);
  return $t;
}
add_filter('template_include', 'var_template_include', 1000);


/**
 * 
 */
if (function_exists('acf_add_options_page')) {
  acf_add_options_page(array(
    'page_title'   => 'Global Settings',
    'menu_title'  => 'Global Settings',
    'menu_slug'   => 'global-settings',
    'capability'  => 'edit_posts',
    'redirect'    => false
  ));
}


////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////// END UTILITY FUNCTIONS /////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////


/**
 *
 * ENQUEUE CSS, LESS, & SCSS STYLESHEETS
 *
 */
function add_style_sheets()
{
  if (!is_admin()) {
    wp_enqueue_style('reset', get_template_directory_uri() . '/style.css', 'screen');
    wp_enqueue_style('fontawesome', '//maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css', 'screen');
    wp_enqueue_style(
      'googleFonts',
      '//fonts.googleapis.com/css?family=ABeeZee|Roboto+Condensed:300,400,700',
      'screen'
    );

    // On login page only
    if (is_page('login')) {
      wp_enqueue_style('loginCss', get_template_directory_uri() . '/assets/static/css/login.css', array(), false, 'screen');
    } else {
      wp_enqueue_style('main', get_template_directory_uri() . '/assets/static/css/style.css', array(), false, 'screen');
    }
  }
}
add_action('wp_enqueue_scripts', 'add_style_sheets');


// IF ADMIN JS OR STYLES ARE NEEDED, YOU CAN USE THIS AS A TEMPLATE
function load_custom_wp_admin_style()
{
  //wp_enqueue_style( 'admin-fixes', get_template_directory_uri().'/assets/css/admin-fixes.css', 'screen'  );
}
//add_action( 'admin_enqueue_scripts', 'load_custom_wp_admin_style' );



/**
 *
 * ENQUEUE JAVASCRIPT FILES
 *
 */
function add_javascript()
{
  $app_base = get_template_directory_uri() . '/assets/js/core';

  if(is_page('rates')){
    wp_enqueue_script( 'ratesTables', get_template_directory_uri() . '/assets/static/js/ratesTable.js?v='. time(), array( 'jquery' ), null, false );
  }

  if (!is_admin()) {
    wp_enqueue_script(
      'jquery',
      '//ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js',
      null,
      true,
      null
    );
    wp_enqueue_script(
      'coreJS',
      get_template_directory_uri() . '/assets/static/js/core.js',
      array('jquery'),
      true,
      null
    );

    wp_localize_script('coreJS', 'core', array(
      'ajaxUrl' => get_template_directory_uri() . '/ajax.php',
      'baseUrl' => $app_base,
      'deps'    => array($app_base . '/core.js')
    ));

    
  }
}
add_action('wp_enqueue_scripts', 'add_javascript');



// ONLY NECESSARY FOR DECOUPLING JS SCRIPTS THAT ARE NOT NEEDED
function mgt_dequeue_styles_and_scripts()
{ }
//add_action( 'wp_enqueue_scripts', 'mgt_dequeue_stylesandscripts', 100 );
//add_filter( 'woocommerce_enqueue_styles', '__return_empty_array' );


/**
 *
 * TAKE GLOBAL DESCRIPTION OUT OF HEADER.PHP AND GENERATE IT FROM A FUNCTION
 *
 */
function site_global_description()
{
  global $page, $paged;
  wp_title('|', true, 'right');
}


/**
 * REMOVE UNWANTED CAPITAL <P> TAGS
 */
remove_filter('the_content', 'capital_P_dangit');
remove_filter('the_title', 'capital_P_dangit');
remove_filter('comment_text', 'capital_P_dangit');


/**
 * REGISTER NAV MENUS FOR HEADER FOOTER AND UTILITY
 */
register_nav_menus(array(
  'primary' => __('Primary Menu', 'themename'),
  'utility' => __('Utility Menu', 'themename'),
  'footer' => __('Footer Menu', 'themename'),
));


/**
 * DEFAULT COMMENTS & RSS LINKS IN HEAD
 */
add_theme_support('automatic-feed-links');


/**
 * THEME SUPPORTS THUMBNAILS
 */
add_theme_support('post-thumbnails');


/**
 *	THEME SUPPORTS EDITOR STYLES
 */
add_editor_style("/css/layout-style.css");


/**
 *	ADD TINY IMAGE SIZE FOR ACF FIELDS, BETTER USABILITY
 */
add_image_size('mini-thumbnail', 50, 50);

add_image_size('hotel-thumbnail', 200, 200);


/**
 *	REPLACE THE HOWDY
 */
function admin_bar_replace_howdy($wp_admin_bar)
{
  $account = $wp_admin_bar->get_node('my-account');
  $replace = str_replace('Howdy,', 'Welcome,', $account->title);
  $wp_admin_bar->add_node(array('id' => 'my-account', 'title' => $replace));
}
add_filter('admin_bar_menu', 'admin_bar_replace_howdy', 25);




// ADDS SUPPORT FOR CUSTOM EDITOR STYLES THAT LET CLIENTS USE THE WYSIWYG EDITOR BETTER. UNCOMMENT IF YOU NEED THEM.

//add_editor_style('css/editor-style.css');

function custom_tinymce_styles($settings)
{
  $style_formats = array(
    array(
      'title' => 'Huge Blue Text',
      'selector' => 'h1,h2,h3,h4,h5,h6',
      'classes' => 'huge blue ',
    ),
    array(
      'title' => 'Blue Text',
      'selector' => 'h1,h2,h3,h4,h5,h6',
      'classes' => 'blue',
    ),
    array(
      'title' => 'Gray Text',
      'selector' => 'h1,h2,h3,h4,h5,h6',
      'classes' => 'gray',
    ),
    array(
      'title' => 'White Text',
      'selector' => 'h1,h2,h3,h4,h5,h6',
      'classes' => 'white',
    )
  );

  $settings['style_formats'] = json_encode($style_formats);

  if (!isset($settings['extended_valid_elements'])) {
    $settings['extended_valid_elements'] = '';
  } else {
    $settings['extended_valid_elements'] .= ',';
  }

  if (!isset($settings['custom_elements'])) {
    $settings['custom_elements'] = '';
  } else {
    $settings['custom_elements'] .= ',';
  }

  $settings['extended_valid_elements'] .= 'div[class|id|style|data-animation|data-fx]';
  $settings['custom_elements']         .= 'div[class|id|style|data-animation|data-fx]';

  return $settings;
}
//add_filter( 'tiny_mce_before_init', 'custom_tinymce_styles' );

function add_tinymce_styles_dropdown($buttons)
{
  array_unshift($buttons, 'styleselect');
  return $buttons;
}
//add_filter('mce_buttons_2', 'add_tinymce_styles_dropdown');

function allow_data_attributes_in_tinymce()
{
  global $allowedposttags;

  $tags = array('div');
  $new_attributes = array('contenteditable' => array(), 'data-animation' => array(), 'data-fx' => array());

  foreach ($tags as $tag) {
    if (isset($allowedposttags[$tag]) && is_array($allowedposttags[$tag]))
      $allowedposttags[$tag] = array_merge($allowedposttags[$tag], $new_attributes);
  }
}
//add_action( 'init', 'allow_data_attributes_in_tinymce' );
