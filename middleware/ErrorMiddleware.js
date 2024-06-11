import httpErrors from "../util/HttpError.js"
export const PageNotFound = (req,res,next) => {
    const error = new Error(`Page not found  - ${req.originalUrl}`)
    res.status(404)
    next(error)
}

export const error = (err, req, res, next) => {
    const statusCode = res.statusCode ? res.statusCode : 500
    
    if(err){
        switch (statusCode) {
            case httpErrors.VALIDATION_ERROR:
                res.json({title:"Vaidation Failed",error: err.message, stackTrace: err.stack});
                break;
            case httpErrors.NOT_FOUND:
                res.json({title:"Not found",error: err.message, stackTrace: err.stack});
                break;
            case httpErrors.FORBIDDEN:
                res.json({title:"forbidden",error: err.message, stackTrace: err.stack});
                break;
            case httpErrors.UNAUTHORIZED:
                res.json({title:"Unautorized",error: err.message, stackTrace: err.stack});
                break;
            case httpErrors.SERVER_ERROR:
                res.json({title:"server error",error: err.message, stackTrace: err.stack});
                break;
            case httpErrors.CONFLICT:
                res.json({title:"Conflict",error: err.message, stackTrace: err.stack});
                break;
            
        
            default:
                break;
        }}
    }