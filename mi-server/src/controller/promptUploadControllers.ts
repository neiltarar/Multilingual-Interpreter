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
	const { name: userName, unlimitedReq } = req.user;

	try {
		const {
			selectedLanguage,
			selectedLanguage2,
			selectedFeature,
			promptInput,
		} = req.body;
		let Conversation;
		if (!unlimitedReq) {
			console.log(req.user);
			Conversation = new GPTConversation(
				unlimitedReq,
				req.user.total_req_left,
				req.user.first_name,
				promptInput,
				selectedFeature,
				selectedLanguage,
				selectedLanguage2
			);
		} else {
			Conversation = new GPTConversation(
				unlimitedReq,
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
			case "transcribe":
				let responseData = {
					user: {
						name: req.user.name,
						apiRights: {
							unlimitedReq: req.user.unlimitedReq,
							totalReqLeft: 0,
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
