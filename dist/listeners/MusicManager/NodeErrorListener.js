"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
class NodeErrorListener extends discord_akairo_1.Listener {
    constructor() {
        super('nodeError', {
            emitter: 'musicManager',
            event: 'nodeError'
        });
    }
    exec(node, error) {
        this.client.logger.error(`Node ${node.options.identifier}:`, error);
    }
}
exports.default = NodeErrorListener;
