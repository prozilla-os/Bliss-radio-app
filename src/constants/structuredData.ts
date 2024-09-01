import { BOT_INVITE_URL, DISCORD_SERVER_URL } from "@/constants/links";
import { CANONICAL } from "@/constants/meta";

export const ORGANIZATION = {
	"@context": "https://schema.org",
	"@type": "Organization",
	"url": CANONICAL,
	"logo": CANONICAL + "bliss-radio-square.png"
};

export const FAQ = {
	"@context": "https://schema.org",
	"@type": "FAQPage",
	"mainEntity": [
		{
			"@type": "Question",
			"name": "What is Bliss Radio?",
			"acceptedAnswer": {
				"@type": "Answer",
				"text": "<p>Bliss Radio is a 24/7 internet radio station playing all kinds of music genres, operating since 2021.</p>"
			}
		},
		{
			"@type": "Question",
			"name": "How can I listen to Bliss Radio?",
			"acceptedAnswer": {
				"@type": "Answer",
				"text": `<p>There are multiple ways to listen to Bliss Radio. You can listen on the <a href="${CANONICAL}">website</a> or by adding the <a href="${BOT_INVITE_URL}">Bliss Radio Discord bot</a> to your Discord server.</p>`
			}
		},
		{
			"@type": "Question",
			"name": "How can I become a DJ at Bliss Radio?",
			"acceptedAnswer": {
				"@type": "Answer",
				"text": `<p>You can apply to become a presenter at Bliss Radio in our <a href="${DISCORD_SERVER_URL}">official Discord server</a>.</p>`
			}
		}
	]
};