/**
 * "events" page behavior
 *
 * @author Viacheslav Lotsmanov
 * @license GNU/AGPLv3
 * @see {@link https://github.com/web-izmerenie/usadba-dev-sources/blob/master/LICENSE-AGPLv3|License}
 */

define(['jquery', 'get_val', 'get_local_text'],
function ($, getVal, getLocalText) {

	var $w = $(window);
	var $d = $(document);

	function stop(params) {

		params.$loader.removeClass('process');
		setTimeout(function () {

			params.process = false;
			scrollHandler(params);
		}, getVal('animationSpeed'));
	}

	function loadItemHook(params, i, items) {

		if (items.length <= i) return stop(params);

		params.itemHandler(
			items[i++],
			$.proxy(loadItemHook, null, params, i, items));
	}

	function successs(params, jsonAnswer, err, json, page) {

		if (err) {

			if (
				err instanceof
					jsonAnswer.exceptions.UnknownStatusValue &&
				err.json && err.json.status === 'end_of_list'
			) {

				params.finished = true;
				$w
					.off('scroll' + params.bindSuffix)
					.off('resize' + params.bindSuffix);

				if (!err.json.items) return stop(params);
				else json = err.json;
			} else {

				alert(
					getLocalText('ERR', 'AJAX') +
					'\n\n' + err.toString());

				return stop(params);
			}
		}

		if (!$.isArray(json.items)) {

			alert(getLocalText('ERR', 'AJAX_PARSE'));
			return stop(params);
		}

		params.lastPage = page;
		loadItemHook(params, 0, json.items);
	}

	function error(params) {

		alert(getLocalText('ERR', 'AJAX'));
		stop(params);
	}

	function load(params) {

		if (params.process || params.finished) return false;
		else params.process = true;

		params.$loader.addClass('process');

		var page = params.lastPage + 1;

		$.ajax({
			url: getVal('ajaxHandlerURL'),
			type: 'POST',
			cache: false,
			dataType: 'text',
			data: {
				action: params.actionName,
				lang: getVal('lang'),
				count: params.count,
				page: page
			},
			success: function (data) {
				require(['json_answer'], function (jsonAnswer) {
					jsonAnswer.validate(data, function (err, json) {
						successs(params, jsonAnswer, err, json, page);
					});
				});
			},
			error: function () {
				error(params);
			}
		});
	}

	function scrollHandler(params) {

		if (params.process || params.finished) return false;

		if (
			$d.scrollTop() + $w.height() >=
			params.$loader.offset().top
		)
			load(params);
	}

	return function init(params) {

		params = $.extend({
			// required
			bindSuffix: null,
			actionName: null,
			$loader: null,

			// optional
			process: false,
			finished: false,
			count: null,
			lastPage: 1
		}, params);

		if (
			!params.bindSuffix ||
			!params.actionName ||
			!params.$loader || params.$loader.size() <= 0
		)
			throw new Error('Are you insane? Required params is missing!');

		if (params.count === null) {

			params.count = parseInt(params.$loader.attr('data-count'), 10);

			if (isNaN(params.count) || params.count < 1)
				throw new Error(
					'Incorrect count of items per page "data-count" attribute.');
		}

		var handler = $.proxy(scrollHandler, null, params);

		$w
			.on('scroll' + params.bindSuffix, handler)
			.on('resize' + params.bindSuffix, handler);

		params.$loader.on('click' + params.bindSuffix, handler);

		handler();
	};
});
