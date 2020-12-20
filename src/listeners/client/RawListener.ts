import { Listener } from 'discord-akairo';

export default class RawListener extends Listener {
    constructor() {
        super('raw', {
            emitter: 'client',
            event: 'raw'
        });
    }

    exec(data) {
        this.client.musicManager.updateVoiceState(data);
    }
}