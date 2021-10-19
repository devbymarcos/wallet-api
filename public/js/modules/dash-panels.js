
export default function initPanels(){

    const balance = document.querySelector('[data-balance]');
    if(balance){

        fetch('/panels').then((response)=>{
            return response.json();
        })
        .then((data)=>{ 
            console.log(data)
            if(!data){
            balance.innerHTML = "R$ 0,00";  
            
            }else{
                balance.innerHTML = data.balance.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});
            }
        
        })
    }



}