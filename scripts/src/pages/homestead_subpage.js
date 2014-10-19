/**
 * "homestead" sub-page behavior
 *
 * @author Viacheslav Lotsmanov
 * @license GNU/AGPLv3
 * @see {@link https://github.com/web-izmerenie/usadba-dev-sources/blob/master/LICENSE-AGPLv3|License}
 */

define(['jquery', 'get_val', 'get_local_text', 'gray_img'],
function ($, getVal, getLocalText, grayImg) {
$(function domReady() {

	if (!$('html').hasClass('homestead_subpage')) return;

	var $s = $('.section_wrap');
	var $main = $s.find('main');

	var $quantity = $main.find('.prices .quantity');
	var $activeRooms = $s.find('.sub_menu_line nav.rooms > span');
	var $panorama = $main.find('.panorama');
	var $detailPicture = $main.find('.detail_picture');
	var $gallery = $main.find('.photogallery');

	function fill() { // {{{1
		$quantity.each(function () {

			var $q = $(this);
			var $f = $q.find('.fill');
			var $u = $q.find('.unit');

			var w = $q.width();
			var uw = $u.eq(0).width() + parseInt($u.eq(0).css('margin-right'), 10);
			var uall = uw * $u.size();
			var avalW = w - uall;

			$f.css('margin-left', '').text('');

			while ($f.width() < avalW) {
				$f.append('.');
			}

			$f.text( $f.text().slice(0, -1) );
			$f.css('margin-left', (avalW - $f.width()) + 'px');

		});
	} // fill() }}}1

	$(window).load(function () { setTimeout(fill, 1); });
	setTimeout(fill, 1);

	$activeRooms.each(function () { // {{{1

		var $room = $(this);
		var $img = $room.find('img');

		var src = $img.attr('src');

		grayImg(src, function (dataURL) {
			$img.attr('src', dataURL);
		});

	}); // $activeRooms.each() // }}}1

	require(['panorama_blocks'], function (handler) {
		handler($panorama, $detailPicture);
	});

	// init reserve form {{{1
	require(['popup_form_init'], function (popupFormInit) {

		var $reserve = $s.find('.reservation');
		var $form = $reserve.find('form.reservation_form');

		popupFormInit.call($form.get(0), 'reserve', null, [
			getLocalText('forms', 'reserve_success_1'),
			getLocalText('forms', 'reserve_success_2'),
		]);

		// parse houses list {{{2

		var $housesUl = $form.find('ul.houses_list');
		var $housesLi = $housesUl.find('>li');

		var houses = []; // json

		$housesLi.each(function () {
			var $el = $(this);
			var item = {};

			item.id = $el.find('>.id').text();
			item.name = $el.find('>.name').text();
			item.active = $el.hasClass('active');

			var $ul = $el.find('>ul.people_count');
			var $li = $ul.find('>li');

			item.people_count = [];

			$li.each(function () {
				item.people_count.push({
					public: $(this).find('>.public').text(),
					hidden: $(this).find('>.hidden').text()
				});
			});

			houses.push(item);
		});

		// parse houses list }}}2

		var $chooseHouse = $form.find('label.choose');
		var $choosePeopleCount = $chooseHouse.eq(1);
		$chooseHouse = $chooseHouse.eq(0);

		var $inputHouseName = $form.find('input[name=house_name]');
		var $inputHouseId = $form.find('input[name=house_id]');
		var $inputPeopleCountPublic = $form.find('input[name=people_count]');
		var $inputPeopleCountHidden = $form.find('input[name=hidden_people_count]');

		// create dom lists for choosers {{{2

		var $housesChooserUl = $('<ul/>', { class: 'houses_chooser' });
		var $peopleCountChooserUl = $('<ul/>', { class: 'people_count_chooser' });

		$.each(houses, function () {
			var $el = $('<li/>');

			$el.data({
				id: this.id,
				name: this.name,
				people_count: this.people_count
			});

			$el.text( $el.data('name') );

			if (this.active) $el.addClass('this_house');

			$el.click(function () {
				if ($el.hasClass('current')) return false;

				$housesChooserUl.find('>li').removeClass('current');
				$el.addClass('current');

				$inputHouseName
					.removeAttr('readonly')
					.val( $el.data('name') )
					.focus()
					.attr('readonly', 'readonly')
					.blur();
				$inputHouseId.val( $el.data('id') );

				$peopleCountChooserUl.html('');
				$.each($el.data('people_count'), function (i) {
					var $li = $('<li/>');

					$li.data({
						public: this.public,
						hidden: this.hidden
					});

					$li.text( $li.data('public') );

					$li.click(function () {
						if ($li.hasClass('current')) return false;

						$peopleCountChooserUl.find('>li').removeClass('current');
						$li.addClass('current');

						$inputPeopleCountPublic
							.removeAttr('readonly')
							.val( $li.data('public') )
							.focus()
							.attr('readonly', 'readonly')
							.blur();
						$inputPeopleCountHidden.val( $li.data('hidden') );

						$choosePeopleCount.find('.show_list').trigger('click');
						return false;
					});

					if (i === 0) $li.trigger('click');

					$peopleCountChooserUl.append($li);
				});
				$peopleCountChooserUl.hide();

				$chooseHouse.find('.show_list').trigger('click');
				return false;
			});

			$housesChooserUl.append($el);
		});

		$housesChooserUl.hide();
		$peopleCountChooserUl.hide();
		$housesChooserUl.find('>li.this_house').trigger('click');
		$form.append($housesChooserUl).append($peopleCountChooserUl);

		// create dom lists for choosers }}}2

		// behavior of choosers {{{2

		var bindSuffix = '.stupid_chooser';
		var chooserOpened = false;

		function chooserDocumentClickHandler(event, $el, $button) { // {{{3
			var x = $el.offset().left;
			var y = $el.offset().top;
			var w = $el.innerWidth();
			var h = $el.innerHeight();

			// hell IE
			if (event.pageX < 0 || event.pageY < 0) return true;

			if (
				!(event.pageX >= x && event.pageX <= x+w) ||
				!(event.pageY >= y && event.pageY <= y+h)
			) {
				$button.trigger('click');
				return false;
			}

			return true;
		} // chooserDocumentClickHandler() }}}3

		$chooseHouse.each(function () {
			var $l = $(this);
			var $sb = $('<ins/>', { class: 'show_list' });

			$sb.click(function () {
				if (chooserOpened && !$sb.hasClass('opened')) return false;
				if ($sb.hasClass('opened')) {
					$sb.removeClass('opened');
					$housesChooserUl.stop().slideUp(getVal('animationSpeed'));
					$(document).off('click' + bindSuffix);
					chooserOpened = false;
					return false;
				}
				chooserOpened = true;
				$sb.addClass('opened');
				$housesChooserUl.stop().slideDown(getVal('animationSpeed'));
				$(document).on('click' + bindSuffix, function (event) {
					return chooserDocumentClickHandler(event, $housesChooserUl, $sb);
				});
				$inputHouseName.focus().blur();
				return false;
			});
			$l.append($sb);
		});

		$choosePeopleCount.each(function () {
			var $l = $(this);
			var $sb = $('<ins/>', { class: 'show_list' });

			$sb.click(function () {
				if (chooserOpened && !$sb.hasClass('opened')) return false;
				if ($sb.hasClass('opened')) {
					$sb.removeClass('opened');
					$peopleCountChooserUl.stop().slideUp(getVal('animationSpeed'));
					$(document).off('click' + bindSuffix);
					chooserOpened = false;
					return false;
				}
				chooserOpened = true;
				$sb.addClass('opened');
				$peopleCountChooserUl.stop().slideDown(getVal('animationSpeed'));
				$(document).on('click' + bindSuffix, function (event) {
					return chooserDocumentClickHandler(event, $peopleCountChooserUl, $sb);
				});
				$inputPeopleCountPublic.focus().blur();
				return false;
			});
			$l.append($sb);
		});

		// behavior of choosers }}}2

		var $labelIn = $('label.date');
		var $labelOut = $labelIn.eq(1);
		$labelIn = $labelIn.eq(0);

		var $inputIn = $labelIn.find('input');
		var $inputOut = $labelOut.find('input');

		require(['modernizr'], function (Modernizr) {
			if (!Modernizr.inputtypes.date)
				require(['jquery-ui-datepicker'], function () {
					var p = {
						beforeShow: function(input, inst) {
							$('#ui-datepicker-div').addClass('reserve_form_datepicker');
						},
						onSelect: function(dateText, inst) {
							$(inst.input).blur();
						}
					};
					$inputIn.datepicker(p);
					$inputOut.datepicker(p);
				});
		});

		$reserve.find('.reserve').on('click', function () {
			require(['popup'], function (popup) {
				popup.show({ $container: $form });
			});
			return false;
		});

	}); // require(['popup_form_init'])
	// init reserve form }}}1

}); // domReady()
}); // define()
