/**
 * "reviews" page behavior
 *
 * @author Viacheslav Lotsmanov
 * @license GNU/AGPLv3
 * @see {@link https://github.com/web-izmerenie/usadba-dev-sources/blob/master/LICENSE-AGPLv3|License}
 */

define(['jquery', 'get_local_text', 'get_val'],
function ($, getLocalText, getVal) {
$(function domReady() {

	var $section = $('section.reviews');

	if ($section.size() <= 0) return;

	$section.each(function (i) {

		var $s = $(this);
		var $form = $s.find('form.add_review');
		var $ul = $s.find('ul.reviews_book');

		require(['popup_form_init'], function (popupFormInit) {

			popupFormInit.call($form.get(0), 'add_review', null, [
				getLocalText('forms', 'write_a_review_success_1'),
				getLocalText('forms', 'write_a_review_success_2'),
			]);

			$s.find('.write_a_review').on('click', function () {
				require(['popup'], function (popup) {
					popup.show({ $container: $form });
				});
				return false;
			});

		}); // require(['popup_form_init'])

		require(['ajax_pager'], function (ajaxPager) {

			ajaxPager({
				bindSuffix: '.reviews_ajax_page_loader_' + i,
				actionName: 'get_more_reviews',
				$loader: $section.find('.pagination .ajax_page_loader'),
				itemHandler: function (item, next) {

					var $newEl = $('<li/>').css('opacity', 0);

					$newEl.append(item.text);

					var $sig = $('<div/>', { class: 'signature' });
					var $p = $('<p/>');
					$p.html(item.date +'<br/>'+ item.signature);
					$sig.html($p);
					$newEl.append($sig);

					$ul.append($newEl);

					setTimeout(function () {
						$newEl.stop().animate(
							{ opacity: 1 },
							getVal('animationSpeed'),
							next);
					}, 0);
				}
			});
		});

	}); // $section.each()

}); // domReady()
}); // define()
