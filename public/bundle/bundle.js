/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

;// CONCATENATED MODULE: ./public/js/modules/dash-panels.js
function initPanels() {
  var balance = document.querySelector("[data-balance]");
  var received = document.querySelector("[data-received]");
  var paid = document.querySelector("[data-paid]");
  var wallet = document.getElementById("wallet-panels");
  var walletValue = "";

  if (balance) {
    walletValue = new FormData(wallet);
    fetch("/panels", {
      method: "POST",
      body: walletValue
    }).then(function (response) {
      return response.json();
    }).then(function (data) {
      if (!data.balance) {
        balance.innerHTML = "R$ 0,00";
      } else {
        balance.innerHTML = data.balance.toLocaleString("pt-br", {
          style: "currency",
          currency: "BRL"
        });
      }

      if (!data.received) {
        received.innerHTML = "R$ 0,00";
      } else {
        received.innerHTML = data.received.toLocaleString("pt-br", {
          style: "currency",
          currency: "BRL"
        });
      }

      if (!data.paid) {
        paid.innerHTML = "R$ 0,00";
      } else {
        paid.innerHTML = data.paid.toLocaleString("pt-br", {
          style: "currency",
          currency: "BRL"
        });
      }
    });
  }
}
;// CONCATENATED MODULE: ./public/js/modules/highchart.js
function initChart() {
  var load = document.querySelector(".ajax_load");
  var charDiv = document.querySelector("#chartContainer");
  var wallet = document.getElementById("wallet-panels");
  var walletValue = "";

  if (charDiv) {
    walletValue = new FormData(wallet);
    fetch("/chartdata", {
      method: "POST",
      body: walletValue
    }).then(function (r) {
      //load.classList.remove('ajax_load_flex');
      return r.json();
    }).then(function (data) {
      Highcharts.setOptions({
        lang: {
          decimalPoint: ",",
          thousandsSep: "."
        }
      });
      Highcharts.chart(charDiv, {
        chart: {
          backgroundColor: "transparent",
          type: "areaspline"
        },
        title: {
          text: "Receitas x Despesas"
        },
        subtitle: {
          text: ""
        },
        xAxis: {
          categories: data.months,
          crosshair: true
        },
        yAxis: {
          min: 0,
          title: {
            text: ""
          }
        },
        tooltip: {
          shared: true,
          valueDecimals: 2,
          valuePrefix: "R$ "
        },
        credits: {
          enabled: false
        },
        plotOptions: {
          column: {
            pointPadding: 0.2,
            borderWidth: 0
          }
        },
        series: [{
          name: "Receitas",
          data: data.income,
          color: "#61DDBC",
          lineColor: "#36BA9B"
        }, {
          name: "Despesas",
          data: data.expense,
          color: "#f76c82",
          lineColor: "#D94352"
        }]
      });
    });
  }
}
;// CONCATENATED MODULE: ./public/js/modules/messageView.js
function messageView(msg, type) {
  var divMessage = document.querySelector(".alert");
  var message = document.createElement("div");
  message.classList.add("messageView", type);
  message.innerText = msg;
  divMessage.prepend(message);
  setTimeout(function () {
    message.style.display = "none";
  }, 3000);
}
;// CONCATENATED MODULE: ./public/js/modules/jquery.js



