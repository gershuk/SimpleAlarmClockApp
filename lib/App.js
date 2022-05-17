import 'intl';
import 'intl/locale-data/jsonp/en';

import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider, Modal, withTheme } from 'react-native-paper';

import * as Notifications from 'expo-notifications';

import AlarmNotify from './components/AlarmNotify';
import HomeScreen from './screens/HomeScreen';
import CreationScreen from './screens/CreationScreen';
import RadioPlayer from './models/RadioPlayer';
import AlarmContainer from './models/AlarmContainer';

const Stack = createNativeStackNavigator();

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});

export default class App extends React.Component {
    constructor() {
        super();
        Notifications.addNotificationReceivedListener(
            async notification => {
                const alarms = AlarmContainer.Instance.GetByNotifyId({ id: notification.request.identifier });
                for (let alarm of alarms) {
                    await alarm.Cancel();
                    await AlarmContainer.Instance.SaveData();
                }
                RadioPlayer.Instance.Play({ uri: notification.request.content.data.RadioInfo.uri });
                this.state.CurrentRadioName = notification.request.content.data.RadioInfo.title;
                this.state.IsAlarmNotifyVisible = true;
                this.setState(this.state);
            });
    }

    state = {
        IsAlarmNotifyVisible: false,
        CurrentRadioName: "",
    }

    async CloseNotify() {
        await RadioPlayer.Instance.Stop();
        this.state.IsAlarmNotifyVisible = false;
        this.setState(this.state);
    }

    render() {
        return (
            <PaperProvider>
                <NavigationContainer>
                    <Stack.Navigator initialRouteName="Home" screenOptions={{ header: () => { } }}>
                        <Stack.Screen name="Home" component={withTheme(HomeScreen)} />
                        <Stack.Screen name="Creation" component={withTheme(CreationScreen)} />
                    </Stack.Navigator>
                </NavigationContainer>
                <Modal visible={this.state.IsAlarmNotifyVisible} dismissable={false} >
                    <AlarmNotify radioName={this.state.CurrentRadioName} onHide={this.CloseNotify.bind(this)} />
                </Modal>
            </PaperProvider>
        );
    }
}
