/**
 * Values for "get_val" module
 *
 * @author Viacheslav Lotsmanov
 */

define(function () {

	/** @public */ var exports = {};

	exports.values = {

		animationSpeed: 200, // ms
		cookieExpires: 365, // days

		headerHeight: 87, // px
		headerFirstLineMaxWidth: 842, // px
		headerFirstLineMinWidth: 762, // px
		headerSubMenuItemMaxMarginLeft: 22, // px

		card1ScrollDownJitterInterval: 5, // sec
		card1ScrollDownJitterValue: 20, // px

		mainPageBackgroundsRatio: [4, 3], // ratio
		mainPageParalaxValue: 150, // % of height

		loadImgTimeout: 30 * 1000, // ms

		// dialog boxes
		dialogBoxTpl: '<div class="#DIALOG_BOX_CLASS# #TYPE_NAME# #TITLE_CLASS_FLAG#">'+
				'<div class="wrapper"><div class="wrapper_2">'+
					'<a class="#CLOSER_CLASS#"></a>'+
					'<div class="messages">#MESSAGES#</div>'+
					'#BUTTONS_BLOCK#'+
				'</div></div>'+
			'</div>',
		dialogBoxCloseExclude: '.wrapper_2',

		panoramaRatio: [148, 69],

		dynamicApiLoadInterval: 500,

		minWidth: 980,
		maxWidth: 1200,

		galleryColorboxParams: {
			transition: 'fade',
			height: '80%',
			opacity: 0.5,
			rel: 'photos',
		},

		mobileMainPage: '/homestead/'

	};

	/** Required set before "getVal" */
	exports.required = [
		'lang',
		'revision',
		'tplPath',
	];

	return exports;

}); // define()
