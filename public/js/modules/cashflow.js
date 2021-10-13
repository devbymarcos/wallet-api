export  default function initCashflow(){


  const btnForm = document.querySelector('[data-search="cashFlow"]');
  const form = document.querySelector('[data-form-search="cashFlow"]');
  const tbody = document.querySelector('[data-table="body"]');
  const idCategory = document.querySelectorAll('[data-id]');
  const totalIncome = document.querySelector('[data-tb="tb-income"]');
  const totalExpense = document.querySelector('[data-tb="tb-expense"]');
  const balance = document.querySelector('[data-tb="tb-balance"]');
  const load = document.querySelector('.ajax_load');
  
  const tabelTh = document.querySelector('[data-table="th"]');

  function searchCashFlow(e){
    e.preventDefault()

    // remove elementos html
    let valuesTable = document.querySelectorAll('[data-id] td:not([data-name])');
    valuesTable.forEach((el)=>{
      el.remove();
    })
    
    let monthsTable = document.querySelectorAll('[data-table="th"] th:not([data-name])');
    monthsTable.forEach((el)=>{
      el.remove();
    })

    let grupoCategory = document.querySelectorAll('[data-tb] td:not([data-name])')
    grupoCategory.forEach((el)=>{
        el.remove();
    })
    let formContent = new FormData(form);
    
    load.classList.add('ajax_load_flex'); // loading start
     fetch('/fluxo-data',{
       method:'POST',
       body:formContent
      })
    .then((response)=>{
        
      if(response.status === 204){
        load.classList.remove('ajax_load_flex');
        alert('não ha dados');
        return
      }  

      return response.json();
    })
    .then((body)=>{

        load.classList.remove('ajax_load_flex'); // loading stop
              

      //agrupamento
      const groupByProperties = ['mes'];
      const groupBy = ({ Group: array, By: props }) => {
          let getGroupedItems = (item) => {
            let  returnArray = [];
              let i;
              for (i = 0; i < props.length; i++) {
                  returnArray.push(item[props[i]]);
              }
              return returnArray;
          };
      
          let groups = {};
          let i;
      
          for (i = 0; i < array.length; i++) {
              const arrayRecord = array[i];
              const group = JSON.stringify(getGroupedItems(arrayRecord));
              groups[group] = groups[group] || [];
              groups[group].push(arrayRecord);
          }
          return Object.keys(groups).map((group) => {
              return groups[group];
          });
          
      };
    
      let groupResult =  groupBy( {Group: body['1'], By: groupByProperties} );
      
    // end agrupamento

    function insertTag(elem,value,local){
       const tag = document.createElement(elem);
        tag.textContent = value;
        local.appendChild(tag);
    }

    insertTag('td', body['2'].tIncome.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'}),totalIncome);
    insertTag('td', body['2'].tExpense.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'}),totalExpense);
    insertTag('td', body['2'].tBalance.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'}),balance);
          
      body['0'].forEach((item)=>{
         
        let th = document.createElement('th');
          th.textContent = item.nome;
          th.setAttribute('data-mes',item.id)
          tabelTh.appendChild(th);
      })
      
         
    
        idCategory.forEach((item)=>{
            groupResult.forEach((itens,index,array)=>{
                for(let i=0;i<itens.length;i++){
                    
                    if(itens[i].codigo === parseInt(item.dataset.id)){
                        let td = document.createElement('td');
                        td.textContent = itens[i].preco.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});
                        item.appendChild(td);

                    }
                }
                
            })
        
        })


      
       
    }).catch((err)=>{
        console.log('sem dados para analizar:',err);
    });
    
  }
  if(btnForm){
    btnForm.addEventListener('click',searchCashFlow);
  }
}