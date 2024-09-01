import styles from "./BackgroundImage.module.css";
import { CSSProperties, memo, useEffect, useState } from "react";

interface BackgroundImageProps {
	src: string;
}

export default memo(function BackgroundImage({ src }: BackgroundImageProps) {
	const [blurFactor, setBlurFactor] = useState(1);

	useEffect(() => {
		const updateBlurFactor = () => {
			const newBlurFactor = Math.max(window.outerWidth, window.outerHeight);
	
			// Only update blur factor if it has changed
			setBlurFactor((blurFactor) => newBlurFactor != blurFactor ? newBlurFactor : blurFactor);
		};

		if (!window)
			return;

		updateBlurFactor();

		window.onresize = () => {
			updateBlurFactor();
		};
	}, []);

	return (
		<img src={src} alt="Album cover" width={250} height={250} className={styles["Image"]} style={{
			"--blur-factor": blurFactor
		} as CSSProperties}/>
	);
});