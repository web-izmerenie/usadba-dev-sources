/**
 * Panoramas blocks logic
 *
 * @author Viacheslav Lotsmanov
 * @license GNU/AGPLv3
 * @see {@link https://github.com/web-izmerenie/usadba-dev-sources/blob/master/LICENSE-AGPLv3|License}
 */

define(['jquery', 'get_val', 'get_local_text'], function ($, getVal, getLocalText) {

	// values
	var speed = getVal('animationSpeed') * 2;
	var ratio = getVal('panoramaRatio');
	var ratioBindSuffix = '.panorama_ratio_resize';

	return function ($panorama, $detailPicture) {

		// panorama block ratio resize {{{1
		(function isolate() {

			function handler() {
				$panorama.each(function () {
					$(this).css('height', ($(this).width() * ratio[1] / ratio[0]) + 'px');
				}); // $panorama.each()
			} // handler()

			$(window).on('resize' + ratioBindSuffix, handler);
			setTimeout(handler, 1);

		})(); // isolate()
		// panorama block ratio resize }}}1

		setTimeout(function () { // panorama init {{{1
			$panorama.each(function () {
				var $p = $(this);
				require(['sphere_panorama'], function (Panorama) {
					new Panorama(
						$p,
						{
							textureUrl: $p.attr('data-texture'),
							onlyWebGL: true,
						},
						function (err) {
							if (err) {
								/*require(['dialog_box_wrapper'], function (showDialogBox) {
									showDialogBox({ messages: [ getLocalText('err', 'panorama_init') ] });
								});*/

								// show detail picture instead of error

								if ($detailPicture.size() > 0) {
									$detailPicture.slideDown( speed );
								}

								$panorama.slideUp( speed );

								return;
							}
							this.animationLoop();
							$p.addClass('loaded');
						}
					);
				});
			});
		}, 1); // panorama init }}}1

		if ($panorama.size() <= 0 && $detailPicture.size() > 0) $detailPicture.slideDown( speed );

	}; // return ()

}); // define()
