export default class Util {
    /**
     * @param ms - number
     * Returns a formatted time from ms - dd:hh:mm:ss 
     */
    static msConversion = (ms?: number | null) => {
        if(!ms) return null;

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
        return { ...times, string };
    };
    /**
     * @param string - string
     * Returns a string with the first character being capitalised
     */
    static toCapitalise = (string?: string | null) => {
        if(!string) return null;
        return string.split(' ').map(str => str.slice(0, 1).toUpperCase() + str.slice(1)).join(' ');
    };
}