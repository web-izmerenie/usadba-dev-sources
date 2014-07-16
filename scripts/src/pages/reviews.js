/**
 * "reviews" page behavior
 *
 * @author Viacheslav Lotsmanov
 */

define(['jquery', 'get_local_text'], function ($, getLocalText) {
$(function domReady() {

	var $section = $('section.reviews');

	if ($section.size() <= 0) return;

	$section.each(function () {

		var $s = $(this);
		var $form = $s.find('form.add_review');

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

	}); // $section.each()

}); // domReady()
}); // define()
