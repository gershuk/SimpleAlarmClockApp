import * as React from 'react';

import { View } from 'react-native';

import { Appbar, Button, Headline, List } from 'react-native-paper';
import { TimePickerModal } from 'react-native-paper-dates';

import Moment from 'moment';

import Alarm from '../models/Alarm';
import RadioInfo from '../models/RadioInfo';
import AppDefines from '../../defines/AppDefines';

const Radios = [
    new RadioInfo({ title: "CalmRadio - Vivaldi", uri: "http://23.82.11.87:8928/stream" }),
    new RadioInfo({ title: "Metal Live Radio", uri: "http://51.255.8.139:8738/stream" }),
    new RadioInfo({ title: "Hits Of Bollywood", uri: "http://198.50.156.92:8255/stream" }),
];

class CreationScreen extends React.Component {
    constructor() {
        super();
        this.state.selectedRadio = Radios[0];
        this.state.time.setMinutes(this.state.time.getMinutes() + 1);
    }

    state = {
        time: new Date(),
        selectedRadio: null,
        pickedTime: false,
        isRadioListExpanded: false,
    }

    Cancel() { this.props.navigation.goBack(); }

    Confirm() {
        this.props.navigation.navigate("Home", ({
            newAlarm: Alarm.ConstructFromDate({
                date: this.state.time,
                radioInfo: this.state.selectedRadio
            })
        }));
    }

    RequestTime() {
        this.state.pickedTime = true;
        this.setState(this.state);
    }

    ConfirmPickedTime({ hours, minutes }) {
        this.state.time.setHours(hours);
        this.state.time.setMinutes(minutes);
        this.DismissPickedTime();
    }

    DismissPickedTime() {
        this.state.pickedTime = false;
        this.setState(this.state);
    }

    OpenRadioList() {
        this.state.isRadioListExpanded = true;
        this.setState(this.state);
    }

    CloseRadioList() {
        this.state.isRadioListExpanded = false;
        this.setState(this.state);
    }

    RadioPicked({ id }) {
        this.state.selectedRadio = Radios[id];
        this.CloseRadioList();
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: this.props.theme.colors.background}}>
                <Appbar.Header>
                    <Appbar.Action icon="arrow-left" onPress={this.Cancel.bind(this)} />
                    <Appbar.Content title={AppDefines.TitleCreateionScreen} />
                    <Appbar.Action icon="check" onPress={this.Confirm.bind(this)} />
                </Appbar.Header>
                <View style={{ flex: 1, backgroundColor: this.props.theme.colors.background, flexDirection: 'column', alignItems: 'stretch' }}>
                    <Button mode="text"
                        color={this.props.theme.colors.text}
                        onPress={this.RequestTime.bind(this)}
                        style={{ padding: 25, alignSelf: 'stretch' }}
                        labelStyle={{ fontSize: 72 }}
                    >
                        {Moment(this.state.time).format('HH:mm')}
                    </Button>

                    <Headline style={{ fontSize: 24, lineHeight: 32, marginTop: 20, marginLeft: 20, textAlign: 'left' }}>
                        {AppDefines.TitleRadioChoose}
                    </Headline>

                    <List.Accordion title={this.state.selectedRadio.title} expanded={this.state.isRadioListExpanded} onPress={this.OpenRadioList.bind(this)}>
                        {
                            Radios.map((radio, i) =>
                                    (<List.Item key={i} title={radio.title} onPress={() => { this.RadioPicked({ id: i }); }} style={{ marginLeft: 15 }} />))
                        }
                    </List.Accordion>
                </View>

                <TimePickerModal
                    visible={this.state.pickedTime}
                    onDismiss={this.DismissPickedTime.bind(this)}
                    onConfirm={this.ConfirmPickedTime.bind(this)}
                    hours={this.state.time.hours}
                    minutes={this.state.time.minutes}
                />

            </View>
        );
    }
}

export default CreationScreen;

