import initPanels from './dash-panels.js';
import initChart from './highchart.js';
export default function initJquery(){

$(function () {
   
  const conf_url_app = $("#basepath").attr("path");
  var ajaxResponseBaseTime = 3;
  var ajaxResponseRequestError = "<div class='message error icon-warning'>Desculpe mas não foi possível processar sua requisição...</div>";
  
  // ABRE O CAMPO PARA PARCELAS O FIXO NO LANÇAMENTO DA INVOICE
    $('input[name="repeat_when"]').on("click", function () {
      var repeat_when = $(this).val();

      switch (repeat_when) {
          case 'installments':
              $('#fixed').slideUp();
              $('#installments').slideDown();
              break;
          case 'fixed':
              $('#installments').slideUp();
              $('#fixed').slideDown();
         
              break;
          default:
              $('#fixed,#installments').slideUp();
      }
      
    })
  //MOSTRA FORM DE RECUPERAÇÃO DE SENHA
    $('.btn-action').click(function(){
           
          var formVisibilit = $('.form-step:visible')
          var formHidden = $('.form-step:hidden')

          formVisibilit.fadeOut(200,function(){
              formHidden.fadeIn(200);
          })



    })
  
  // ALTERA O STATUS DE PAGAMENTO DAS INVOICES

  $(document).on('click', '.pay-action', function () {
      var classe = $(this).attr('class');
      var dataPay = $(this).attr('data-pay');
      var idPay = $(this).attr('data-idpay');
      var type = $(this).attr('data-type');
      var action = "update";
      var acao = "flash_list";
      var router = "";

      switch(type){
        case'income':
         router = "/income/save";
        break;
        case'fixed_income':
        router = "/income/save";
        break;
        
        case'expense':
        router = "/expense/save";
        break;
        case'fixed_expense':
        router = "/income/save";
        break;
      }
       

       var icon = $(this).find("i");
      icon.toggleClass("fa-check-circle fa-times-circle")

      if (dataPay == 'paid') {
          $(this).attr('data-pay', "unpaid");

      } else {
          $(this).attr('data-pay', "paid");

      }

      $.post(router, {pay: dataPay, id: idPay, action: action, acao: acao}, function (response) {
        initChart();
        initPanels();
          
        if (response.message) {
            let message = `<div class='message ${response.type}'>${response.message}</div>`;
                ajaxMessage(message, ajaxResponseBaseTime);
                
        }

      }, 'json');
  });

      
  //PESQUISA NO FORM DE LANÇAMENTO
  $('#search_input').keyup(function () {
      var router = $(this).attr('router');
      search = $(this).val();

      $.post(router, {search: search}, function (data) {
          console.log(data);
          $(".result-form").html(data);
          $(".search_item").show(300);

      });
  });
  //INSERE A PESQUISA NO INPUT
  $(document).on('click', '.search_item', function () {
      var texto = $(this).text();
      /*var valor = $(this).attr('data-valor');*/

      $('#search_input').val(texto);
      /*$('.vunit1').val(valor);*/
      $('.search_item').hide(200);


  });


  //DATA SET
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
          beforeSend: function () {
              load.fadeIn(200).css("display", "flex");
          },
          success: function (response) {
              //redirect
              if (response.redirect) {
                  window.location.href = response.redirect;
              } else {
                  load.fadeOut(200);
              }

              //reload
              if (response.reload) {
                  window.location.reload();
              } else {
                  load.fadeOut(200);
              }

              //message
              if (response.message) {
                let message = `<div class='message ${response.type}'>${response.message}</div>`;
                  ajaxMessage(message, ajaxResponseBaseTime);
              }
          },
          error: function () {
              ajaxMessage(ajaxResponseRequestError, 5);
              load.fadeOut();
          }
      });
  });
  //FORMS

  $("form:not('.ajax_off')").submit(function (e) {
      e.preventDefault();

      var form = $(this);
      var load = $(".ajax_load");

      if (typeof tinyMCE !== 'undefined') {
          tinyMCE.triggerSave();
      }

      form.ajaxSubmit({
          url: form.attr("action"),
          type: "POST",
          dataType: "json",
          beforeSend: function () {
              load.fadeIn(200).css("display", "flex");
          },
          uploadProgress: function (event, position, total, completed) {
              var loaded = completed;
              var load_title = $(".ajax_load_box_title");
              load_title.text("Enviando (" + loaded + "%)");

              form.find("input[type='file']").val(null);
              if (completed >= 100) {
                  load_title.text("Aguarde, carregando...");
              }
          },
          success: function (response) {
              console.log(response.message);
              //redirect
              if (response.redirect) {
                  window.location.href = response.redirect;
              } else {
                  load.fadeOut(200);
              }

              //reload
              if (response.reload) {
                  window.location.reload();
              } else {
                  load.fadeOut(200);
              }

              //message
              if (response.message) {
                let message = `<div class='message ${response.type}'>${response.message}</div>`;
                  ajaxMessage(message, ajaxResponseBaseTime);
              }



          },
          complete: function () {
              if (form.data("reset") === true) {
                  form.trigger("reset");
              }
          },
          error: function () {
              var message = ajaxResponseRequestError;
              ajaxMessage(message, 5);
              load.fadeOut();
          }
      });
  });

  // AJAX RESPONSE

  function ajaxMessage(message, time) {
      var ajaxMessage = $(message);

      ajaxMessage.append("<div class='message_time'></div>");
      ajaxMessage.find(".message_time").animate({"width": "100%"}, time * 1000, function () {
          $(this).parents(".message").fadeOut(200);
      });

      $(".ajax_response").append(ajaxMessage);
      ajaxMessage.effect("slide");
  }

  // AJAX RESPONSE MONITOR

  $(".ajax_response .message").each(function (e, m) {
      ajaxMessage(m, ajaxResponseBaseTime += 1);
  });

  // AJAX MESSAGE CLOSE ON CLICK

  $(".ajax_response").on("click", ".message", function (e) {
      $(this).effect("bounce").fadeOut(1);
  });

  // MAKS

  // $(".mask-date").mask('00/00/0000');
  // $(".mask-mobile").mask('(00)00000-0000');
  // $(".mask-phone").mask('(00)0000-0000');
  // $(".mask-datetime").mask('00/00/0000 00:00');
  // $(".mask-month").mask('00/0000', {reverse: true});
  // $(".mask-doc").mask('000.000.000-00', {reverse: true});
  // $(".mask-card").mask('0000  0000  0000  0000', {reverse: true});
  // $(".mask-money").mask('000.000.000.000.000,00', {reverse: true, placeholder: "0,00"});

});






