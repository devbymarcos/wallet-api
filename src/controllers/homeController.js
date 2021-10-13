
export const home = (req,res)=>{
    const userName  = req.session.fullName;
    console.log(req.session.fullName)
  res.render('pages/widgets/dash/home',{
    data:true,
    expense:true,
    income:true,
    userName
  });
}