<?php
/**
 * Template Name: Template - Generic
 * Description: Generic Sub Page Template
 *
 * @package WordPress
 * @subpackage themename
 */

get_header(); 
the_post(); ?>

<div class="ratesTable">
  <table>
    <thead>
      <tr>
        <th colspan="1"></th>
        <th colspan="2">Hotel</th>
        <th colspan="<?php do_action('roomTypesCount'); ?>">Rates</th>
      </tr>
      <tr>
        <th colspan="1"></th>
        <th colspan="1"></th>
        <th style="width:10%;"></th>
        <?php do_action('displayRoomTypeHeaders'); ?>
      </tr>
    </thead>
    
    <tbody>
      <?php do_action('displayRates'); ?>
    </tbody>
    
  </table>
</div>

<?php get_footer(); ?>
