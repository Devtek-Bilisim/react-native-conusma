import { AppService } from "./app.service";
import { ConusmaException } from "./Exceptions/conusma-exception";
import { GuestUserModel } from "./Models/guest-user-model";
import { MeetingModel } from "./Models/meeting-model";
import { MeetingUserModel } from "./Models/meeting-user-model";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Meeting } from "./meeting";
import { DelayTimerList } from "./Timer/delay-timer-list";

export class GuestUser {
  private appService: AppService;

  constructor(_appService: AppService) {
    this.appService = _appService;
  }
  public userInfo: GuestUserModel = new GuestUserModel();
  public async create() {
    DelayTimerList.startTime("GuestUser create");
    var token = await AsyncStorage.getItem('conusmaGuestToken');
    if (token != undefined && token != null) {
      var result = await this.appService.createPublicUser(token);
      this.userInfo = result;
      this.appService.setJwtToken(this.userInfo.Token);
      await AsyncStorage.setItem('conusmaGuestToken', this.userInfo.Token);
    }
    else {
      var result = await this.appService.createPublicUser();
      this.userInfo = result;
      this.appService.setJwtToken(this.userInfo.Token);
      await AsyncStorage.setItem('conusmaGuestToken', this.userInfo.Token);
    }
    DelayTimerList.endTime("GuestUser create");

  }
  public async joinMeetingByInviteCode(inviteCode: string, meetingName: string = 'Guest') {
    try {
      DelayTimerList.startTime("GuestUser joinMeetingByInviteCode");

      var resultcode = await this.appService.controlInviteCode(inviteCode);
      var meeting: MeetingModel = resultcode;
      var result = await this.appService.joinMeeting(meeting.MeetingId, meeting.Password, meetingName);
      var meetingUser: MeetingUserModel = result;
      var activeMeeting = new Meeting(meetingUser, this.appService);
      DelayTimerList.endTime("GuestUser joinMeetingByInviteCode");
      return activeMeeting;
    } catch (error) {
      throw new ConusmaException("joinMeeting", "failed to join the meeting", error);
    }
  }
  public async joinMeeting(meetingId: string, meetingPassword: string, meetingName: string = 'Guest') {
    try {
      var resultcode = await this.appService.isMeetingValid(meetingId, meetingPassword);
      var meeting: MeetingModel = resultcode;
      var result = await this.appService.joinMeeting(meeting.MeetingId, meeting.Password, meetingName);
      var meetingUser: MeetingUserModel = result;
      var activeMeeting = new Meeting(meetingUser, this.appService);
      return activeMeeting;
    } catch (error) {
      throw new ConusmaException("joinMeeting", "failed to join the meeting", error);
    }
  }

}