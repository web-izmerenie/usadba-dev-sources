/**
 * Localization values
 *
 * @author Viacheslav Lotsmanov
 * @encoding utf-8
 * @license GNU/AGPLv3
 * @see {@link https://github.com/web-izmerenie/usadba-dev-sources/blob/master/LICENSE-AGPLv3|License}
 */

define(['get_val'], function (getVal) {

	var locals = {

		'en': {

			'err': {
				'limited_functional': 'Site functional is limited.',
				'recommend_update_your_browser': 'We recommend to update your browser.',
				'forms': {
					'ajax_req': 'Server communication error.',
					'unknown_parse': 'Unknown parsing data from server error.',
					'unknown_server_error': 'Unknown server error.',
					'incorrect_fields': 'Incorrect values of some fields.',
				},
				'dialog_box': 'Create dialog box error.',
				'interactive_map_init': 'Interactive map initialization error.',
				'interactive_map_route': 'Route planning error on interactive map.',
				'interactive_map_params': 'No interactive map parameters or incorrect values.',
				'panorama_init': 'Panorama initialization error.',
			},

			'forms': {
				'write_a_review_success_1': 'Thank you for your review',
				'write_a_review_success_2': 'Your review will be published after validation by moderator.',
				'ask_a_question_success_1': 'Thank you for your question',
				'ask_a_question_success_2': 'We will contact you shortly.',
			},

		},

		'ru': {

			'err': {
				'limited_functional': 'Функционал сайта работает неполностью.',
				'recommend_update_your_browser': 'Рекомендуем обновить ваш браузер.',
				'forms': {
					'ajax_req': 'Ошибка связи с сервером.',
					'unknown_parse': 'Неизвестная ошибка обработки данных от сервера.',
					'unknown_server_error': 'Неизвестная ошибка севрера.',
					'incorrect_fields': 'Некорректно заполнены некоторые поля.',
				},
				'dialog_box': 'Ошибка создания диалогового окна.',
				'interactive_map_init': 'Ошибка инициализации интерактивной карты.',
				'interactive_map_route': 'Ошибка построения маршрута на интерактивной карте.',
				'interactive_map_params': 'Не указаны параметры интерактивной карты или имеют неверный тип данных.',
				'panorama_init': 'Произошла ошибка при инициализации панорамы.',
			},

			'forms': {
				'write_a_review_success_1': 'Благодарим за ваш отзыв',
				'write_a_review_success_2': 'Ваш будет отзыв будет опубликован после проверки модератором.',
				'ask_a_question_success_1': 'Благодарим за обращение к нам',
				'ask_a_question_success_2': 'Мы обязательно свяжемся с вами в ближайшее время.<br/>'+
					'Усадьба Парфенова — дом, где вас любят и ждут!',
			},

		},

		'defaultLocal': getVal('lang')

	};

	return locals;

}); // define()
