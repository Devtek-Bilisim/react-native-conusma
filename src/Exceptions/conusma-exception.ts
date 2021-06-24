export class ConusmaException extends Error {
    constructor(_type:string,_message:string,_ex?:Error)
    {
        super();
        this.message = _message;
        this.type = _type;
        if(_ex != null)
        {
            var data = JSON.stringify(_ex, Object.getOwnPropertyNames(_ex))
            this.detailEx = JSON.parse(data);
        }
        Object.setPrototypeOf(this, ConusmaException.prototype);
    };
    public detailEx:JSON; 
    public message:string="";
    public type:string="";
    public className:string=""; 
}