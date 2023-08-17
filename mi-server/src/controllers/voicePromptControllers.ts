import { Response } from "express";
import { GPTConversation } from "../services/GPTService";
import { sendVoiceData } from "../utils/sendVoiceData";

export const voicePromt = async (req: any, res: Response): Promise<void> => {
	// Validate the user object
	if (!req.user) {
		console.error("User object is not correctly set.");
		res.status(500).json({
			message: "User object is not correctly set.",
		});
	}

	try {
		const {
			selectedLanguage,
			selectedLanguage2,
			selectedFeature,
			selectedTranscriptionSpeed,
		} = req.body;

		const { name: userName, unlimitedReq } = req.user;

		const { file: voiceFile } = req;
		let promptInput;
		let Conversation;

		const result = await sendVoiceData(
			voiceFile,
			selectedTranscriptionSpeed,
			selectedLanguage
		);

		if (result.success) {
			promptInput = result.data?.data.message;
		} else {
			if (
				result.error &&
				result.error.response &&
				result.error.response.status < 500
			) {
				// It's a client error
				res
					.status(result.error.response.status)
					.json({ message: "Client error." });
			} else {
				throw new Error("Error during voice data processing.");
			}
		}

		if (!unlimitedReq) {
			Conversation = new GPTConversation(
				unlimitedReq,
				req.user.total_req_left,
				userName,
				promptInput,
				selectedFeature,
				selectedLanguage,
				selectedLanguage2
			);
		} else {
			Conversation = new GPTConversation(
				unlimitedReq,
				req.user.total_req_left,
				userName,
				promptInput,
				selectedFeature,
				selectedLanguage,
				selectedLanguage2
			);
		}

		switch (selectedFeature.toLowerCase()) {
			case "gpthelper":
				Conversation.gptHelper().then((response) => res.json(response));
				break;
			case "translate":
				Conversation.translate().then((response) => res.json(response));
				break;
			case "imagegenerator":
				Conversation.imageGenerator().then((response) => res.json(response));
				break;
			case "transcribe":
				let responseData = {
					user: {
						name: userName,
						apiRights: {
							unlimitedReq: unlimitedReq,
							totalReqLeft: req.user.total_req_left
								? req.user.total_req_left
								: 0,
						},
					},
					message: promptInput,
				};

				res.json(responseData);
				break;
			default:
				res.json({
					message: "Couldn't understand what you asked for",
				});
				break;
		}
	} catch (error) {
		console.error("Error processing voice upload:", error);
		res.status(500).json({ message: "Internal server error." });
	}
};
