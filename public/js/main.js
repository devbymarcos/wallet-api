/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./public/js/modules/choose-wallet.js":
/*!********************************************!*\
  !*** ./public/js/modules/choose-wallet.js ***!
  \********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ initChooseWallet)\n/* harmony export */ });\n/* harmony import */ var _dash_panels_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dash-panels.js */ \"./public/js/modules/dash-panels.js\");\n/* harmony import */ var _highchart_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./highchart.js */ \"./public/js/modules/highchart.js\");\n\n\nfunction initChooseWallet() {\n  var select = document.querySelector('#wallet-panels select');\n\n  if (select) {\n    var updatepanels = function updatepanels() {\n      (0,_dash_panels_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])();\n      (0,_highchart_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"])();\n    };\n\n    select.addEventListener('change', updatepanels);\n  }\n}\n\n//# sourceURL=webpack://node/./public/js/modules/choose-wallet.js?");

/***/ }),

/***/ "./public/js/modules/dash-panels.js":
/*!******************************************!*\
  !*** ./public/js/modules/dash-panels.js ***!
  \******************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ initPanels)\n/* harmony export */ });\nfunction initPanels() {\n  var balance = document.querySelector('[data-balance]');\n  var received = document.querySelector('[data-received]');\n  var paid = document.querySelector('[data-paid]');\n  var balanceMonth = document.querySelector('[data-balanceMonth]');\n  var wallet = document.getElementById('wallet-panels');\n  var walletValue = '';\n\n  if (balance) {\n    walletValue = new FormData(wallet);\n    fetch('/panels', {\n      method: 'POST',\n      body: walletValue\n    }).then(function (response) {\n      return response.json();\n    }).then(function (data) {\n      console.log(data);\n\n      if (!data.balance) {\n        balance.innerHTML = \"R$ 0,00\";\n      } else {\n        balance.innerHTML = data.balance.toLocaleString('pt-br', {\n          style: 'currency',\n          currency: 'BRL'\n        });\n      }\n\n      if (!data.received) {\n        received.innerHTML = \"R$ 0,00\";\n      } else {\n        received.innerHTML = data.received.toLocaleString('pt-br', {\n          style: 'currency',\n          currency: 'BRL'\n        });\n      }\n\n      if (!data.paid) {\n        paid.innerHTML = \"R$ 0,00\";\n      } else {\n        paid.innerHTML = data.paid.toLocaleString('pt-br', {\n          style: 'currency',\n          currency: 'BRL'\n        });\n      }\n    });\n  }\n}\n\n//# sourceURL=webpack://node/./public/js/modules/dash-panels.js?");

/***/ }),

/***/ "./public/js/modules/highchart.js":
/*!****************************************!*\
  !*** ./public/js/modules/highchart.js ***!
  \****************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ initChart)\n/* harmony export */ });\nfunction initChart() {\n  var load = document.querySelector('.ajax_load');\n  var charDiv = document.querySelector('#chartContainer');\n  var wallet = document.getElementById('wallet-panels');\n  var walletValue = '';\n\n  if (charDiv) {\n    walletValue = new FormData(wallet);\n    fetch('/chartdata', {\n      method: 'POST',\n      body: walletValue\n    }).then(function (r) {\n      //load.classList.remove('ajax_load_flex');\n      return r.json();\n    }).then(function (data) {\n      Highcharts.setOptions({\n        lang: {\n          decimalPoint: ',',\n          thousandsSep: '.'\n        }\n      });\n      Highcharts.chart(charDiv, {\n        chart: {\n          backgroundColor: 'transparent',\n          type: 'areaspline'\n        },\n        title: {\n          text: 'Receitas x Despesas'\n        },\n        subtitle: {\n          text: ''\n        },\n        xAxis: {\n          categories: data.months,\n          crosshair: true\n        },\n        yAxis: {\n          min: 0,\n          title: {\n            text: ''\n          }\n        },\n        tooltip: {\n          shared: true,\n          valueDecimals: 2,\n          valuePrefix: 'R$ '\n        },\n        credits: {\n          enabled: false\n        },\n        plotOptions: {\n          column: {\n            pointPadding: 0.2,\n            borderWidth: 0\n          }\n        },\n        series: [{\n          name: 'Receitas',\n          data: data.income,\n          color: '#61DDBC',\n          lineColor: '#36BA9B'\n        }, {\n          name: 'Despesas',\n          data: data.expense,\n          color: '#f76c82',\n          lineColor: '#D94352'\n        }]\n      });\n    });\n  }\n}\n\n//# sourceURL=webpack://node/./public/js/modules/highchart.js?");

/***/ }),

/***/ "./public/js/modules/jquery.js":
/*!*************************************!*\
  !*** ./public/js/modules/jquery.js ***!
  \*************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ initJquery)\n/* harmony export */ });\n/* harmony import */ var _dash_panels_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dash-panels.js */ \"./public/js/modules/dash-panels.js\");\n/* harmony import */ var _highchart_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./highchart.js */ \"./public/js/modules/highchart.js\");\n\n\nfunction initJquery() {\n  $(function () {\n    var conf_url_app = $(\"#basepath\").attr(\"path\");\n    var ajaxResponseBaseTime = 3;\n    var ajaxResponseRequestError = \"<div class='message error icon-warning'>Desculpe mas não foi possível processar sua requisição...</div>\"; // ABRE O CAMPO PARA PARCELAS O FIXO NO LANÇAMENTO DA INVOICE\n\n    $('input[name=\"repeat_when\"]').on(\"click\", function () {\n      var repeat_when = $(this).val();\n\n      switch (repeat_when) {\n        case \"installments\":\n          $(\"#fixed\").slideUp();\n          $(\"#installments\").slideDown();\n          break;\n\n        case \"fixed\":\n          $(\"#installments\").slideUp();\n          $(\"#fixed\").slideDown();\n          break;\n\n        default:\n          $(\"#fixed,#installments\").slideUp();\n      }\n    }); //MOSTRA FORM DE RECUPERAÇÃO DE SENHA\n\n    $(\".btn-action\").click(function () {\n      var formVisibilit = $(\".form-step:visible\");\n      var formHidden = $(\".form-step:hidden\");\n      formVisibilit.fadeOut(200, function () {\n        formHidden.fadeIn(200);\n      });\n    }); // ALTERA O STATUS DE PAGAMENTO DAS INVOICES\n\n    $(document).on(\"click\", \".pay-action\", function () {\n      var classe = $(this).attr(\"class\");\n      var dataPay = $(this).attr(\"data-pay\");\n      var idPay = $(this).attr(\"data-idpay\");\n      var type = $(this).attr(\"data-type\");\n      var action = \"update\";\n      var acao = \"flash_list\";\n      var router = \"\";\n\n      switch (type) {\n        case \"income\":\n          router = \"/income/save\";\n          break;\n\n        case \"fixed_income\":\n          router = \"/income/save\";\n          break;\n\n        case \"expense\":\n          router = \"/expense/save\";\n          break;\n\n        case \"fixed_expense\":\n          router = \"/income/save\";\n          break;\n      }\n\n      var icon = $(this).find(\"i\");\n      icon.toggleClass(\"fa-check-circle fa-times-circle\");\n\n      if (dataPay == \"paid\") {\n        $(this).attr(\"data-pay\", \"unpaid\");\n      } else {\n        $(this).attr(\"data-pay\", \"paid\");\n      }\n\n      $.post(router, {\n        pay: dataPay,\n        id: idPay,\n        action: action,\n        acao: acao\n      }, function (response) {\n        (0,_highchart_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"])();\n        (0,_dash_panels_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])();\n\n        if (response.message) {\n          var message = \"<div class='message \".concat(response.type, \"'>\").concat(response.message, \"</div>\");\n          ajaxMessage(message, ajaxResponseBaseTime);\n        }\n      }, \"json\");\n    }); //PESQUISA NO FORM DE LANÇAMENTO\n\n    $(\"#search_input\").keyup(function () {\n      var router = $(this).attr(\"router\");\n      search = $(this).val();\n      $.post(router, {\n        search: search\n      }, function (data) {\n        console.log(data);\n        $(\".result-form\").html(data);\n        $(\".search_item\").show(300);\n      });\n    }); //INSERE A PESQUISA NO INPUT\n\n    $(document).on(\"click\", \".search_item\", function () {\n      var texto = $(this).text();\n      /*var valor = $(this).attr('data-valor');*/\n\n      $(\"#search_input\").val(texto);\n      /*$('.vunit1').val(valor);*/\n\n      $(\".search_item\").hide(200);\n    }); //DATA SET\n\n    $(\"[data-post]\").click(function (e) {\n      e.preventDefault();\n      var clicked = $(this);\n      var data = clicked.data();\n      var load = $(\".ajax_load\");\n\n      if (data.confirm) {\n        var deleteConfirm = confirm(data.confirm);\n\n        if (!deleteConfirm) {\n          return;\n        }\n      }\n\n      $.ajax({\n        url: data.post,\n        type: \"POST\",\n        data: data,\n        dataType: \"json\",\n        beforeSend: function beforeSend() {\n          load.fadeIn(200).css(\"display\", \"flex\");\n        },\n        success: function success(response) {\n          //redirect\n          if (response.redirect) {\n            window.location.href = response.redirect;\n          } else {\n            load.fadeOut(200);\n          } //reload\n\n\n          if (response.reload) {\n            window.location.reload();\n          } else {\n            load.fadeOut(200);\n          } //message\n\n\n          if (response.message) {\n            var message = \"<div class='message \".concat(response.type, \"'>\").concat(response.message, \"</div>\");\n            ajaxMessage(message, ajaxResponseBaseTime);\n          }\n        },\n        error: function error() {\n          ajaxMessage(ajaxResponseRequestError, 5);\n          load.fadeOut();\n        }\n      });\n    }); //FORMS\n\n    $(\"form:not('.ajax_off')\").submit(function (e) {\n      e.preventDefault();\n      var form = $(this);\n      var load = $(\".ajax_load\");\n\n      if (typeof tinyMCE !== \"undefined\") {\n        tinyMCE.triggerSave();\n      }\n\n      form.ajaxSubmit({\n        url: form.attr(\"action\"),\n        type: \"POST\",\n        dataType: \"json\",\n        beforeSend: function beforeSend() {\n          load.fadeIn(200).css(\"display\", \"flex\");\n        },\n        uploadProgress: function uploadProgress(event, position, total, completed) {\n          var loaded = completed;\n          var load_title = $(\".ajax_load_box_title\");\n          load_title.text(\"Enviando (\" + loaded + \"%)\");\n          form.find(\"input[type='file']\").val(null);\n\n          if (completed >= 100) {\n            load_title.text(\"Aguarde, carregando...\");\n          }\n        },\n        success: function success(response) {\n          console.log(response.message); //redirect\n\n          if (response.redirect) {\n            window.location.href = response.redirect;\n          } else {\n            load.fadeOut(200);\n          } //reload\n\n\n          if (response.reload) {\n            window.location.reload();\n          } else {\n            load.fadeOut(200);\n          } //message\n\n\n          if (response.message) {\n            var message = \"<div class='message \".concat(response.type, \"'>\").concat(response.message, \"</div>\");\n            ajaxMessage(message, ajaxResponseBaseTime);\n          }\n        },\n        complete: function complete() {\n          if (form.data(\"reset\") === true) {\n            form.trigger(\"reset\");\n          }\n        },\n        error: function error() {\n          var message = ajaxResponseRequestError;\n          ajaxMessage(message, 5);\n          load.fadeOut();\n        }\n      });\n    }); // AJAX RESPONSE\n\n    function ajaxMessage(message, time) {\n      var ajaxMessage = $(message);\n      ajaxMessage.append(\"<div class='message_time'></div>\");\n      ajaxMessage.find(\".message_time\").animate({\n        width: \"100%\"\n      }, time * 1000, function () {\n        $(this).parents(\".message\").fadeOut(200);\n      });\n      $(\".ajax_response\").append(ajaxMessage);\n      ajaxMessage.effect(\"slide\");\n    } // AJAX RESPONSE MONITOR\n\n\n    $(\".ajax_response .message\").each(function (e, m) {\n      ajaxMessage(m, ajaxResponseBaseTime += 1);\n    }); // AJAX MESSAGE CLOSE ON CLICK\n\n    $(\".ajax_response\").on(\"click\", \".message\", function (e) {\n      $(this).effect(\"bounce\").fadeOut(1);\n    }); // MAKS\n    // $(\".mask-date\").mask('00/00/0000');\n    // $(\".mask-mobile\").mask('(00)00000-0000');\n    // $(\".mask-phone\").mask('(00)0000-0000');\n    // $(\".mask-datetime\").mask('00/00/0000 00:00');\n    // $(\".mask-month\").mask('00/0000', {reverse: true});\n    // $(\".mask-doc\").mask('000.000.000-00', {reverse: true});\n    // $(\".mask-card\").mask('0000  0000  0000  0000', {reverse: true});\n    // $(\".mask-money\").mask('000.000.000.000.000,00', {reverse: true, placeholder: \"0,00\"});\n  });\n  /*jquery end*/\n  //PREVIEW DE IMAGE ANTES DO UPLOAD\n\n  function previewImage() {\n    var image = document.querySelector(\"input[data-cover=preview]\");\n    var preview = document.querySelector(\"img[data-cover=cover-img]\");\n\n    if (image) {\n      image.addEventListener(\"change\", function () {\n        var reader = new FileReader();\n\n        reader.onloadend = function () {\n          preview.setAttribute(\"src\", reader.result);\n        };\n\n        if (image.files[0]) {\n          reader.readAsDataURL(image.files[0]);\n        }\n      });\n    }\n  }\n\n  previewImage();\n}\n\n//# sourceURL=webpack://node/./public/js/modules/jquery.js?");

