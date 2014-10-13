/**
 * Popup module
 *
 * @author Viacheslav Lotsmanov
 * @license GNU/AGPLv3
 * @see {@link https://github.com/web-izmerenie/usadba-dev-sources/blob/master/LICENSE-AGPLv3|License}
 */

define(['get_val', 'jquery'], function (getVal, $) {

	var exports = {};

	// helpers {{{1

	function inherit(proto) {
		if (Object.create) return Object.create(proto);
		function F() {}
		F.prototype = proto;
		return new F();
	}

	function makeError(exception, callback) {
		if (callback) {
			setTimeout($.proxy(callback, null, exception), 1);
			return true;
		}
		throw exception;
	}

	// helpers }}}1

	var htmlClassName = 'popup';
	var contentClassName = 'popup_content';
	var overflowClassName = 'popup_overflow';

	var $overflow = $('<div/>', { class: overflowClassName });
	var $html = null;
	var $body = null;

	function renderTpl(params, tpl) {
		tpl = tpl.replace(/#CLASSNAME#/g, params.closerClassName);
		return tpl;
	} // renderTpl()

	exports.show = function (params, callback) { // {{{1

		if ($('html').hasClass( htmlClassName )) {
			makeError(new exports.exceptions.AnotherAlreadyOpened(), callback);
			return false;
		}

		// validate params {{{2

		var tmpParamName;

		tmpParamName = '$container';
		if (!(params[tmpParamName] instanceof jQuery)) {
			makeError(new exports.exceptions.IncorrectParameter(
				null, tmpParamName, typeof params[tmpParamName], 'jQuery-object'), callback);
			return false;
		}

		tmpParamName = 'tplCloser';
		if (tmpParamName in params && typeof params[tmpParamName] !== 'string') {
			makeError(new exports.exceptions.IncorrectParameter(
				null, tmpParamName, typeof params[tmpParamName], 'string'), callback);
			return false;
		}

		tmpParamName = 'closerCallback';
		if (tmpParamName in params && !(params[tmpParamName] instanceof Function)) {
			makeError(new exports.exceptions.IncorrectParameter(
				null, tmpParamName, typeof params[tmpParamName], 'function'), callback);
			return false;
		}

		tmpParamName = 'closerClassName';
		if (tmpParamName in params && typeof params[tmpParamName] !== 'string') {
			makeError(new exports.exceptions.IncorrectParameter(
				null, tmpParamName, typeof params[tmpParamName], 'string'), callback);
			return false;
		}

		tmpParamName = undefined;

		// validate params }}}2

		var $closer = null;
		var closingProcess = false;

		params = $.extend({
			$container: null,
			tplCloser: '<a class="#CLASSNAME#"></a>', // [optional]
			closerCallback: null, // [optional]
			closerClassName: 'closer', // [optional]
			bindSuffix: '.popup_bind', // [optional]
			preShowCallback: null, // [optional]
		}, (params || {}));

		if (!$html) {
			$html = $('html');
			$body = $('body');
			$body.prepend($overflow);
		}

		$overflow.css({ opacity: 0, display: 'block' });
		$html.addClass( htmlClassName );
		$closer = params.$container.find('.' + params.closerClassName);
		if ($closer.size() <= 0) {
			params.$container.prepend( renderTpl(params, params.tplCloser) );
			$closer = params.$container.find('.' + params.closerClassName);
		}

		function close() { // {{{2

			if (closingProcess) return false; else closingProcess = true;

			if (params.closerCallback) if (params.closerCallback() === false) return false;

			var count = 0;

			$(document).off('click' + params.bindSuffix);
			$closer.off('click' + params.bindSuffix);

			var $toHide = $();
			$.merge($toHide, $overflow);
			$.merge($toHide, params.$container);

			$toHide.stop().animate({ opacity: 0 }, getVal('animationSpeed'), function () {
				$(this).css('display', 'none');
				count++;
				if (this === params.$container.get(0))
					params.$container.removeClass( contentClassName );
				if (count >= 2) $html.removeClass( htmlClassName );
			});

			return false;

		} // close() }}}2

		function docClickHandler(event) { // {{{2

			if (closingProcess || $html.hasClass('dialog_box')) return true;

			var x = params.$container.offset().left;
			var y = params.$container.offset().top;
			var w = params.$container.innerWidth();
			var h = params.$container.innerHeight();

			// hell IE
			if (event.pageX < 0 || event.pageY < 0) return true;

			if (
				!(event.pageX >= x && event.pageX <= x+w) ||
				!(event.pageY >= y && event.pageY <= y+h)
			) {
				close();
				return false;
			}

			return true;

		} // docClickHandler() }}}2

		$overflow.stop().animate({ opacity: 1 }, getVal('animationSpeed'));

		function scrollResize() { // {{{2
			var ww = $(window).width() - 40;
			var wh = $(window).height() - 40;

			// reset
			params.$container.css({
				width: '',
				'margin-left': '',
				height: '',
				'margin-top': '',
			}).removeClass('scrolling_x').removeClass('scrolling_y');

			if (params.$container.innerWidth() > ww) {
				params.$container.css({
					width: ww + 'px',
					'margin-left': -(ww / 2) + 'px',
				}).addClass('scrolling_x');
			}

			if (params.$container.innerHeight() > wh) {
				params.$container.css({
					height: wh + 'px',
					'margin-top': -(wh / 2) + 'px',
				}).addClass('scrolling_y');
			}
		} // scrollResize() }}}2

		$(window).on('resize', scrollResize);

		params.$container.stop().css({
			opacity: 0,
			display: 'block'
		}).addClass( contentClassName );

		scrollResize();
		setTimeout(scrollResize, 1);
		if (params.preShowCallback) params.preShowCallback.call(this);

		params.$container.animate({
			opacity: 1
		}, getVal('animationSpeed'), function () {
			$(document).on('click' + params.bindSuffix, docClickHandler);
			$closer.on('click' + params.bindSuffix, close);
		});

	}; // exports.show() }}}1

	// exceptions {{{1

	exports.exceptions = {};

	exports.exceptions.AnotherAlreadyOpened =
	function (message) {
		Error.call(this);
		this.name = 'AnotherAlreadyOpened';
		this.message = message || 'Another popup is already opened.';
	};

	exports.exceptions.IncorrectParameter =
	function (message, paramName, paramType, paramMustBeType) {
		Error.call(this);
		this.name = 'IncorrectParameter';
		if (message) {
			this.message = message;
		} else {
			this.message = 'Incorrect parameter';
			if (paramName) this.message += ' "'+ paramName +'"';
			if (paramType) this.message += ' (type: "'+ paramType +'")';
			if (paramMustBeType) this.message += ', must be a "'+ paramMustBeType +'"';
			this.message += '.';
		}
	};

	for (var key in exports.exceptions) {
		exports.exceptions[key].prototype = inherit(Error.prototype);
	}

	// exceptions }}}1

	return exports;

}); // define()
