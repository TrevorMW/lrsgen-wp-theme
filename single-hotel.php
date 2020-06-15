<?php
/**
 * @package WordPress
 * @subpackage themename
 */

get_header(); the_post(); ?>

<div class="primary">
    <article class="hotel individual-hotel" role="article">
      <header class="entry-header">
        <h1 class="entry-title" role="heading"><?php //the_title(); ?></h1>
      </header>
      
      <div class="entry-content">
        <?php the_content(); ?>
      </div>

      <div data-google-map data-google-map-options="{'test':'variable'}"></div>
    </article>
</div>

<?php get_footer(); ?>
