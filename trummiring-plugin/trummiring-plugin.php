<?php
/**
 * Plugin Name: Trummiring Player
 * Plugin URI: https://github.com/mtiganik/trummiring-plugin
 * Description: Drum sequence player. Add [trummiring_app] anywhere you like so player will pop up
 * Version: 1.0.2
 * Author: Mihkel Tiganik
 * Author URI: https://kontorirott.ee
 * Update URI: https://github.com/mtiganik/trummiring-plugin
 * GitHub Plugin URI: mtiganik/trummiring-plugin
 */

if ( ! defined( 'ABSPATH' ) ) exit;

function trummiring_enqueue_scripts()
{
    $plugin_url  = plugin_dir_url(__FILE__);
    $plugin_path = plugin_dir_path(__FILE__);

    wp_enqueue_script(
        'trummiring-app',
        $plugin_url . 'dist/assets/index.js',
        [],
        filemtime($plugin_path . 'dist/assets/index.js'),
        true
    );
}
add_action('wp_enqueue_scripts', 'trummiring_enqueue_scripts');

function trummiring_render_app() {
    return '<div id="trummiring-root"></div>';
}
add_shortcode('trummiring_app', 'trummiring_render_app');
