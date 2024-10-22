
const searchHelpers = (searchKey,query,req)=>{
    if(req.query.search){
        const searchObject = {};
        const regex = new RegExp(req.query.search,"i");
        searchObject[searchKey] = regex;
        return query = query.where(searchObject); 
    }
    return query;
}
const populateHelper = (query,population)=>{
    return query.populate(population);
}
const questionSortHelper = (query,req)=>{
    const sortKey =req.query.sortBy;    
    if(sortKey==="most-answered"){
        return query = query.sort("-answercount");
    }
    if(sortKey==="most-liked"){
        return query = query.sort("-likecount");
    }
    return query.sort("-creadeAt")
    
};
const paginationHelper = async(totalDocuments,query,req)=>{
    const page = Number(req.query.page)||1;
    const limit = Number(req.query.limit)||5;

    const startIndex = (page-1)*limit;
    const endIndex = page*limit;

    const pagination ={};
    const total = totalDocuments;
    if(startIndex>0){
        pagination.previous ={
            page : page-1,
            limit : limit
        }
    };
    if(endIndex<total){
        pagination.next = {
            page : page+1,
            limit : limit
        }
    };
    return {
        query :  query === undefined ? undefined :query.skip(startIndex).limit(limit),
        pagination : pagination,
        startIndex,
        limit
    }
};
module.exports = {
    searchHelpers,
    populateHelper,
    questionSortHelper,
    paginationHelper
};