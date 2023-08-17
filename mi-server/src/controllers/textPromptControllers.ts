import { Response } from "express";
import { GPTConversation } from "../services/GPTService";

export const textPrompt = async (req: any, res: Response): Promise<any> => {
	// Validate the user object
	if (!req.user) {
		console.error("User object is not correctly set.");
		return res.status(500).send({
			message: "User object is not correctly set.",
		});
	}

	try {
		const {
			selectedLanguage,
			selectedLanguage2,
			selectedFeature,
			promptInput,
		} = req.body;

		const { name: userName, unlimitedReq } = req.user;
		console.log(userName);
		let Conversation;

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
					message: "Transcription Feature is for speech only.",
				};

				res.json(responseData);
				break;
			default:
				res.json({
					message: "Couldn't understand what you asked for",
				});
				break;
		}
	} catch (error) {}
};
