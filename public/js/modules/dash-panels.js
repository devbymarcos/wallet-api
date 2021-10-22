
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
            //console.log(data)
            if(!data){
            balance.innerHTML = "R$ 0,00";  
            received.innerHTML = "R$ 0,00";
            paid.innerHTML = "R$ 0,00";
            balanceMotnh.innerHTML ="R$ 0,00";
            }else{
                balance.innerHTML = data.balance.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});
                received.innerHTML = data.received.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});
                paid.innerHTML = data.paid.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});
                balanceMonth.innerHTML = data.balanceMonth.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});
            }
        
        })
    }



}