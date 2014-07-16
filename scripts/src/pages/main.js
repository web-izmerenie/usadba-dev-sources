/**
 * "Main" page behavior
 *
 * @author Viacheslav Lotsmanov
 */

define(['jquery', 'get_val', 'jquery.easing'], function ($, getVal) {
$(function domReady() {

	if (!$('html').hasClass('main_page')) return;

	var $mainPage = $('section.main_page');
	var $card1 = $mainPage.find('.card.card_1');
	var $card1LogoWrap = $card1.find('.logo_wrap');
	var $card1ScrlDn = $card1.find('.scroll_down');
	var $window = $(window);
	var $document = $(document);
	var $page = $('html,body');
	var $video = $card1.find('video');
	var $card2 = $mainPage.find('.card.card_2');
	var $card2Bg = $card2.find('.background');
	var $card2Text = $card2.find('.text');

	var $backgrounds = $mainPage.find('.card .background, .card_1');

	var resizeCardsBindSuffix = '.main_page_resize_cards';
	var paralaxBindSuffix = '.main_page_paralax';

	var scrollDownSpeed = getVal('animationSpeed') * 6;

	$backgrounds.each(function () { // set backgrounds {{{1

		if ($(this).hasClass('card_1')) {
			$(this).css('background-image', 'url("'+ $(this).find('img.background').attr('src') +'")');
			return;
		}

		$(this).css('background-image', 'url("'+ $(this).find('img').attr('src') +'")');

	}); // set backgrounds }}}1

	// paralax {{{1

	var bgRatio = getVal('mainPageBackgroundsRatio');
	var paralaxVal = getVal('mainPageParalaxValue');

	$backgrounds.css('position', 'relative');

	function paralaxUpdate() { // {{{2

		var st = $document.scrollTop();
		var ww = $window.width();
		var wh = $window.height();

		var wr = bgRatio[0] * wh / bgRatio[1]; // width by ratio

		var ih = ww * wh / wr; // image height

		if (wr > ww) {
			var p = wr - ww;
			$backgrounds.css({
				'padding-left': (p/2)+'px',
				'padding-right': (p/2)+'px',
				'left': (-p)+'px'
			});
		} else {
			$backgrounds.css({
				'padding-left': 0,
				'padding-right': 0,
				'left': 0
			});
		}

		$backgrounds.each(function () {

			var $bg = $(this);

			var bt = $bg.offset().top;

			var lo = bt;
			var hi = bt + wh;

			var offset = paralaxVal * (st - lo) / hi;

			if (wr > ww) {
				ih = ww;
			} else if (!$bg.closest('.card').hasClass('card_2')) {
				// centering position
				offset += (ih - wh) / 2;
			}

			$bg.css('background-position', 'center '+(-offset)+'px');

		});

	} // paralaxUpdate() }}}2

	$window.on('scroll' + paralaxBindSuffix, paralaxUpdate);
	$window.on('resize' + paralaxBindSuffix, function () {
		setTimeout(paralaxUpdate, 1);
	});
	setTimeout(paralaxUpdate, 1);

	// paralax }}}1

	function resizeCards() { // {{{1
		$backgrounds.css('height', $window.height() + 'px');
		$card2Bg.css('height', ($window.height() - $card2Text.innerHeight()) + 'px');
		$video.each(function () {
			$video.css({ width: '', height: '', top: '' });
			if ($video.width() < $card1.width()) {
				$video.css({
					width: $card1.width() + 'px',
					height: 'auto'
				});
				$video.css('top', ( -(($video.height() - $card1.height()) / 2) ) + 'px');
			}
		});
	} // resizeCards }}}1

	var resizeCardsBind = $.proxy(setTimeout, null, resizeCards, 1);

	$window.on('resize' + resizeCardsBindSuffix, resizeCardsBind);
	resizeCardsBind();
	$window.on('load', resizeCardsBind);

	// video behavior {{{1

	function waitForVideoReady() {
		if ($video.width() > 0 && $video.height() > 0) {
			setTimeout(resizeCards, 1);
			$video.animate({opacity: 1}, getVal('animationSpeed')*2, function () {
				setTimeout(resizeCards, 1);
			});
			return;
		}
		setTimeout(waitForVideoReady, getVal('dynamicApiLoadInterval'));
	}

	if ($video.size() > 0) {
		require(['modernizr'], function (Modernizr) {
			if (!Modernizr.video) {
				$video.remove();
			} else {
				setTimeout(waitForVideoReady, getVal('dynamicApiLoadInterval'));
			}
		});
	}

	// video behavior }}}1

	setTimeout(function () { // scroll down {{{1

		var jitterTimer = null;
		var bottom = parseInt($card1ScrlDn.css('bottom'), 10);
		var speed = getVal('animationSpeed');
		var scrollDownBindSuffix = '.card_1_scroll_down';
		var curve = 'easeInOutSine';

		// .card_1 sroll down jitter {{{2

		$card1ScrlDn
			.on('mouseenter' + scrollDownBindSuffix, function () {
				$card1ScrlDn.addClass('hover');
			}).on('mouseleave' + scrollDownBindSuffix, function () {
				$card1ScrlDn.removeClass('hover');
			});

		jitterTimer = setInterval(function () {

			if ($card1ScrlDn.hasClass('hover')) return;

			$card1ScrlDn.stop().animate({
				'bottom': (bottom - getVal('card1ScrollDownJitterValue')) + 'px'
			}, speed, curve, function () {
				$card1ScrlDn.stop().animate({
					'bottom': (bottom + getVal('card1ScrollDownJitterValue')) + 'px'
				}, speed*2, curve, function () {
					$card1ScrlDn.stop().animate({
						'bottom': bottom + 'px'
					}, speed, curve);
				});
			});

		}, getVal('card1ScrollDownJitterInterval') * 1000);

		// .card_1 sroll down jitter }}}2

		$card1ScrlDn.click(function () { // scroll down on .card_1 button {{{2

			clearInterval(jitterTimer);
			$card1ScrlDn.stop().animate({ 'bottom': bottom + 'px' }, speed);

			$page.animate({
				scrollTop: $card1.height() + 'px'
			}, {
				duration: scrollDownSpeed,
				easing: 'easeInOutQuad'
			});

			return false;

		}); // scroll down on .card_1 button }}}2

	}, 1); // scroll down }}}1

}); // domReady()
}); // define()
