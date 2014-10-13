/**
 * "homestead" page behavior
 *
 * @author Viacheslav Lotsmanov
 * @license GNU/AGPLv3
 * @see {@link https://github.com/web-izmerenie/usadba-dev-sources/blob/master/LICENSE-AGPLv3|License}
 */

define(['jquery', 'get_val'], function ($, getVal) {
$(function domReady() {

	var $html = $('html');
	if (!$html.hasClass('homestead_page')) return;

	var $swrap = $('.section_wrap');

	var resizeRoomsBindSuffix = '.resize_rooms';

	$swrap.find('section.homestead').each(function () { // {{{1

		var $sect = $(this);
		var $nav = $sect.find('nav.rooms');
		var $rooms = $nav.find('>a');

		(function isolate() { // resize rooms names {{{2

			var $names = $rooms.find('>span');

			var namePaddL = parseInt($names.eq(0).css('padding-left'), 10);
			var namePaddR = parseInt($names.eq(0).css('padding-right'), 10);
			var namePadd = namePaddL + namePaddR;

			function resize() {
				$(window).trigger('resize' + resizeRoomsBindSuffix);
				$names.each(function () {
					var $span = $(this);
					var $inside = $span.find('>span');
					var srcW = $inside.width();
					$span.css('width', '');
					$span.css('width', (srcW + namePadd) + 'px');
				});
			} // resize()

			$(window).on('load', $.proxy(setTimeout, null, resize, 1));
			setTimeout(resize, 1);

		})(); // resize rooms names }}}2

		(function isolate() { // resize rooms {{{2

			var picS = 74;
			var min = picS + 28;
			var max = picS + 50;
			var minW = getVal('minWidth');
			var maxW = getVal('maxWidth');

			// low
			var loMax = max - min;
			var loMaxW = maxW - minW;

			function resize() {
				var w = $(window).width();
				if (w < minW) w = minW;
				if (w > maxW) w = maxW;
				w -= minW;
				$rooms.css('width', '');
				$rooms.css('width', Math.floor(((w * loMax) / loMaxW) + min) + 'px');
			} // resize()

			$(window).on('resize' + resizeRoomsBindSuffix, resize);
			setTimeout(resize, 1);

		})(); // resize rooms }}}2

	}); // $('section.homestead').each() }}}1

	$swrap.find('.columns').each(function () { // {{{1

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
