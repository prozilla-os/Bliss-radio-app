import { formatTrackArtist, formatTrackTitle } from "./formatting.js";

const TRACK_TITLES = [
	{
		before: "Dragostea Din Tei (Original Italian Version)",
		after: "Dragostea Din Tei"
	},
	{
		before: "Hologram (DJ Edit)",
		after: "Hologram"
	},
	{
		before: "Country Roads (Radio Version)",
		after: "Country Roads"
	},
	{
		before: "    Track title example     ",
		after: "Track title example"
	},
	{
		before: "B.O.T.A. (Baddest Of Them All)",
		after: "B.O.T.A. (Baddest Of Them All)"
	}
];

const TRACK_ARTISTS = [
	{
		before: "Number One; Number Two, Number Three & Number Four",
		after: "Number One, Number Two, Number Three & Number Four"
	},
	{
		before: "Hüsker Dü; Hüsker Dü",
		after: "Hüsker Dü"
	}
];

TRACK_TITLES.forEach(({ before, after }) => {
	test(`Format track title: "${before}"`, () => {
		expect(formatTrackTitle(before)).toBe(after);
	});
});

TRACK_ARTISTS.forEach(({ before, after }) => {
	test(`Format track artist: "${before}"`, () => {
		expect(formatTrackArtist(before)).toBe(after);
	});
});