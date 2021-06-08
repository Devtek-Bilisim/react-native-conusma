export declare class ConusmaException extends Error {
    constructor(_type: string, _message: string, _ex?: Error);
    detailEx: Error;
    message: string;
    type: string;
    className: string;
}
