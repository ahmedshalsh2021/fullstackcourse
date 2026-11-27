function errorHandler(error, req, res, next){
    console.log(error);
    res.status(500).render('shared/500' , {pageTitle: 'Something went wrong!'});
}
module.exports = errorHandler;