const asyncErrorWrapper = require("express-async-handler");
const { searchHelpers,populateHelper,questionSortHelper,paginationHelper } = require("./queryMiddlewareHelpers");
const question = require("../../models/question");
const questionQueryMiddleware = function(model , option) {
    return asyncErrorWrapper(async function(req,res,next){
        let query = model.find();
        
        query = searchHelpers("title",query,req);
        if(option && option.population){
            query = populateHelper(query,option.population);
        }
        query = questionSortHelper(query,req);
        const total = await model.countDocuments();
        const paginationResult = await paginationHelper(total,query,req);
        query  = paginationResult.query;
        const pagination = paginationResult.pagination;

        const queryResult = await query;
        res.queryResult = {
            success : true,
            count :queryResult.length,
            pagination : pagination,
            data : queryResult
        }
        next();
    })
}
module.exports = questionQueryMiddleware;