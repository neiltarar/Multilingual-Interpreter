// utils/sendVoiceData.ts

import { Readable } from "stream";
import axios, { AxiosResponse } from "axios";
import FormData from "form-data";

interface VoiceFile {
	buffer: Buffer;
	originalname: string;
	mimetype: string;
}

interface SendVoiceDataResult {
	success: boolean;
	data?: AxiosResponse;
	error?: any;
}

/**
 * Sends voice data to the given endpoint.
 *
 * @param {VoiceFile} voiceFile - The voice file object.
 * @param {string} selectedTranscriptionSpeed - Transcription speed.
 * @param {string} selectedLanguage - Selected language.
 *
 * @returns {Promise<SendVoiceDataResult>} - The result of sending voice data.
 */
export const sendVoiceData = async (
	voiceFile: VoiceFile,
	selectedTranscriptionSpeed: string,
	selectedLanguage: string
): Promise<SendVoiceDataResult> => {
	const stream = new Readable();
	stream.push(voiceFile.buffer);
	stream.push(null); // Signal the end of file contents

	const form = new FormData();
	form.append("recordedSound", stream, {
		filename: voiceFile.originalname,
		contentType: voiceFile.mimetype,
	});
	form.append("selectedTranscriptionSpeed", selectedTranscriptionSpeed);
	form.append("selectedLanguage", selectedLanguage);

	try {
		const response = await axios.post(
			`${process.env.MICROSERVICE_SERVER_IP}/api/prompt-voice`,
			form,
			{
				headers: {
					...form.getHeaders(),
				},
			}
		);

		return {
			success: true,
			data: response,
		};
	} catch (error) {
		console.error("Error sending voice data:", error);
		return {
			success: false,
			error: error,
		};
	}
};
