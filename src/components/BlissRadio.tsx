import { WindowProps } from "@prozilla-os/core";
import Player from "./player/Player";

export function BlissRadio({ app, setTitle }: WindowProps) {
	return <Player app={app} setTitle={setTitle}/>;
}