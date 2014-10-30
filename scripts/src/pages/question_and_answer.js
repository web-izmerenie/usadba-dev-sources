/**
 * "question and answer" page behavior
 *
 * @author Viacheslav Lotsmanov
 * @license GNU/AGPLv3
 * @see {@link https://github.com/web-izmerenie/usadba-dev-sources/blob/master/LICENSE-AGPLv3|License}
 */

define(['jquery', 'get_val'],
function ($, getVal) {

	var $section = $('section.question_and_answer');
	if ($section.size() <= 0) return;

	$section.each(function (i) {

		var $section = $(this);
		var $ul = $section.find('>ul');

		require(['ajax_pager'], function (ajaxPager) {

			ajaxPager({
				bindSuffix: '.qna_ajax_page_loader_' + i,
				actionName: 'get_more_qna',
				$loader: $section.find('.pagination .ajax_page_loader'),
				itemHandler: function (item, next) {

					var $newEl = $('<li/>').css('opacity', 0);

					var $dl = $('<dl/>');

					var $dt = $('<dt/>').html(item.question);
					var $dd = $('<dd/>').html(item.answer);

					$dl.append($dt).append($dd);
					$newEl.append($dl);

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
	});
});
