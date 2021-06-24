export class ConusmaRestApiException extends Error {
    constructor(_statusCode:number,_message:string,_ex?:Error)
    {
        super();
        this.message = _message;
        this.statusCode = _statusCode;
        if(_ex != null)
        {
            var data = JSON.stringify(_ex, Object.getOwnPropertyNames(_ex))
            this.detailEx = JSON.parse(data);
        }
        Object.setPrototypeOf(this, ConusmaRestApiException.prototype);

    };
    public detailEx:JSON; 
    public statusCode:number=0;
    public message:string=""; 
}