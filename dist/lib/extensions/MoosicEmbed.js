"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
class MoosicEmbed extends discord_js_1.MessageEmbed {
    constructor(data) {
        super(data);
        this.setMain();
    }
    setMain() {
        return this.setColor("#8B008B");
    }
    setSuccess() {
        return this.setColor("#32CD32");
    }
    setFail() {
        return this.setColor("#FF0000");
    }
    setCaution() {
        return this.setColor("#FF8C00");
    }
    addEmptyField() {
        return this.addField('\u200b', '\u200b');
    }
}
exports.default = MoosicEmbed;
