<?php
/**
 * Plugin Name: Trummiring Player
 * Plugin URI: https://github.com/mtiganik/trummiring-plugin
 * Description: Drum sequence player built with React/Vite.
 * Version: 1.0.1
 * Author: Mihkel Tiganik
 * Author URI: https://kontorirott.ee
 * Update URI: https://github.com/mtiganik/trummiring-plugin
 * GitHub Plugin URI: mtiganik/trummiring-plugin
 */

if ( ! defined( 'ABSPATH' ) ) exit;

function trummiring_enqueue_scripts() {
    $plugin_dir = plugin_dir_path(__FILE__);
    $plugin_url = plugin_dir_url(__FILE__);
    $asset_dir = $plugin_dir . 'dist/assets/';

    // Find JS file
    $js_files = glob($asset_dir . 'index-*.js');
    $css_files = glob($asset_dir . 'index-*.css');

    if (!empty($js_files)) {
        $js_file = basename($js_files[0]);
        wp_enqueue_script(
            'trummiring-app',
            $plugin_url . 'dist/assets/' . $js_file,
            [],
            filemtime($asset_dir . $js_file),
            true
        );
    }

    if (!empty($css_files)) {
        $css_file = basename($css_files[0]);
        wp_enqueue_style(
            'trummiring-style',
            $plugin_url . 'dist/assets/' . $css_file,
            [],
            filemtime($asset_dir . $css_file)
        );
    }
}
add_action('wp_enqueue_scripts', 'trummiring_enqueue_scripts');

// Add shortcode to display app
function trummiring_render_app() {
    return '<div id="trummiring-root"></div>';
}
add_shortcode( 'trummiring_app', 'trummiring_render_app' );
