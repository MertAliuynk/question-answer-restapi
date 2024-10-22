const asyncErrorWrapper = require("express-async-handler");
const {populateHelper,paginationHelper } = require("./queryMiddlewareHelpers");
const Answer = require("../../models/answer");
const answerQueryMiddleware = function(model , option) {
    return asyncErrorWrapper(async function(req,res,next){
        const {id} = req.params;
        const arrayName = "answers";
        const total = (await model.findById(id))["answercount"];
        const paginationResult = await paginationHelper(total,undefined,req);
        const startIndex = paginationResult.startIndex;
        const limit = paginationResult.limit;
        let queryObject ={};
        queryObject[arrayName] = {$slice : [startIndex,limit]};
        let query  = model.find({_id : id},queryObject);
        query = populateHelper(query,option.population);
        const queryResult = await query;
        res.queryResult = {
            success :true,
            pagination : paginationResult.pagination,
            data : queryResult
        };

        next();
    })
}
module.exports = answerQueryMiddleware;