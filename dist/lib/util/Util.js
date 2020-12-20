"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Util {
}
exports.default = Util;
Util.msConversion = (ms) => {
    if (!ms)
        return null;
    const rounded = ms > 0 ? Math.floor : Math.ceil;
    const times = {
        days: rounded(ms / 86400000),
        hours: rounded(ms / 3600000) % 24,
        minutes: rounded(ms / 60000) % 60,
        seconds: rounded(ms / 1000) % 60,
        milliseconds: rounded(ms) % 1000
    };
    const string = [
        +times.days ? times.days < 10 ? `0${times.days}` : times.days : "",
        +times.hours ? times.hours < 10 ? `0${times.hours}` : times.hours : "",
        +times.minutes ? times.minutes < 10 ? `0${times.minutes}` : times.minutes : "",
        +times.seconds ? times.seconds < 10 ? `0${times.seconds}` : times.seconds : ""
    ]
        .filter((x) => x).join(':');
    return Object.assign(Object.assign({}, times), { string });
};
Util.toCapitalise = (string) => {
    if (!string)
        return null;
    return string.split(' ').map(str => str.slice(0, 1).toUpperCase() + str.slice(1)).join(' ');
};
