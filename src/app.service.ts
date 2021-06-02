export class AppService {
    private appId:string;
    private apiUrl:string;
    private token:string;
    private deviceId:string;
    constructor(appId:string, parameters:{apiUrl: string,deviceId:string}) {
      this.appId = appId;
      this.apiUrl = parameters.apiUrl;
      this.token = "";
      this.deviceId = parameters.deviceId;
    }
    public setJwtToken(token:string) {
        this.token = token;
    }

    public getJwtToken():string {
        return this.token;
    }
    public async CreateUserWithDeviceID() {
      var response = await fetch(this.apiUrl + "/User/AddUserWithAppCode", {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          }
         ,
          body: JSON.stringify({
            appCode: this.appId,
            deviceCode: this.deviceId,
          })
        });
        return await response.json();
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