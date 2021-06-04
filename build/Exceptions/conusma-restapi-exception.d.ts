export declare class ConusmaRestApiException extends Error {
    constructor(_statusCode: number, _message: string, _ex?: Error);
    detailEx: Error;
    statusCode: number;
    message: string;
}
