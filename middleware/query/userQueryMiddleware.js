const asyncErrorWrapper = require("express-async-handler");
const {searchHelpers,paginationHelper} = require("./queryMiddlewareHelpers");
const userQueryMiddleware = function(model , option) {
    return asyncErrorWrapper(async function(req,res,next){
        let query = model.find();
        query = query.searchHelpers("name",query,req);
        const total = await model.countDocuments();
        const paginationResult = await paginationHelper(model,query,req);

        query = paginationResult.query;
        pagination = paginationResult.pagination;

        const queryResult = await query.find();
        res.queryResult = {
            success : true,
            count :queryResult.length,
            pagination : pagination,
            data : queryResult
        }
        next();
    })
}
module.exports = {userQueryMiddleware};