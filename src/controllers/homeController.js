
export const home = (req,res)=>{
  
  
  res.render('pages/widgets/dash/home',{
    data:true,
    expense:true,
    income:true
  });
}