import { Listener } from 'discord-akairo';
import { Node } from 'erela.js';

export default class NodeConnectListener extends Listener {
    constructor() {
        super('nodeConnect', {
            emitter: 'musicManager',
            event: 'nodeConnect'
        });
    }

    exec(node:Node) {
       this.client.logger.log(`Node ${node.options.identifier} successfully connected`)
    }
}