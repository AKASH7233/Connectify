class ApiErrResponse{
    constructor(error){
        this.statuscode = error.statuscode,
        this.error = error.message
    }
}

export {ApiErrResponse}