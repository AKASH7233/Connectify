class ApiErrResponse{
    constructor(error){
        this.success = false
        this.statuscode = error.statuscode,
        this.error = error.message
    }
}

export {ApiErrResponse}