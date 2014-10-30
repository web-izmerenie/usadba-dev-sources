/**
 * "events" page behavior
 *
 * @author Viacheslav Lotsmanov
 * @license GNU/AGPLv3
 * @see {@link https://github.com/web-izmerenie/usadba-dev-sources/blob/master/LICENSE-AGPLv3|License}
 */

define(['jquery', 'get_val', 'get_local_text'],
function ($, getVal, getLocalText) {

	var $eventsList = $('.events_list');
	if ($eventsList.size() <= 0) return;

	var $d = $(document);
	var $w = $(window);

	$eventsList.each(function () {

		var $list = $(this);
		var $ul = $list.find('>ul');

		// ajax page loader logic {{{1
		setTimeout(function () {

			var $ajaxPageLoader = $list.find('.pagination .ajax_page_loader');

			var bindSuffix = '.events_ajax_page_loader';
			var actionName = 'get_more_events';

			var process = false;
			var finished = false;

			var count = parseInt($ajaxPageLoader.attr('data-count'), 10);
			var lastPage = 1;

			if (isNaN(count) || count < 1)
				throw new Error(
					'Incorrect count of items per page data- attribute.');

			function stop() {

				$ajaxPageLoader.removeClass('process');
				setTimeout(function () {

					process = false;
					scrollHandler();
				}, getVal('animationSpeed'));
			}

			function loadItemHook(i, items) {

				if (items.length <= i) return stop();

				var item = items[i++];

				var $newEl = $('<li/>').css('opacity', 0);
				var $h3 = $('<h3/>');
				var $link;

				if (item.link) {

					$link = $('<a/>', { href: item.link }).html(item.title);
					$h3.html($link);
				} else {

					$h3.html(item.title);
				}

				$newEl.append($h3);

				var $date = $('<div/>', { class: 'date' }).html(item.date);
				$newEl.append($date);

				var $img;
				if (item.picture) {

					$img = $('<img/>', {
						src: item.picture.src,
						alt: item.picture.description
					});
					$newEl.append($img);
				}

				var $text;
				if (item.text) {

					$text = $('<div/>', { class: 'text' }).html(item.text);
					$newEl.append($text);
				}

				$ul.append($newEl);

				setTimeout(function () {
					$newEl.stop().animate(
						{ opacity: 1 },
						getVal('animationSpeed'),
						$.proxy(loadItemHook, null, i, items));
				}, 0);
			}

			function successs(jsonAnswer, err, json, page) {

				if (err) {

					if (
						err instanceof
							jsonAnswer.exceptions.UnknownStatusValue &&
						err.json && err.json.status === 'end_of_list'
					) {

						finished = true;
						$w
							.off('scroll' + bindSuffix)
							.off('resize' + bindSuffix);

						if (!err.json.items) return;
						else json = err.json;
					} else {

						alert(
							getLocalText('ERR', 'AJAX') +
							'\n\n' + err.toString());

						return stop();
					}
				}

				if (!$.isArray(json.items)) {

					alert(getLocalText('ERR', 'AJAX_PARSE'));
					return stop();
				}

				lastPage = page;
				loadItemHook(0, json.items);
			}

			function error() {

				alert(getLocalText('ERR', 'AJAX'));
				stop();
			}

			function load() {

				if (process || finished) return false;
				else process = true;

				$ajaxPageLoader.addClass('process');

				var page = lastPage + 1;

				$.ajax({
					url: getVal('ajaxHandlerURL'),
					type: 'POST',
					cache: false,
					dataType: 'text',
					data: {
						action: actionName,
						lang: getVal('lang'),
						count: count,
						page: page
					},
					success: function (data) {
						require(['json_answer'], function (jsonAnswer) {
							jsonAnswer.validate(data, function (err, json) {
								successs(jsonAnswer, err, json, page);
							});
						});
					},
					error: error
				});
			}

			function scrollHandler() {

				if (process || finished) return false;

				if (
					$d.scrollTop() + $w.height() >=
					$ajaxPageLoader.offset().top
				)
					load();
			}

			$w
				.on('scroll' + bindSuffix, scrollHandler)
				.on('resize' + bindSuffix, scrollHandler);

			scrollHandler();
		}, 0);
		// ajax page loader logic }}}1
	});
});
