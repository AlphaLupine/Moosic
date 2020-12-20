"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
class NodeConnectListener extends discord_akairo_1.Listener {
    constructor() {
        super('nodeConnect', {
            emitter: 'musicManager',
            event: 'nodeConnect'
        });
    }
    exec(node) {
        this.client.logger.log(`Node ${node.options.identifier} successfully connected`);
    }
}
exports.default = NodeConnectListener;