function initJquery() {
  $(function () {
    var conf_url_app = $("#basepath").attr("path");
    var ajaxResponseType = "error";
    var ajaxmessageRequestError = "Desculpe mas não foi possível processar sua requisição..."; // ABRE O CAMPO PARA PARCELAS O FIXO NO LANÇAMENTO DA INVOICE

    $('input[name="repeat_when"]').on("click", function () {
      var repeat_when = $(this).val();

      switch (repeat_when) {
        case "installments":
          $("#fixed").slideUp();
          $("#installments").slideDown();
          break;

        case "fixed":
          $("#installments").slideUp();
          $("#fixed").slideDown();
          break;

        default:
          $("#fixed,#installments").slideUp();
      }
    }); //MOSTRA FORM DE RECUPERAÇÃO DE SENHA

    $(".btn-action").click(function () {
      var formVisibilit = $(".form-step:visible");
      var formHidden = $(".form-step:hidden");
      formVisibilit.fadeOut(200, function () {
        formHidden.fadeIn(200);
      });
    }); // ALTERA O STATUS DE PAGAMENTO DAS INVOICES

    $(document).on("click", ".pay-action", function () {
      var classe = $(this).attr("class");
      var dataPay = $(this).attr("data-pay");
      var idPay = $(this).attr("data-idpay");
      var type = $(this).attr("data-type");
      var action = "update";
      var acao = "flash_list";
      var router = "";

      switch (type) {
        case "income":
          router = "/income/save";
          break;

        case "fixed_income":
          router = "/income/save";
          break;

        case "expense":
          router = "/expense/save";
          break;

        case "fixed_expense":
          router = "/income/save";
          break;
      }

      var icon = $(this).find("i");
      icon.toggleClass("fa-check-circle fa-times-circle");

      if (dataPay == "paid") {
        $(this).attr("data-pay", "unpaid");
      } else {
        $(this).attr("data-pay", "paid");
      }

      $.post(router, {
        pay: dataPay,
        id: idPay,
        action: action,
        acao: acao
      }, function (response) {
        initChart();
        initPanels();

        if (response.message) {
          messageView(response.message, response.type);
        }
      }, "json");
    }); //PESQUISA NO FORM DE LANÇAMENTO

    $("#search_input").keyup(function () {
      var router = $(this).attr("router");
      search = $(this).val();
      $.post(router, {
        search: search
      }, function (data) {
        console.log(data);
        $(".result-form").html(data);
        $(".search_item").show(300);
      });
    }); //INSERE A PESQUISA NO INPUT

    $(document).on("click", ".search_item", function () {
      var texto = $(this).text();
      /*var valor = $(this).attr('data-valor');*/

      $("#search_input").val(texto);
      /*$('.vunit1').val(valor);*/

      $(".search_item").hide(200);
    }); //DATA SET

    $("[data-post]").click(function (e) {
      e.preventDefault();
      var clicked = $(this);
      var data = clicked.data();
      var load = $(".ajax_load");

      if (data.confirm) {
        var deleteConfirm = confirm(data.confirm);

        if (!deleteConfirm) {
          return;
        }
      }

      $.ajax({
        url: data.post,
        type: "POST",
        data: data,
        dataType: "json",
        beforeSend: function beforeSend() {
          load.fadeIn(200).css("display", "flex");
        },
        success: function success(response) {
          //redirect
          if (response.redirect) {
            window.location.href = response.redirect;
          } else {
            load.fadeOut(200);
          } //reload


          if (response.reload) {
            window.location.reload();
          } else {
            load.fadeOut(200);
          } //message


          if (response.message) {
            messageView(response.message, response.type);
          }
        },
        error: function error() {
          messageView(response.message, response.type);
          load.fadeOut();
        }
      });
    }); //FORMS

    $("form:not('.ajax_off')").submit(function (e) {
      e.preventDefault();
      var form = $(this);
      var load = $(".ajax_load");

      if (typeof tinyMCE !== "undefined") {
        tinyMCE.triggerSave();
      }

      form.ajaxSubmit({
        url: form.attr("action"),
        type: "POST",
        dataType: "json",
        beforeSend: function beforeSend() {
          load.fadeIn(200).css("display", "flex");
        },
        uploadProgress: function uploadProgress(event, position, total, completed) {
          var loaded = completed;
          var load_title = $(".ajax_load_box_title");
          load_title.text("Enviando (" + loaded + "%)");
          form.find("input[type='file']").val(null);

          if (completed >= 100) {
            load_title.text("Aguarde, carregando...");
          }
        },
        success: function success(response) {
          console.log(response.message); //redirect

          if (response.redirect) {
            window.location.href = response.redirect;
          } else {
            load.fadeOut(200);
          } //reload


          if (response.reload) {
            window.location.reload();
          } else {
            load.fadeOut(200);
          } //message


          if (response.message) {
            messageView(response.message, response.type);
          }
        },
        complete: function complete() {
          if (form.data("reset") === true) {
            form.trigger("reset");
          }
        },
        error: function error() {
          messageView(ajaxmessageRequestError, ajaxResponseType);
          load.fadeOut();
        }
      });
    }); // MAKS

    $(".mask-date").mask("00/00/0000");
    $(".mask-mobile").mask("(00)00000-0000");
    $(".mask-phone").mask("(00)0000-0000");
    $(".mask-datetime").mask("00/00/0000 00:00");
    $(".mask-month").mask("00/0000", {
      reverse: true
    });
    $(".mask-doc").mask("000.000.000-00", {
      reverse: true
    });
    $(".mask-card").mask("0000  0000  0000  0000", {
      reverse: true
    });
    $(".mask-money").mask("000.000.000.000.000,00", {
      reverse: true,
      placeholder: "0,00"
    });
  });
  /*jquery end*/
  //PREVIEW DE IMAGE ANTES DO UPLOAD

  function previewImage() {
    var image = document.querySelector("input[data-cover=preview]");
    var preview = document.querySelector("img[data-cover=cover-img]");

    if (image) {
      image.addEventListener("change", function () {
        var reader = new FileReader();

        reader.onloadend = function () {
          preview.setAttribute("src", reader.result);
        };

        if (image.files[0]) {
          reader.readAsDataURL(image.files[0]);
        }
      });
    }
  }

  previewImage();
}
;// CONCATENATED MODULE: ./public/js/modules/choose-wallet.js


