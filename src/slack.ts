import type { Handler } from '@netlify/functions';

import { parse } from 'querystring';
import { slackApi } from './util/slack';

async function handleSlashCommand(payload: SlackSlashCommandPayload) {
	switch (payload.command) {
		case '/foodfight':
			const joke = await fetch('https://icanhazdadjoke.com', {
				method: 'GET',
				headers: { accept: 'text/plain' }
			});
			const response = await slackApi('chat.postMessage', {
				channel: payload.channel_id,
				text: await joke.text(),
			});

			if (!response.ok) {
				console.log(response)
			}

			break;

		default:
			return {
				statusCode: 200,
				body: `Command ${payload.command} is not recognized`
			}
	}

	return {
		statusCode: 200,
		body: ''
	}
}

export const handler: Handler = async (event) => {
	// TODO validate the Slack request

	const body = parse(event.body ?? '') as SlackPayload;

	if (body.command) {
		return handleSlashCommand(body as SlackSlashCommandPayload)
	}

	// TODO handle slash commands

	// TODO handle interactivity (e.g. context commands, modals)

	return {
		statusCode: 200,
		body: 'TODO: handle Slack commands and interactivity',
	};
};
