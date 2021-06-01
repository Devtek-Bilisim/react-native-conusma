export class AppService {
    private appId:string;
    private apiUrl:string;
    private token:string;
  
    constructor(appId:string, parameters:{apiUrl: string}) {
      this.appId = appId;
      this.apiUrl = parameters.apiUrl;
      this.token = "";
    }
    public setJwtToken(token:string) {
        this.token = token;
    }

    public getJwtToken():string {
        return this.token;
    }
    public async getMediaServer(meetingUserId:string) {
        var response = await fetch(this.apiUrl + "/Live/GetMediaServer/"+meetingUserId, {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              'Token': this.token
            }
          });
          return await response.json();
    }
}