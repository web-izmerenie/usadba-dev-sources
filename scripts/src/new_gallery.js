/**
 * New photogallery initialize handler
 *
 * @author Viacheslav Lotsmanov
 * @license GNU/AGPLv3
 * @see {@link https://github.com/web-izmerenie/usadba-dev-sources/blob/master/LICENSE-AGPLv3|License}
 */

define(['jquery', 'get_val', 'gray_img'],
function ($, getVal, grayImg) {
	return function () {
		var $super = $(this);
		var $big = $super.find('.new_gallery_big');
		var $slider = $big.find('.slider');
		var $prev = $big.find('.prev');
		var $next = $big.find('.next');
		var $list = $super.find('ul.new_gallery_list');
		var $listEls = $list.find('>li');

		var process = false;
		var current = -1;

		function remove() { $(this).remove(); }

		function preload(index) { // {{{1
			if (index < 0) return;

			var $el = $listEls.eq(index);
			if ($el.data('loaded')) return;

			$('<img/>').load(function () {
				$el.data('loaded', true);
				$(this).remove();
			}).attr('src', $el.find('a').attr('href'));
		} // preload() }}}1

		/**
		 * @param {string|number} step - String of action ('next' or 'prev') or specific index of <li>
		 */
		function setActive(step) { // {{{1
			if (process) return; else process = true;

			if ($listEls.size() < 1) {
				$super.slideUp(getVal('animationSpeed'));
				return;
			}

			if ($listEls.size() < 2) {
				$prev.animate({ opacity: 0 }, getVal('animationSpeed'), remove);
				$next.animate({ opacity: 0 }, getVal('animationSpeed'), remove);
				$list.slideUp(getVal('animationSpeed'));
			}

			var showFromSide; // 'left' or 'right'
			var toIndex, preloadIndex_1 = -1, preloadIndex_2 = -1;

			// get indexes {{{2
			if (typeof step === 'number') {
				toIndex = step;

				// preloading
				preloadIndex_1 = toIndex - 1;
				if (preloadIndex_1 < 0)
					preloadIndex_1 = $listEls.last().index();
				preloadIndex_2 = toIndex + 1;
				if (preloadIndex_2 >= $listEls.size())
					preloadIndex_2 = 0;
			} else if (step === 'prev') {
				toIndex = current - 1;
				if (toIndex < 0)
					toIndex = $listEls.last().index();

				// preloading
				preloadIndex_1 = toIndex - 1;
				if (preloadIndex_1 < 0)
					preloadIndex_1 = $listEls.last().index();
			} else if (step === 'next') {
				toIndex = current + 1;
				if ($listEls.eq(toIndex).size() <= 0)
					toIndex = 0;

				// preloading
				preloadIndex_2 = toIndex + 1;
				if (preloadIndex_2 >= $listEls.size())
					preloadIndex_2 = 0;
			} else throw new Error('Unknown type of "step" argument.');
			// get indexes }}}2

			if (toIndex === current) {
				process = false;
				return;
			}

			var $li = $listEls.eq(toIndex);
			if ($li.size() <= 0)
				throw new Error('OH SHI~ SOMETHING TERRIBLE HAPPENED');

			preload(preloadIndex_1);
			preload(preloadIndex_2);

			if (toIndex < current)
				showFromSide = 'left';
			else
				showFromSide = 'right';

			var $a = $li.find('a');
			var src = $a.attr('href');

			var $slideWrap = $('<div/>').addClass('wrap').addClass('sliding');
			var $slideImg = $('<img/>', { src: src });

			$slideWrap
				.css('left', ((showFromSide === 'left') ? '-100%' : '100%'))
				.append('<span class="center_helper"></span>')
				.append( $slideImg );

			$listEls.removeClass('active');
			$li.addClass('active');

			$slider.append($slideWrap);
			$slideWrap.animate(
				{ left: 0 },
				getVal('animationSpeed')*4,
				function () {
					$slider.find('>.wrap:not(.sliding)').remove();
					$slideWrap.removeClass('sliding');
					current = toIndex;
					process = false;
				});
		} // setActive() }}}1

		$listEls.each(function (i) { // {{{1
			var $li = $(this);
			var $a = $li.find('a');
			var $img = $a.find('img');

			var src = $img.attr('src');

			grayImg(src, function (dataURL) {
				var $newGrayImg = $('<img/>', {
					class: 'gray',
					src: dataURL
				});
				$a.append($newGrayImg);
			});

			$a.click(function () {
				setActive(i);
				return false;
			});
		}); // }}}1

		setActive(0);

		$prev.click(function () {
			setActive('prev');
			return false;
		});

		$next.click(function () {
			setActive('next');
			return false;
		});
	}; // return ()
}); // define()
