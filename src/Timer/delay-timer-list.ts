import { DelayTime } from "./delay-timer";

export class DelayTimerList {
static timeList:Map<string,DelayTime> =  new Map();
static startTime(key:string)
    {
        try {
            var time_1 = this.timeList.get(key);
            if(time_1 == null)
            {
                var time:DelayTime = new DelayTime();
                time.key = key;
                time.start = new Date().getTime();
                this.timeList.set(key,time);
            }
            else
            {
                time_1.key = key;
                time_1.start = new Date().getTime();
            }
          
        } catch (error) {
            console.log("not start time");
        }
   
    }
    static endTime(key:string)
    {
        try {
            var time = this.timeList.get(key);
            if(time != null )
            {
                time.end = new Date().getTime();
            }
        } catch (error) {
            console.log("not end time");
        }
      
    }
    static getLog()
    {
         var responseArray = new Array();   
        this.timeList.forEach(element => {
            var obj = {'key':element.key,'dif':element.end-element.start};
            responseArray.push(obj);
        });
        return responseArray;
    }
}