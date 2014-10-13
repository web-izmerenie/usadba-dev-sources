/**
 * Dialog Box wrapper (abstraction)
 *
 * @author Viacheslav Lotsmanov
 * @license GNU/AGPLv3
 * @see {@link https://github.com/web-izmerenie/usadba-dev-sources/blob/master/LICENSE-AGPLv3|License}
 */

define(['jquery', 'get_val', 'get_local_text', 'dialog_box'], function ($, getVal, getLocalText, DialogBox) {

	function showDialogBox(paramsToExtend, callback, firstMsgAsTitle) { // {{{1

		var boxTpl = getVal('dialogBoxTpl');

		if (firstMsgAsTitle)
			boxTpl = boxTpl.replace(/#TITLE_CLASS_FLAG#/g, 'first_msg_as_title');
		else
			boxTpl = boxTpl.replace(/#TITLE_CLASS_FLAG#/g, '');

		$(function domReady() {
			$('html').queue(function (freeQueue) {
				new DialogBox($.extend({

					type: DialogBox.type.message,
					templates: { dialogBox: boxTpl },
					closeOutOfBox: true,
					closeOutOfBoxExcludeSelector: getVal('dialogBoxCloseExclude'),
					destroyCallback: function () { freeQueue(); },

				}, paramsToExtend || {}), function (err) {

					if (err) alert(getLocalText('err', 'dialog_box') +'\n\n'+ err.toString());

					if (callback) callback.call(this);

				}); // new DialogBox()
			}); // $('html').queue
		}); // domReady()

	} // showDialogBox() }}}1

	showDialogBox.DialogBox = DialogBox;

	return showDialogBox;

}); // define()
