<?php
/**
 * @package WordPress
 * @subpackage themename
 */
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
<meta charset="<?php bloginfo( 'charset' ); ?>" />
<title><?php echo site_global_description(); ?></title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="shortcut icon" href="<?php echo get_template_directory_uri(); ?>/assets/media/favicon.ico">
<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>

	<div class="wrapper headerBar">
		<header class="table">
			<div class="tableCell fifth logoBox">
				<img src="<?php echo get_template_directory_uri() ?>/assets/static/images/pineapple.png" alt=""/>
				<h1>LRSGEN</h1>
			</div>

			<div class="tableCell fourFifths toolbar">
				<?php if( !is_front_page()){ ?>
					<div class="utilityFuzzySearch">
						<form class="inlineForm" data-fuzzy-search>
							<input type="search" placeholder="Search <?php echo the_title()?>...">
						</form>
					</div>
				<?php } ?>
			</div>
		</header>
	</div>

	<div class="wrapper mainDashboard">
		<div class="table">

			<div class="tableCell fifth leftColumn">
				<nav class="main-nav">
					<?php wp_nav_menu(array(
						'menu'           => 'primary',
						'theme_location' => 'primary',
						'container'      => false,
						'items_wrap'     => '%3$s',
						'depth'          => 0
					)) ?>
				</nav>
			</div>
	
			<div class="tableCell fourFifths rightColumn">
				<?php if( !is_front_page()){ ?>
					<div class="table subUtilityBar">
						<div class="tableCell half">
							<h2><?php echo $post->post_title; ?></h2>
						</div>
						<div class="tableCell half">
							<nav>
								<ul>
									<li><a href=""><i class="fa fa-th"></i></a></li>
									<li><a href=""><i class="fa fa-list"></i></a></li>
								</ul>
							</nav>
							
						</div>
					</div>
				<?php } ?>
				