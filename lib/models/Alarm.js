import * as Notifications from 'expo-notifications';

import AppDefines from '../../defines/AppDefines';

import uuid from 'react-native-uuid';

class Alarm {

    constructor(hours, minutes, radioInfo, notifyId = '', isActive = false) {
        this.Hours = hours;
        this.Minutes = minutes;
        this.RadioInfo = radioInfo;
        this.NotifyId = notifyId.toString();
        this.IsActive = isActive;
    }

    static ConstructFromDate({ date, radioInfo }) {
        return new Alarm(date.getHours(), date.getMinutes(), radioInfo);
    }

    static ConstructFromJson({ jsonObject }) {
        return new Alarm(jsonObject.Hours, jsonObject.Minutes, jsonObject.RadioInfo, jsonObject.NotifyId, jsonObject.IsActive);
    }

    async SwitchStatus() {
        if (this.IsActive) {
            await this.Cancel();
        } else {
            await this.Schedule();
        }
    }

    async Schedule() {
        this.IsActive = true;
        this.NotifyId = await Notifications.scheduleNotificationAsync({
            content: {
                title: AppDefines.TitleNotification,
                data: { RadioInfo: this.RadioInfo},
            },
            trigger: {
                hour: this.Hours,
                minute: this.Minutes,
                repeats: true,
            },
        });
        console.log(this.NotifyId);
    }

    async Cancel() {
        this.IsActive = false;
        await Notifications.cancelScheduledNotificationAsync(this.NotifyId);
        this.NotifyId = '';
    }

    CalcNotificationDateTime() {
        result = new Date();
        result.setHours(this.Hours);
        result.setMinutes(this.Minutes);
        result.setSeconds(0);
        // Add one day
        if (result < new Date())
            result = new Date(result.getTime() + 86400000);
        return result;
    }
}

export default Alarm;