function initChooseWallet() {
  var select = document.querySelector("#wallet-panels select");

  if (select) {
    var updatepanels = function updatepanels() {
      initPanels();
      initChart();
    };

    select.addEventListener("change", updatepanels);
  }
}
;// CONCATENATED MODULE: ./public/js/modules/menuMobile.js
function initMenuMobile() {
  var btnSidebar = document.querySelector('[data-btn="sidebar"]');
  var appContent = document.querySelector('[data-app="content"]');
  var sideBar = document.querySelector("[data-sidebar]");

  if (btnSidebar) {
    var openSidebar = function openSidebar() {
      appContent.classList.toggle("active");
      sideBar.classList.toggle("active");
      btnSidebar.classList.toggle("active");
    };

    btnSidebar.addEventListener("click", openSidebar);
  }
}
;// CONCATENATED MODULE: ./public/js/modules/login.js

function initLogin() {
  var form = document.querySelector("[data-form]");
  var btnForm = document.querySelector("[data-submit]");
  var load = document.querySelector(".ajax_load");
  var dataForm = "";

  function sendForm(e) {
    e.preventDefault();
    var router = form.getAttribute("action");
    dataForm = new FormData(form);
    var dados = {
      email: dataForm.get("email"),
      remember: true
    }; //lembrar user no storage

    if (dataForm.get("remember")) {
      localStorage.setItem("login", JSON.stringify(dados));
    } else {
      localStorage.removeItem("login");
    } // fazer a requisição fetch


    load.classList.add("ajax_load_flex");
    fetch(router, {
      method: "POST",
      body: dataForm
    }).then(function (response) {
      load.classList.remove("ajax_load_flex");
      return response.json();
    }).then(function (data) {
      if (data.redirect) {
        window.location.href = data.redirect;
        return;
      } else {
        messageView(data.message, data.type);
      }
    });
  }

  if (btnForm) {
    btnForm.addEventListener("click", sendForm);
  }
}
;// CONCATENATED MODULE: ./public/js/modules/userLogin.js
function initUserLogin() {
  var checkbox = document.querySelector("[data-form] input[type=checkbox]");
  var inputUser = document.querySelector("[data-form] input[name=email]");
  var user = localStorage.getItem("login");
  var userObj = JSON.parse(user);

  if (inputUser != undefined && userObj != undefined) {
    inputUser.value = userObj.email;
    checkbox.checked = true;
  }
}
;// CONCATENATED MODULE: ./public/js/modules/typeRegister.js
function colorRegister() {
  var data = document.querySelectorAll("[data-register='expense']");
  data.forEach(function (item) {
    item.style.color = "red";
  });
}
;// CONCATENATED MODULE: ./public/js/modules/load.js
function loadInit() {
  var load = document.querySelector(".ajax_load");
  load.classList.add("ajax_load_flex");
}
function loadfinish() {
  var load = document.querySelector(".ajax_load");
  load.classList.remove("ajax_load_flex");
}
;// CONCATENATED MODULE: ./public/js/modules/extractFilter.js


