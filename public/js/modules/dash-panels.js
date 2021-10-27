
export default function initPanels(){

    const balance = document.querySelector('[data-balance]');
    const received = document.querySelector('[data-received]');
    const paid = document.querySelector('[data-paid]');
    const balanceMonth = document.querySelector('[data-balanceMonth]');
    if(balance ){

        fetch('/panels').then((response)=>{
            return response.json();
        })
        .then((data)=>{ 
            console.log(data)
            if(!data.balance){
                balance.innerHTML = "R$ 0,00";  
            }else{
                balance.innerHTML = data.balance.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});
            } 
            if(!data.received){
                received.innerHTML = "R$ 0,00";
            }else {
                received.innerHTML = data.received.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});
            }
            if(!data.paid){
                paid.innerHTML = "R$ 0,00";
            }else {
                paid.innerHTML = data.paid.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});
            }
            if(!data.balanceMonth){
                balanceMonth.innerHTML ="R$ 0,00";
            }else{
                balanceMonth.innerHTML = data.balanceMonth.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});
            }

        })
    }



}