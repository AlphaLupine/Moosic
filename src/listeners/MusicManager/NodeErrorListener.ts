import { Listener } from 'discord-akairo';
import { Node } from 'erela.js';

export default class NodeErrorListener extends Listener {
    constructor() {
        super('nodeError', {
            emitter: 'musicManager',
            event: 'nodeError'
        });
    }

    exec(node:Node, error:string) {
       this.client.logger.error(`Node ${node.options.identifier}:`, error)
    }
}