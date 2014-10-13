/**
 * "Nature" page behavior
 *
 * @author Viacheslav Lotsmanov
 * @license GNU/AGPLv3
 * @see {@link https://github.com/web-izmerenie/usadba-dev-sources/blob/master/LICENSE-AGPLv3|License}
 */

define(['get_val', 'jquery'], function (getVal, $) {
$(function domReady() {

	// values
	var elLineCount = 3;
	var minElDistanceX = 70; // must be same as in styles/src/pages/nature.less
	var maxElDistanceX = 100;
	var loMaxElDistanceX = maxElDistanceX - minElDistanceX;
	var minElDistanceY = 50; // must be same as in styles/src/pages/nature.less
	var maxElDistanceY = 75;
	var loMaxElDistanceY = maxElDistanceY - minElDistanceY;
	var maxElSize = 344;
	var minElSize; // will be getted by start width value of first element
	var loMaxElSize; // maxElSize - minElSize
	var relativeMinWidth = 980;
	var relativeMaxWidth = 1480;
	var relativeLoMaxWidth = relativeMaxWidth - relativeMinWidth;

	var $html = $('html');
	var $wrap = $('section.nature');

	if (!$html.hasClass('nature_page') || $wrap.size() <= 0) return;

	$wrap.each(function () { // {{{1

		var $wrap = $(this);
		var $list = $wrap.find('ul.list');
		var $elems = $list.find('>li');
		var $pics = $elems.find('dl>dt img');
		var $elemsNoMargin = $list.find('>li:first, >li:nth-child(3n+4)');
		var $elemsMargin = $elems.not($elemsNoMargin);

		(function isolate() { // resize elements {{{2

			if ($pics.size() <= 0) return;

			var bindSuffix = '.nature_elements_resize';

			minElSize = $pics.eq(0).width();
			loMaxElSize = maxElSize - minElSize;

			function resizeHandler() { // {{{3

				// reset
				$list.css('width', '');
				$pics.css({ width: '', height: '' });
				$list.css('padding-bottom', '');
				$elems.css('margin-top', '');

				// page width
				var w = $wrap.width();
				if (w < relativeMinWidth) w = relativeMinWidth;
				if (w > relativeMaxWidth) w = relativeMaxWidth;
				w -= relativeMinWidth; // lo

				var wp = w * 100 / relativeLoMaxWidth; // percent by page width
				var size = Math.round((wp * loMaxElSize / 100) + minElSize);
				var distanceX = Math.round((wp * loMaxElDistanceX / 100) + minElDistanceX);
				var distanceY = Math.round((wp * loMaxElDistanceY / 100) + minElDistanceY);

				$list.css('width', ((size * elLineCount) + (distanceX * (elLineCount - 1))) + 'px');
				$pics.css({
					width: size + 'px',
					height: size + 'px',
					'border-radius': Math.round(size/2) + 'px',
				});
				$elemsMargin.css('margin-left', distanceX + 'px');
				$list.css('padding-bottom', distanceY + 'px');
				$elems.css('margin-top', distanceY + 'px');

			} // resizeHandler() }}}3

			$(window).on('resize' + bindSuffix, resizeHandler);
			resizeHandler();
			setTimeout(resizeHandler, 1);

		})(); // resize elements }}}2

		// resize height
		require(['section_block_resize'], function (handler) {
			$wrap.each(function () {
				handler.call(this, { minusH1: true, minusMenuLeftTop: true });
			});
		});

		$pics.on('click', function () { // {{{2
			var $pic = $(this);
			var $popup = $pic.closest('li').find('.nature_detail');
			if ($popup.size() <= 0) return false;

			var resizeBindSuffix = '.nature_detail_resize';

			function resizeHandler() { // {{{3
				function resize() {
					if (!$popup.hasClass('scrolling_y'))
						$popup.css('margin-top', -Math.round($popup.innerHeight() / 2) + 'px');
				}
				resize(); setTimeout(resize, 1);
			} // resizeHandler() }}}3

			require(['popup'], function (popup) {
				popup.show({
					$container: $popup,
					preShowCallback: function () {
						$(window).on('resize' + resizeBindSuffix, resizeHandler);
						resizeHandler();
					},
					closerCallback: function () {
						$(window).off('resize' + resizeBindSuffix);
					},
				});
			});

			return false;
		}); // $pics.on('click'... }}}2

	}); // $wrap.each(... }}}1

}); // domReady()
}); // define()
