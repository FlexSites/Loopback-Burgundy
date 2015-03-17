module.exports = function(){
  return function(req,res,next){
    req.url = '/'+ req.abbr + '/public' + req.url;
    
    console.log('***** API PREFIX *****');
    next();
  };
};