/*jquery end*/



//PREVIEW DE IMAGE ANTES DO UPLOAD


  
  
  function  previewImage()
  {     let image = document.querySelector("input[data-cover=preview]");
        let preview = document.querySelector("img[data-cover=cover-img]");
        if(image){
            image.addEventListener('change',()=>{
                let reader = new FileReader();
    
                reader.onloadend = function () {
                    preview.setAttribute('src', reader.result);
                }
            
                if (image.files[0]) {
                    reader.readAsDataURL(image.files[0])
                }
            });
        }
       
    
    

  }
  previewImage();


/* SLIDE UP */
let slideUp = (target, duration=500) => {

  target.style.transitionProperty = 'height, margin, padding';
  target.style.transitionDuration = duration + 'ms';
  target.style.boxSizing = 'border-box';
  target.style.height = target.offsetHeight + 'px';
  target.offsetHeight;
  target.style.overflow = 'hidden';
  target.style.height = 0;
  target.style.paddingTop = 0;
  target.style.paddingBottom = 0;
  target.style.marginTop = 0;
  target.style.marginBottom = 0;
  window.setTimeout( () => {
          target.style.display = 'none';
          target.style.removeProperty('height');
          target.style.removeProperty('padding-top');
          target.style.removeProperty('padding-bottom');
          target.style.removeProperty('margin-top');
          target.style.removeProperty('margin-bottom');
          target.style.removeProperty('overflow');
          target.style.removeProperty('transition-duration');
          target.style.removeProperty('transition-property');
          //alert("!");
  }, duration);
}

/* SLIDE DOWN */
let slideDown = (target, duration=500) => {

  target.style.removeProperty('display');
  let display = window.getComputedStyle(target).display;
  if (display === 'none') display = 'block';
  target.style.display = display;
  let height = target.offsetHeight;
  target.style.overflow = 'hidden';
  target.style.height = 0;
  target.style.paddingTop = 0;
  target.style.paddingBottom = 0;
  target.style.marginTop = 0;
  target.style.marginBottom = 0;
  target.offsetHeight;
  target.style.boxSizing = 'border-box';
  target.style.transitionProperty = "height, margin, padding";
  target.style.transitionDuration = duration + 'ms';
  target.style.height = height + 'px';
  target.style.removeProperty('padding-top');
  target.style.removeProperty('padding-bottom');
  target.style.removeProperty('margin-top');
  target.style.removeProperty('margin-bottom');
  window.setTimeout( () => {
      target.style.removeProperty('height');
      target.style.removeProperty('overflow');
      target.style.removeProperty('transition-duration');
      target.style.removeProperty('transition-property');
  }, duration);
}

/* TOOGLE */
var slideToggle = (target, duration = 500) => {
  if (window.getComputedStyle(target).display === 'none') {
      return slideDown(target, duration);
  } else {
      return slideUp(target, duration);
  }
}


// Abre e fecha menu mobile
let btnMobile = document.querySelector(".btn-mobile");
let navMobile = document.querySelector(".navigation__mobile");

    if(btnMobile){
        btnMobile.addEventListener("click",function(){
        slideToggle(navMobile);
        })
    }


}