import { Audio } from 'expo-av';

class RadioPlayer {
    static Instance = RadioPlayer.Instance || new RadioPlayer();

    constructor() { this._audio = new Audio.Sound(); }

    async Play({ uri }) {
        await this.Stop();
        try {
            await this._audio.loadAsync({ uri: uri });
            await this._audio.playAsync();
        } catch (err) {
            console.warn(`Can't play radio from uri : ${uri}.\n${err}`);
        }
    }

    async Stop() { await this._audio.unloadAsync(); }
}

export default RadioPlayer;
