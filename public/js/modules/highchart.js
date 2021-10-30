
export default function initChart(){

    const load = document.querySelector('.ajax_load');
    const charDiv = document.querySelector('#chartContainer');
    const wallet = document.getElementById('wallet-panels');
    let  walletValue = '';
    
    if(charDiv){

        walletValue = new FormData(wallet);
        
        fetch('/chartdata',{
            method:'POST',
            body:walletValue
        }).then((r)=>{
            
        //load.classList.remove('ajax_load_flex');
        return r.json();

        }).then((data)=>{
            
            Highcharts.setOptions({
                lang: {
                    decimalPoint: ',',
                    thousandsSep: '.'
                },
                
            });
            Highcharts.chart(charDiv, {
                chart: {
                    backgroundColor: 'transparent',
                    type: 'areaspline'
                },
                title: {
                    text: 'Receitas x Despesas'
                },
                subtitle: {
                    text: ''
                },
                xAxis: {
                    categories: data.months,
                    crosshair: true
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: ''
                    }
                },
                tooltip: {
                    shared: true,
                    valueDecimals: 2,
                    valuePrefix: 'R$ '
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
                    name: 'Receitas',
                    data: data.income,
                    color: '#61DDBC',
                    lineColor: '#36BA9B'
        
                }, {
                    name: 'Despesas',
                    data: data.expense,
                    color: '#f76c82',
                    lineColor: '#D94352'
        
                }],
        
            });
        })
    }
}