/**
 * "error 404" page behavior
 *
 * @author Viacheslav Lotsmanov
 * @license GNU/AGPLv3
 * @see {@link https://github.com/web-izmerenie/usadba-dev-sources/blob/master/LICENSE-AGPLv3|License}
 */

define(['jquery', 'get_val'], function ($, getVal) {
$(function domReady() {

	var $html = $('html');
	if (!$html.hasClass('error_404')) return;

	var $topSide = $('.top_side');
	var $h1 = $('h1');
	var h1pt = parseInt($h1.css('padding-top'), 10);

	function resizeHandler() {
		$h1.css('padding-top', '');
		$h1.css('padding-top', (($topSide.height() / 2)-60) + 'px');
	}

	$(window).on('resize', resizeHandler);
	resizeHandler();
	setTimeout(resizeHandler, 1);

}); // domReady()
}); // define()
