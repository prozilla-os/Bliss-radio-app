import { AppsConfig } from "@prozilla-os/core";
import { blissRadio } from "../../main";

export const appsConfig = new AppsConfig({
	apps: [
		blissRadio.setPinnedByDefault(true)
			.setLaunchAtStartup(true)
	]
});