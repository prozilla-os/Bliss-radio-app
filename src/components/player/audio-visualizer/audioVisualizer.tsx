import { useEffect, useRef } from "react";
import styles from "./audioVisualizer.module.css";
import { CANONICAL } from "../../../constants/meta";

interface AudioVisualizerProps {
	audio: HTMLAudioElement | null;
}

const HORIZONTAL_SCALE = 1.5;
const VERTICAL_SCALE = 1.25;
const ASPECT_RATIO = 4 / 1;

const VERTICAL_OFFSET = 0.0;

const FREQUENCY_DATA_SIZE = 128;
const FREQUENCY_SMOOTHING_TIME = 0.95;
const FREQUENCY_DATA_OFFSET = 0;

const COLOR = "hsl(220, 12.5%, 6.25%)";
	
export default function AudioVisualizer({ audio }: AudioVisualizerProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const audioContextRef = useRef<AudioContext | null>(null);
	const analyserNodeRef = useRef<AnalyserNode | null>(null);
	const dataArrayRef = useRef<Uint8Array | null>(null);

	useEffect(() => {
		if (canvasRef.current == null || audio == null) return;

		const canvas = canvasRef.current;

		let canvasWidth = 0, canvasHeight = 0;
		const pixelRatio = window.devicePixelRatio;

		const handleAudioContextResume = async (audioContext: AudioContext) => {
			if (audioContext.state === "suspended") {
				await audioContext.resume();
			}
		};

		const resize = () => {
			const actualCanvasWidth = window.innerWidth;
			const actualCanvasHeight = window.innerWidth / ASPECT_RATIO;

			canvas.style.width = `${actualCanvasWidth}px`;
			canvas.style.height = `${actualCanvasHeight}px`;

			canvasWidth = actualCanvasWidth * HORIZONTAL_SCALE;
			canvasHeight = actualCanvasHeight * VERTICAL_SCALE;

			canvas.width = actualCanvasWidth * pixelRatio;
			canvas.height = actualCanvasHeight * pixelRatio;
		};

		window.addEventListener("resize", resize);
		resize();

		if (!audioContextRef.current) {
			const audioContext = new AudioContext();
			audioContextRef.current = audioContext;

			handleAudioContextResume(audioContext);

			audioContext.audioWorklet?.addModule(CANONICAL + "js/audio-processor.js").then(() => {
				const node = new AudioWorkletNode(audioContext, "audio-processor");
				const source = audioContext.createMediaElementSource(audio);
				const analyserNode = audioContext.createAnalyser();

				analyserNode.fftSize = FREQUENCY_DATA_SIZE;
				analyserNode.smoothingTimeConstant = FREQUENCY_SMOOTHING_TIME;
				dataArrayRef.current = new Uint8Array(analyserNode.frequencyBinCount);

				source.connect(analyserNode);
				analyserNode.connect(audioContext.destination);
				source.connect(node);

				analyserNodeRef.current = analyserNode;

				node.port.onmessage = () => {
					if (canvasRef.current) {
						const context = canvasRef.current.getContext("2d");
						if (context && dataArrayRef.current) {
							analyserNode.getByteFrequencyData(dataArrayRef.current);
							const audioData = dataArrayRef.current;
							const bufferLength = audioData.length;

							context.clearRect(0, 0, canvas.width, canvas.height);

							// Scale the drawing operations
							context.save();
							context.scale(pixelRatio, pixelRatio);

							context.lineWidth = 2;
							context.lineCap = "round";
							context.lineJoin = "round";

							context.beginPath();

							const sliceWidth = canvasWidth / (bufferLength - 1);
							let x = 0;

							const controlPoints = [];
							for (let i = 0; i < bufferLength; i++) {
								const index = i - FREQUENCY_DATA_OFFSET;
								const value = index >= 0 && index < bufferLength ? audioData[i] : 0;

								let y = canvasHeight - (value / 255.0) * canvasHeight;
								y += VERTICAL_OFFSET * canvasHeight * VERTICAL_SCALE;
								controlPoints.push({ x, y });
								x += sliceWidth;
							}

							x = 0;
							context.moveTo(0, controlPoints[0].y);
							for (let i = 1; i < controlPoints.length - 2; i++) {
								const xc = (controlPoints[i].x + controlPoints[i + 1].x) / 2;
								const yc = (controlPoints[i].y + controlPoints[i + 1].y) / 2;
								context.quadraticCurveTo(controlPoints[i].x, controlPoints[i].y, xc, yc);
							}

							context.quadraticCurveTo(
								controlPoints[controlPoints.length - 2].x,
								controlPoints[controlPoints.length - 2].y,
								controlPoints[controlPoints.length - 1].x,
								controlPoints[controlPoints.length - 1].y
							);

							context.lineTo(canvasWidth, canvasHeight);
							context.lineTo(0, canvasHeight);
							context.closePath();

							context.fillStyle = COLOR;
							context.fill();

							context.restore();
						}
					}
				};
			});
		}

		return () => {
			window.removeEventListener("resize", resize);

			if (audioContextRef.current) {
				audioContextRef.current.close();
				audioContextRef.current = null;
			}
		};
	}, [audio]);
	
	return <canvas className={styles.Visualizer} ref={canvasRef}></canvas>;
};