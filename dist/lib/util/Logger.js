"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
const cli_color_1 = __importDefault(require("cli-color"));
class Logger {
    log(message, ...data) {
        this.emitLogMessage('log', message, data);
    }
    debug(message, ...data) {
        this.emitLogMessage('debug', message, data);
    }
    error(message, ...data) {
        this.emitLogMessage('error', message, data);
    }
    info(message, ...data) {
        this.emitLogMessage('info', message, data);
    }
    emitLogMessage(Type, message, data) {
        let type;
        switch (Type) {
            case 'log':
                type = (cli_color_1.default.green(Type));
                break;
            case 'debug':
                type = (cli_color_1.default.magenta(Type));
                break;
            case 'error':
                type = (cli_color_1.default.red.bold(Type));
                break;
            case 'info':
                type = (cli_color_1.default.blue(Type));
                break;
        }
        if (data.length > 0) {
            console[Type](`[${type}]`, message, data);
        }
        else {
            console[Type](`[${type}]`, message);
        }
    }
}
exports.Logger = Logger;
