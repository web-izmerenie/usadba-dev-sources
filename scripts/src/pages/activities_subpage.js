/**
 * "activities" sub-page behavior
 *
 * @author Viacheslav Lotsmanov
 * @license GNU/AGPLv3
 * @see {@link https://github.com/web-izmerenie/usadba-dev-sources/blob/master/LICENSE-AGPLv3|License}
 */

define(['jquery', 'get_val', 'get_local_text'], function ($, getVal, getLocalText) {
$(function domReady() {

	if (!$('html').hasClass('activities_subpage')) return;

	var $activeActivities = $('.section_wrap .activities_nav_block nav.activities_menu > span');

	$activeActivities.each(function () { // {{{1

		var $activity = $(this);
		var $img = $activity.find('img');

		var src = $img.attr('src');

		function toGray() {
			require(['grayscale_img'], function (grayscaleImg) {
				grayscaleImg(src, function (err, dataURL) {
					if (err) {
						require(['load_img'], function (loadImg) {
							if (err instanceof loadImg.exceptions.Timeout) {
								// retry
								toGray();
							} else {
								// annoying by customer
								/*alert(
									getLocalText('err', 'limited_functional') + '\n\n' +
									getLocalText('err', 'recommend_update_your_browser')
								);*/
							}
						});
						return;
					}

					$img.attr('src', dataURL);
				});
			});
		} // toGray()

		toGray();

	}); // $activeActivities.each() // }}}1

	var $photos = $('.section_wrap main ul.photos li a');

	// photogallery
	if ($photos.size() > 0) {
		require(['jquery.colorbox'], function () {
			$photos.colorbox(getVal('galleryColorboxParams'));
		});
	}

}); // domReady()
}); // define()
