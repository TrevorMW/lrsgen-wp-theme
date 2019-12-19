<?php
/**
 * Template Name: Hotels Page Template
 * Description: Generic Sub Page Template
 *
 * @package WordPress
 * @subpackage themename
 */

get_header(); the_post(); ?>

<main class="hotelList">
  <?php do_action('displayHotels', $post->ID); ?>
</main>

<?php get_footer(); ?>