function initGetExtract() {
  var form = document.getElementById("extract");
  var btnform = document.getElementById("extractBtn");
  var tbody = document.getElementById("tbody");
  var totalExtract = document.getElementById("totalExtract");

  if (form) {
    var get = function get(e) {
      e.preventDefault();
      var data = new FormData(form);

      if (!data.get("date1")) {
        messageView("Falta preencher a data inicial", "error");
        return;
      }

      if (!data.get("date2")) {
        messageView("falta preencher a data Final", "error");
        return;
      }

      if (!data.get("wallet")) {
        messageView("Escolha uma carteira", "error");
        return;
      }

      var dataInit = {
        method: "POST",
        body: data
      };
      loadInit();
      fetch("/extrato-filter", dataInit).then(function (r) {
        loadfinish();
        return r.json();
      }).then(function (data) {
        tbody.innerHTML = "";
        totalExtract.innerHTML = "";
        var bodyTable = "";
        var statusPay = "";
        data.result.forEach(function (item) {
          if (item.status === true) {
            statusPay = " <p data-pay=\"unpaid\" \n                                            data-type=\"expense\" \n                                            data-idpay=\"".concat(item.id, "\"\n                                            class=\"pay-action\"> \n                                                <i class=\"fas fa-check-circle\"></i>\n                                          </p>");
          } else {
            statusPay = " <p data-pay=\"paid\" \n                                            data-type=\"expense\" \n                                            data-idpay=\"".concat(item.id, "\"\n                                            class=\"pay-action\"> \n                                                <i class=\"fas fa-times-circle\"></i>\n                                        </p>");
          }

          bodyTable += "<tr>\n                                        <td>".concat(item.date, "</td>\n                                        <td>").concat(item.description, "</td>\n                                        <td ").concat(item.type == "expense" ? "style='color:red'" : "", ">").concat(item.value, "</td>\n                                        <td>").concat(statusPay, "</td>\n                                        <td>\n                                            <a href=\"/").concat(item.router, "?id=").concat(item.id, "\">\n                                                <i class=\"fas fa-edit\"></i>\n                                            </a>\n                                        </td>\n                                    </tr>");
        });
        tbody.innerHTML = bodyTable;
        totalExtract.innerHTML = data.total.toLocaleString("pt-br", {
          style: "currency",
          currency: "BRL"
        });

        if (data.total < 0) {
          totalExtract.style.color = "red";
        } else {
          totalExtract.style.color = "blue";
        }
      })["catch"](function (error) {
        console.log(error);
      });
    };

    btnform.addEventListener("click", get);
  }
}
;// CONCATENATED MODULE: ./public/js/scripts.js










initJquery();
initChart();
initPanels();
initChooseWallet();
initMenuMobile();
initLogin();
initUserLogin();
colorRegister();
initGetExtract();
/******/ })()
;