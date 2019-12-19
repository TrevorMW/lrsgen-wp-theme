<?php
/**
 * Template Name: Template - Generic
 * Description: Generic Sub Page Template
 *
 * @package WordPress
 * @subpackage themename
 */


get_header(); the_post(); ?>

<main class="reservationList">
  <?php do_action('displayReservations'); ?>
</main>

<?php get_footer(); ?>
