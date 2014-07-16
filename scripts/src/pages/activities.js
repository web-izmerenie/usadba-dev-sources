/**
 * "activities" page behavior
 *
 * @author Viacheslav Lotsmanov
 */

define(['get_val', 'jquery'], function (getVal, $) {
$(function domReady() {

	var $html = $('html');

	if (!$html.hasClass('activities_page')) return;

	$('.section_wrap .columns').each(function () { // {{{1

		var $columnsBlock = $(this);

		(function isolate() { // set background {{{2

			var bg = $columnsBlock.attr('data-background');
			if (!bg) return;

			$columnsBlock.css('background-image', 'url("'+ bg +'")');

		})(); // set background }}}2

		// resize height
		require(['section_block_resize'], function (handler) {
			$columnsBlock.each(handler);
		});

	}); // .columns $.each() }}}1

}); // domReady()
}); // define()
