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
        let stringArr = [
            String(times.days).padStart(2, '0'),
            String(times.hours).padStart(2, '0'),
            String(times.minutes).padStart(2, '0'),
            String(times.seconds).padStart(2, '0')
        ]
            let string = stringArr.filter((x, i) => x !== '00' || i === stringArr.length - 1).join(':');
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