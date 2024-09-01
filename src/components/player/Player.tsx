import { useCallback, useEffect, useState } from "react";
import styles from "./Player.module.css";
import utilStyles from "../../styles/utils.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePause, faCirclePlay, faPause, faPlay } from "@fortawesome/free-solid-svg-icons";
import Volume from "./volume/Volume";
import BackgroundImage from "./background-image/BackgroundImage";
import { FETCH_TRACK_INFO_INTERVAL, DEFAULT_TRACK_INFO, AUDIO_STREAM_URL, AUDIO_DATA_URL } from "../../constants/player";
import AudioVisualizer from "./audio-visualizer/audioVisualizer";
import { NAME } from "../../constants/branding";
import { formatTrackArtist, formatTrackTitle } from "../../utils/formatting";

export interface TrackInfo {
	track: {
		title: string;
		artist: string;
		album: string;
		art: string;
	},
	streamer?: {
		is_live: boolean;
		name: string;
	}
}

function updateMetadata(title: string | null, artist: string | null, album: string, coverUrl: string) {
	const mediaMetadata = {
		title: formatTrackTitle(title) as string,
		artist: formatTrackArtist(artist) as string,
		album,
		artwork: [{ src: coverUrl }],
	};

	if ("mediaSession" in navigator) {
		navigator.mediaSession.metadata = new MediaMetadata(mediaMetadata);
	}
}

export default function Player({ ...props }) {
	const [trackInfo, setTrackInfo] = useState<TrackInfo | null>(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

	const fetchTrackInfo = () => {
		fetch(AUDIO_DATA_URL) // ty
			.then((response) => response.json())
			.then((data) => {
				const trackInfo = {
					...DEFAULT_TRACK_INFO,
					...data,
				};

				setTrackInfo(trackInfo);
				updateMetadata(trackInfo.title, trackInfo.artist, NAME, trackInfo.art);
			})
			.catch((error) => console.error(error));
	};

	useEffect(() => {
		fetchTrackInfo();
		const interval = setInterval(fetchTrackInfo, FETCH_TRACK_INFO_INTERVAL);
	
		return () => {
		  	clearInterval(interval);
		};
	}, []);

	useEffect(() => {
		if (audio == null)
			return;

		audio.onplay = () => {
			setIsPlaying(true);
		};

		audio.onpause = () => {
			setIsPlaying(false);
		};
	}, [audio]);
	
	const handlePlayPause = useCallback(() => {
		if (isPlaying) {
			if (audio != null) {
				audio.pause?.();
				audio.currentTime = 0;
			}
		} else {
			const newAudio = new Audio(AUDIO_STREAM_URL + "?bliss=" + Math.floor(Math.random() * (999999999 - 111111111 + 1)) + 111111111);
			if (audio?.volume)
				newAudio.volume = audio.volume;
			newAudio.crossOrigin = "anonymous";

			setAudio(newAudio);
			newAudio.play();
		}
	
		setIsPlaying(!isPlaying);
	}, [audio, isPlaying]);

	const trackCoverUrl = trackInfo?.track.art ?? DEFAULT_TRACK_INFO.art; 
	const trackTitle = formatTrackTitle(trackInfo?.track.title ?? DEFAULT_TRACK_INFO.title) as string;
	const trackArtist = formatTrackArtist(trackInfo?.track.artist ?? DEFAULT_TRACK_INFO.artist) as string;
	const streamer = trackInfo?.streamer?.is_live ? trackInfo?.streamer?.name : null;

	return <div className={styles.Container} {...props}>
		<span className={isPlaying ? styles["Track-info"] : `${styles["Track-info"]} ${styles.Paused}`}>
			{streamer
				? <p className={styles["Track-caption"]}><b>{streamer}</b> is on air</p>
				: null
			}
			<button onClick={handlePlayPause} className={styles["Track-cover-button"]}>
				<img src={trackCoverUrl} alt="Album cover" width={250} height={250} className={styles["Track-cover"]}/>
				{isPlaying
					? <FontAwesomeIcon icon={faPause}/>
					: <FontAwesomeIcon icon={faPlay}/>
				}
			</button>
			<p className={`${styles["Track-artist"]} ${utilStyles.Header}`}>{trackTitle}</p>
			<p className={`${styles["Track-title"]} ${utilStyles.Header}`}>{trackArtist}</p>
		</span>
		<div className={styles["Controls"]}>
			<button aria-label={isPlaying ? "Pause" : "Play"} onClick={handlePlayPause}>
				{isPlaying
					? <FontAwesomeIcon icon={faCirclePause}/>
					: <FontAwesomeIcon icon={faCirclePlay}/>
				}
			</button>
			<Volume audio={audio}/>
		</div>
		<AudioVisualizer audio={audio}/>
		<BackgroundImage src={trackCoverUrl}/>
	</div>;
}
