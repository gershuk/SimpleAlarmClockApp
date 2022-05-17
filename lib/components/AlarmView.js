import * as React from 'react';

import { View } from 'react-native';
import { IconButton, Headline, Switch } from 'react-native-paper';

import Moment from 'moment';

class AlarmView extends React.Component {

    RemoveAlarm() { this.props.OnAlarmRemoved({ id: this.props.id }); }

    async SwitchAlarmStatus() {
        await this.props.alarm.SwitchStatus();
        this.setState(this.props);
        this.props.OnAlarmStatusChanged({ id: this.props.id });
    }

    render() {
        return (
            <View style={{ flexDirection: 'row', alignItems: 'center', margin: 8, borderRadius: 20, borderWidth: 2, borderColor: this.props.theme.colors.disabled }}>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', marginLeft: 10 }}>
                    <IconButton icon="close" size={24} onPress={this.RemoveAlarm.bind(this)} />
                    <Headline>
                        {Moment(this.props.alarm.CalcNotificationDateTime()).format('HH:mm')}
                    </Headline>
                </View>

                <View>
                    <Switch value={this.props.alarm.IsActive} onValueChange={this.SwitchAlarmStatus.bind(this)} style={{ marginRight: 5 }} />
                </View>
            </View>
        );
    }
}

export default AlarmView;
