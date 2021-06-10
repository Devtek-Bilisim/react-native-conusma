import EventEmitter from 'events';
import BackgroundTimer from 'react-native-background-timer';
import { ConusmaException } from "./Exceptions/conusma-exception";

export class backgroundTimer
{
    public tickEventEmitter:EventEmitter = new EventEmitter();

    public start(interval:number)
    {
        this.timerId = BackgroundTimer.setTimeout(() => {
              if(this.timeoutActive)
              {
                  this.tickEventEmitter.emit('timeout');
                  this.start(interval);
              }
        }, interval);
    }
    timerId:any;
    timeoutActive:boolean = true;
    public terminate() {
        try {
            this.timeoutActive = false;
            this.tickEventEmitter.removeAllListeners();
            BackgroundTimer.clearTimeout(this.timerId);
            BackgroundTimer.stop();

        } catch (error) {
            throw new ConusmaException("ConusmaWorker","terminated interval error",error);
        }
    }
}