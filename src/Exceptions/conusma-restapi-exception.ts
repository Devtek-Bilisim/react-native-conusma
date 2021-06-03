export class ConusmaRestApiException extends Error {
    constructor(_statusCode:number,_message:string,_ex?:Error)
    {
        super();
        this.message = _message;
        this.statusCode = _statusCode;
        if(_ex != null)
        {
            this.detailEx = _ex;
        }
        console.error(JSON.stringify(this));
    };
    public detailEx:Error = new Error(); 
    public statusCode:number=0;
    public message:string=""; 
}