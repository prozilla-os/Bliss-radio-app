import { NAME, TAGLINE } from "./branding";
import { CANONICAL } from "./meta";

export const AUDIO_STREAM_URL = "https://radio.codespiral.top/blissradio/stream";
export const AUDIO_DATA_URL = "https://api.blissradio.eu/v1/nowplaying";
export const DEFAULT_VOLUME = 50;
export const FETCH_TRACK_INFO_INTERVAL = 5000;
export const DEFAULT_TRACK_INFO = {
	title: NAME,
	artist: TAGLINE,
	album: NAME,
	art: CANONICAL + "bliss-cover.png",
};