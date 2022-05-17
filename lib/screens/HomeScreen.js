import * as React from 'react';

import { View, ScrollView } from 'react-native';

import { Appbar } from 'react-native-paper';

import AlarmView from '../components/AlarmView';
import AppDefines from '../../defines/AppDefines';
import AlarmContainer from '../models/AlarmContainer';

class HomeScreen extends React.Component {

    constructor() {
        super();
        this.state.alarmContainer.LoadData(() => { this.setState(this.state); });
    }

    state = { alarmContainer: AlarmContainer.Instance }

    OnAlarmAdded() { this.props.navigation.navigate("Creation"); }

    OnAlarmRemoved({ id }) {
        this.state.alarmContainer.DeleteByIndex({ id: id });
        this.setState(this.state);
    }

    OnAlarmStatusChanged() { this.state.alarmContainer.SaveData(); console.log("saved"); }

    componentDidUpdate() { this.Update(); }

    Update() {
        if (this.props.route.params && this.props.route.params.newAlarm != null) {
            this.state.alarmContainer.Add({ alarm: this.props.route.params.newAlarm });
            this.props.route.params.newAlarm = null;
            this.setState(this.state);
        }
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: this.props.theme.colors.background }}>
                <Appbar.Header>
                    <Appbar.Content title={AppDefines.TitleHomeScreen} />
                    <Appbar.Action icon="plus" onPress={this.OnAlarmAdded.bind(this)} />
                </Appbar.Header>
                <ScrollView>
                    {
                        this.state.alarmContainer.GetAll().map(
                            (alarm, i) => (
                                <AlarmView key={i} id={i} alarm={alarm} theme={this.props.theme}
                                    OnAlarmRemoved={this.OnAlarmRemoved.bind(this)}
                                    OnAlarmStatusChanged={this.OnAlarmStatusChanged.bind(this)}
                                />
                            )
                        )
                    }
                </ScrollView>
            </View>
        );
    }
}

export default HomeScreen;