/***/ }),

/***/ "./public/js/modules/menuMobile.js":
/*!*****************************************!*\
  !*** ./public/js/modules/menuMobile.js ***!
  \*****************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ initMenuMobile)\n/* harmony export */ });\nfunction initMenuMobile() {\n  var btnSidebar = document.querySelector('[data-btn=\"sidebar\"]');\n  var appContent = document.querySelector('[data-app=\"content\"]');\n  var sideBar = document.querySelector(\"[data-sidebar]\");\n  var spanEfect = document.querySelector('[data-btn=\"sidebar\"] span');\n\n  if (btnSidebar) {\n    var openSidebar = function openSidebar() {\n      appContent.classList.toggle(\"active\");\n      sideBar.classList.toggle(\"active\");\n      spanEfect.classList.toggle(\"active\");\n    };\n\n    btnSidebar.addEventListener(\"click\", openSidebar);\n  }\n}\n\n//# sourceURL=webpack://node/./public/js/modules/menuMobile.js?");

/***/ }),

/***/ "./public/js/scripts.js":
/*!******************************!*\
  !*** ./public/js/scripts.js ***!
  \******************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _modules_jquery_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modules/jquery.js */ \"./public/js/modules/jquery.js\");\n/* harmony import */ var _modules_highchart_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modules/highchart.js */ \"./public/js/modules/highchart.js\");\n/* harmony import */ var _modules_dash_panels_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./modules/dash-panels.js */ \"./public/js/modules/dash-panels.js\");\n/* harmony import */ var _modules_choose_wallet_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./modules/choose-wallet.js */ \"./public/js/modules/choose-wallet.js\");\n/* harmony import */ var _modules_menuMobile_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./modules/menuMobile.js */ \"./public/js/modules/menuMobile.js\");\n\n\n\n\n\n(0,_modules_jquery_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])();\n(0,_modules_highchart_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"])();\n(0,_modules_dash_panels_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"])();\n(0,_modules_choose_wallet_js__WEBPACK_IMPORTED_MODULE_3__[\"default\"])();\n(0,_modules_menuMobile_js__WEBPACK_IMPORTED_MODULE_4__[\"default\"])();\n\n//# sourceURL=webpack://node/./public/js/scripts.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./public/js/scripts.js");
/******/ 	
/******/ })()
;