class ApiResponse{
     constructor(status,data,message = "sent successfully"){
        this.statuscode = status,
        this.data = data,
        this.message = message
     }
}

export {ApiResponse}