const cache: object = {};
export default class NowPlayingCache {
    public get(key: string) {
        return cache[key];
    }

    public set(key: string, value: string) {
        cache[key] = value;
    }
}