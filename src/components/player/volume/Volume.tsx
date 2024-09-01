import styles from "./Volume.module.css";
import { faVolumeDown, faVolumeMute, faVolumeOff, faVolumeUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { memo, useEffect, useState } from "react";
import { DEFAULT_VOLUME } from "../../../constants/player";

interface VolumeProps {
	audio: HTMLAudioElement | null;
}

export default memo(function Volume({ audio }: VolumeProps) {
	const [initialized, setInitialized] = useState(false);
	const [volume, setVolume] = useState(DEFAULT_VOLUME);
	const [isMuted, setIsMuted] = useState(false);

	useEffect(() => {
		if (audio != null) {
			audio.volume = volume / 100;
			audio.muted = isMuted;
		}

		if (initialized) {
			localStorage.setItem("volume", volume.toString());
		}
	}, [audio, volume, isMuted, initialized]);

	useEffect(() => {
		if (!initialized) {
			const loadedVolume = localStorage.getItem("volume");

			if (loadedVolume) {
				setVolume(parseFloat(loadedVolume));
			}

			setInitialized(true);
		}
	}, [initialized]);

	useEffect(() => {
		if (audio == null)
			return;

		audio.onvolumechange = (event) => {
			const newVolume = (event.target as HTMLAudioElement).volume * 100;

			if (newVolume) {
				setVolume(newVolume);
			}

			const { muted } = event.target as HTMLAudioElement;

			if (muted != null && muted != isMuted)
				setIsMuted(muted);
		};
	}, [audio, isMuted]);

	const handleVolumeChange = ({ target }: { target: HTMLInputElement }) => {
		const { value } = target;

		localStorage.setItem("volume", value);
		setVolume(parseFloat(value));
		setIsMuted(false);
	};
	
	const handleMuteToggle = () => {
		setIsMuted(!isMuted);

		if (audio != null)
			audio.volume = isMuted ? volume / 100 : 0;
	};

	let volumeIcon;
	
	if (isMuted) {
		volumeIcon = faVolumeMute;
	} else if (volume == 0) {
		volumeIcon = faVolumeOff;
	} else if (volume < 50) {
		volumeIcon = faVolumeDown;
	} else {
		volumeIcon = faVolumeUp;
	}

	return (<div className={styles["Volume-controls"]}>
		<button aria-label={isMuted ? "Unmute" : "Mute"} onClick={handleMuteToggle}>
			<FontAwesomeIcon icon={volumeIcon}/>
		</button>
		<input
			type="range"
			className={styles["Volume-slider"]}
			aria-label="Volume"
			min={0}
			max={100}
			step={1}
			value={isMuted ? 0 : volume}
			onChange={handleVolumeChange}
		/>
	</div>);
});