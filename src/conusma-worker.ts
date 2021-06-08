import { AppService } from "./app.service";
import { MeetingUserModel } from "./Models/meeting-user-model";
import BackgroundTimer from 'react-native-background-timer';
import { EventEmitter } from 'events';
import { ConusmaException } from "./Exceptions/conusma-exception";

export class ConusmaWorker {


    constructor(_appService: AppService, _meetingUser: MeetingUserModel) {
        this.appService = _appService;
        this.meetingUser = _meetingUser;
    }
    public meetingWorkerEvent: EventEmitter = new EventEmitter();
    private saveEventData = { 'MeetingUsers': '', 'ChatUpdates': '', 'MeetingUpdate': '' };
    private meetingUser: MeetingUserModel;
    private appService: AppService;
    private iAmHereInterval: number = 0;
    private meetingChangeEventInterval: number = 0;
    private async controlMeetingEvent() {
        try {
            var events = await this.appService.GetMeetingEvents(this.meetingUser.Id);
            var eventData: { 'MeetingUsers': '', 'ChatUpdates': '', 'MeetingUpdate': '' } = events;
            if (eventData.MeetingUsers != this.saveEventData.MeetingUsers) {
                this.saveEventData.MeetingUsers = eventData.MeetingUsers;
                this.meetingWorkerEvent.emit('meetingUsers', { 'MeetingUsers': this.saveEventData.MeetingUsers });
            }
            if (eventData.ChatUpdates != this.saveEventData.ChatUpdates) {
                this.saveEventData.ChatUpdates = eventData.ChatUpdates;
                this.meetingWorkerEvent.emit('chatUpdates', { 'ChatUpdates': this.saveEventData.ChatUpdates });
            }
            if (eventData.MeetingUpdate != this.saveEventData.MeetingUpdate) {
                this.saveEventData.MeetingUpdate = eventData.MeetingUpdate;
                this.meetingWorkerEvent.emit('meetingUpdate', { 'MeetingUpdate': this.saveEventData.MeetingUpdate });
            }
        } catch (error) {

        }
    }
    private async iAmHere() {
        try {
            await this.appService.IAmHere(this.meetingUser.Id);

        } catch (error) {

        }
    }
    public start() {
        this.iAmHereInterval = BackgroundTimer.setInterval(() => {
            this.iAmHere();
        }, 20000);
        this.meetingChangeEventInterval = BackgroundTimer.setInterval(() => {
            this.controlMeetingEvent();
        }, 3000);
    }
    public terminate() {
        try {
            BackgroundTimer.clearInterval(this.iAmHereInterval);
            BackgroundTimer.clearInterval(this.meetingChangeEventInterval);
        } catch (error) {
            throw new ConusmaException("ConusmaWorker","terminated interval error",error);
        }
    }
}