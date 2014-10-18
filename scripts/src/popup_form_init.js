/**
 * popup form init handler
 *
 * @author Viacheslav Lotsmanov
 * @license GNU/AGPLv3
 * @see {@link https://github.com/web-izmerenie/usadba-dev-sources/blob/master/LICENSE-AGPLv3|License}
 */

define(['get_val', 'jquery', 'get_local_text'], function (getVal, $, getLocalText) {

	var focusClassBindSuffix = '.form_focus_class';
	var errorFieldBindSuffix = '.form_error_field';

	// export
	return function popupFormInit(actionName, dataToExtend, successMessagesArr) {

		var $form = $(this);
		var $inputs = $form.find('label.text, label.textarea, label.date');

		$form.detach().prependTo('body');

		require(['form_placeholder'], function (handler) {
			$inputs.each(handler);
		});

		$inputs.each(function () { // focus class {{{1

			var $label = $(this);

			function blur() { $label.removeClass('focused'); }
			function focus() { $label.addClass('focused'); }

			$label.find('input, textarea')
				.on('focus' + focusClassBindSuffix, focus)
				.on('blur' + focusClassBindSuffix, blur);

		}); // focus class }}}1

		// submit {{{1

		function ajaxReq(url, responseCallback, dataToSend, $form/*optional*/) { // {{{2

			if ($form) {
				if ($form.hasClass('ajax_process')) return false;
				$form.addClass('ajax_process');
			}

			function end() { if ($form) $form.removeClass('ajax_process'); }

			$.ajax({
				url: url,
				type: 'POST',
				cache: false,
				dataType: 'text',
				data: dataToSend,
				success: function (data) {
					require(['json_answer'], function (jsonAnswer) {
						jsonAnswer.validate(data, function (err, json) {
							if (err)
								responseCallback(err, null, end, jsonAnswer);
							else
								responseCallback(null, json, end, jsonAnswer);
						});
					});
				},
				error: function () {
					require(['dialog_box_wrapper'], function (showDialogBox) {
						showDialogBox({
							messages: [ getLocalText('err', 'forms', 'ajax_req') ],
							closeCallback: function () { end(); }
						});
					});
				}
			}); // $.ajax()

		} // ajaxReq() }}}2

		$form.submit(function () { // {{{2

			var url = $form.attr('action');
			var dataArr = $form.serializeArray();
			var dataObj = {};

			$.each(dataArr, function (i, val) {
				dataObj[val.name] = val.value;
			});

			ajaxReq(url, function (err, json, end, jsonAnswer) {
				require(['dialog_box_wrapper'], function (showDialogBox) {

					if (err) {
						if (err instanceof jsonAnswer.exceptions.ErrorStatus) {
							if (
								!$.isPlainObject(err.json) || (
									// check for incorrect type of "error_code"
									$.type(err.json.error_code) !== 'undefined' &&
									$.type(err.json.error_code) !== 'string'
								) || (
									// if has "error_code" but no "fields_names" or incorrect type
									$.type(err.json.error_code) === 'string' &&
									(!$.isArray(err.json.fields_names) || err.json.fields_names.length <= 0)
								)
							) {
								// parse error message
								showDialogBox({
									messages: [ getLocalText('err', 'forms', 'unknown_parse') ],
									closeCallback: function () { end(); },
								});
								return;
							}

							if (
								$.type(err.json.error_code) !== 'string' || (
									// unknown "error_code"
									err.json.error_code !== 'required_fields' &&
									err.json.error_code !== 'incorrect_fields'
								)
							) {
								// unknown server error
								showDialogBox({
									messages: [ getLocalText('err', 'forms', 'unknown_server_error') ],
									closeCallback: function () { end(); },
								});
								return;
							}

							$.each(err.json.fields_names, function (i, fieldName) {
								var $f = $form.find('input[name="'+ fieldName +'"], textarea[name="'+ fieldName +'"]');
								$f.each(function () { $f.closest('label').addClass('error'); });
								$f.on('focus' + errorFieldBindSuffix, function () {
									$(this).off('focus' + errorFieldBindSuffix).closest('label').removeClass('error');
								});
							});

							switch (err.json.error_code) {
							case 'required_fields':
								end();
								break;
							case 'incorrect_fields':
								showDialogBox({
									messages: [ getLocalText('err', 'forms', 'incorrect_fields') ],
									closeCallback: function () { end(); },
								});
								break;
							} // switch
						} else {
							// parse error message
							showDialogBox({
								messages: [ getLocalText('err', 'forms', 'unknown_parse') ],
								closeCallback: function () { end(); },
							});
						}
						return;
					}

					// success!
					showDialogBox({
						messages: successMessagesArr,
						closeCallback: function () {
							$form.find('input, textarea').val('').trigger('blur');

							if (actionName === 'reserve') {
								$form.find('ul.houses_chooser>li').removeClass('current');
								$form.find('ul.people_count_chooser>li').remove();
							}

							end();
							$form.find('.closer').trigger('click');
						},
					}, null, true);

				}); // require(['dialog_box_wrapper'])
			}, $.extend(dataObj, {
				action: actionName,
				lang: getVal('lang'),
			}, (dataToExtend || {})), $form); // ajaxReq()

			return false;

		}); // $form.submit() }}}2

		// submit }}}1

	}; // return

}); // define()
