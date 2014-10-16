/**
 * "homestead" sub-page behavior
 *
 * @author Viacheslav Lotsmanov
 * @license GNU/AGPLv3
 * @see {@link https://github.com/web-izmerenie/usadba-dev-sources/blob/master/LICENSE-AGPLv3|License}
 */

define(['jquery', 'get_val', 'get_local_text', 'gray_img'],
function ($, getVal, getLocalText, grayImg) {
$(function domReady() {

	if (!$('html').hasClass('homestead_subpage')) return;

	var $s = $('.section_wrap');
	var $main = $s.find('main');

	var $quantity = $main.find('.prices .quantity');
	var $activeRooms = $s.find('.sub_menu_line nav.rooms > span');
	var $panorama = $main.find('.panorama');
	var $detailPicture = $main.find('.detail_picture');
	var $gallery = $main.find('.photogallery');

	function fill() { // {{{1
		$quantity.each(function () {

			var $q = $(this);
			var $f = $q.find('.fill');
			var $u = $q.find('.unit');

			var w = $q.width();
			var uw = $u.eq(0).width() + parseInt($u.eq(0).css('margin-right'), 10);
			var uall = uw * $u.size();
			var avalW = w - uall;

			$f.css('margin-left', '').text('');

			while ($f.width() < avalW) {
				$f.append('.');
			}

			$f.text( $f.text().slice(0, -1) );
			$f.css('margin-left', (avalW - $f.width()) + 'px');

		});
	} // fill() }}}1

	$(window).load(function () { setTimeout(fill, 1); });
	setTimeout(fill, 1);

	$activeRooms.each(function () { // {{{1

		var $room = $(this);
		var $img = $room.find('img');

		var src = $img.attr('src');

		grayImg(src, function (dataURL) {
			$img.attr('src', dataURL);
		});

	}); // $activeRooms.each() // }}}1

	// photogallery
	require(['new_gallery'], function (handler) {
		$gallery.each(handler);
	});

	require(['panorama_blocks'], function (handler) {
		handler($panorama, $detailPicture);
	});

}); // domReady()
}); // define()
