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
    public async createUserWithDeviceId() {
      var response = await fetch(this.apiUrl + "/User/AddUserWithAppCode", {
          method: 'POST',
          headers: {
            accept: 'application/json',
            'content-type': 'application/json',
          },
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
              accept: 'application/json',
              'content-type': 'application/json',
              'Token': this.token
            }
          });
          return await response.json();
    }

    public async isApproved(meetingUserId:string)
    {
      var response = await fetch(this.apiUrl + "/Live/IsItApproved/"+meetingUserId, {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          'Token': this.token
        }
      });
      return await response.json();
    }

    public async getMeetings() {
      var response = await fetch(this.apiUrl + "/Meeting/GetMeetings", {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          'Token': this.token
        }
      });
      return await response.json();
    }

    public async joinMeeting(meetingId:number) {
      var response = await fetch(this.apiUrl + "/Meeting/JoinMeeting", {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          'Token': this.token
        },
        body: JSON.stringify({
          meetingId: meetingId,
        })
      });
      return await response.json();
    }
  
}