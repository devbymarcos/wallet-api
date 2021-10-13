export default function initSelectCashFlow(){

  const select  = document.querySelector('[data-select="year"]');

    if(select){
            let nowArr = []
            const now = new Date;
            
            for(let range = 1;range < 13 ;range++){
            nowArr.push({month:range+"/"+now.getFullYear()})
            }
        
            nowArr.forEach((item)=>{

            select.appendChild(new Option(item.month,item.month));

            })


    }
    


}