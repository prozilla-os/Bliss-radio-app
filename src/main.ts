import { App } from "@prozilla-os/core";
import { BlissRadio } from "./components/BlissRadio";

const blissRadio = new App("Bliss Radio", "bliss-radio", BlissRadio)
	.setIconUrl("https://blissradio.eu/_next/image?url=https%3A%2F%2Fblissradio.eu%2Fbliss-cover.png&w=256&q=75")
	.setPinnedByDefault(false);

export { blissRadio };