/**
 * "grayscaleImg" wrapper for abstraction
 *
 * @author Viacheslav Lotsmanov
 * @license GNU/AGPLv3
 * @see {@link https://github.com/web-izmerenie/usadba-dev-sources/blob/master/LICENSE-AGPLv3|License}
 */

define(function () {
	function grayImg(src, cb) {
		require(['grayscale_img', 'get_local_text'],
		function (grayscaleImg, getLocalText) {
			grayscaleImg(src, function (err, dataURL) {
				if (err) {
					require(['load_img'], function (loadImg) {
						if (err instanceof loadImg.exceptions.Timeout) {
							// retry
							setTimeout(function () {
								grayImg(src, cb);
							}, 0);
						} else {
							alert(
								getLocalText('err', 'limited_functional') + '\n\n' +
								getLocalText('err', 'recommend_update_your_browser')
							);
						}
					});
					return;
				}

				setTimeout(function () {
					cb(dataURL);
				}, 0);
			});
		});
	}

	return grayImg;
});
