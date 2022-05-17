import * as FS from 'expo-file-system';

import Alarm from './Alarm';

class AlarmContainer {
    _alarmsList = [];

    static _defaultFileName = "simpleAppData.json";
    static Instance = AlarmContainer.Instance || new AlarmContainer();

    Count() { return this._alarmsList.length;}

    GetAll() { return this._alarmsList; }

    GetByIndex({ id }) { return this._alarmsList[id]; }

    GetByNotifyId({ id }) { return this._alarmsList.filter(value => value.NotifyId == id); console.log(id); }

    Add({ alarm }) {
        this._alarmsList.push(alarm);
        this.SaveData();
    }

    DeleteByIndex({ id }) {
        alarm = this.GetByIndex({ id: id });
        if (alarm.IsActive) 
            alarm.Cancel();
        this._alarmsList.splice(id, 1);
        this.SaveData();
    }

    async SaveData(name = this._defaultFileName) {
        await FS.writeAsStringAsync(FS.documentDirectory + '/' + name, JSON.stringify(this._alarmsList));
    }

    async LoadData(continuation , name = this._defaultFileName) {
        this._alarmsList = [];
        const path = FS.documentDirectory + '/' + name
        const fileInfo = await FS.getInfoAsync(path);
        if (!fileInfo.exists) {
            console.log("Data file not found");
            return;
        }
        FS.readAsStringAsync(path)
            .then((jsonData) => {
                JSON.parse(jsonData).map((alarmJson) => {
                    this._alarmsList.push(Alarm.ConstructFromJson({ jsonObject: alarmJson }));
                });
                continuation();
            })
            .catch((err) => {
                this._alarmsList = [];
                console.warn(`Data corrupted.\n ${err}`)
            });       
    }
}

export default AlarmContainer;
