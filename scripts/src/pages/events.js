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

	$eventsList.each(function (i) {

		var $list = $(this);
		var $ul = $list.find('>ul');

		require(['ajax_pager'], function (ajaxPager) {

			ajaxPager({
				bindSuffix: '.events_ajax_page_loader_' + i,
				actionName: 'get_more_events',
				$loader: $list.find('.pagination .ajax_page_loader'),
				itemHandler: function (item, next) {

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
							next);
					}, 0);
				}
			});
		});
	});
});
