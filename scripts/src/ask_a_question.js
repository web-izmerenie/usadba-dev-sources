/**
 * "ask a question" form
 *
 * @author Viacheslav Lotsmanov
 * @license GNU/AGPLv3
 * @see {@link https://github.com/web-izmerenie/usadba-dev-sources/blob/master/LICENSE-AGPLv3|License}
 */

define(['jquery', 'get_local_text'], function ($, getLocalText) {
$(function domReady() {

	$('form.add_question').each(function () {

		var $form = $(this);

		require(['popup_form_init'], function (popupFormInit) {

			popupFormInit.call($form.get(0), 'add_question', null, [
				getLocalText('forms', 'ask_a_question_success_1'),
				getLocalText('forms', 'ask_a_question_success_2'),
			]);

			$('a.ask_a_question').on('click', function () {
				require(['popup'], function (popup) {
					popup.show({ $container: $form });
				});
				return false;
			});

		}); // require(['popup_form_init'])

	}); // $section.each()

}); // domReady()
}); // define()
