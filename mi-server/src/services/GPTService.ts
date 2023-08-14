import axios from "axios";

const CHAT_GPT_API_KEY = process.env.CHAT_GPT_API_KEY;

// Fail gracefully if api key cannot be found
if (!CHAT_GPT_API_KEY) {
	throw new Error("CHAT_GPT_API_KEY environment variable not set!");
}

export class GPTConversation {
	// Define types for class properties
	isUnlimitedRequest: boolean;
	totalApiRequestsLeft: number;
	userName: string;
	promptText: string;
	feature: string;
	sourceLanguage: string;
	targetLanguage: string;
	gptResponse: string;
	header: Record<string, string>;
	gptTranslateData: Record<string, any>;
	gptHelperData: Record<string, any>;

	constructor(
		isUnlimitedRequest: boolean = false,
		totalApiRequestsLeft: number = 0,
		userName: string,
		promptText: string = "test",
		feature: string = "gpthelper",
		sourceLanguage: string = "english",
		targetLanguage: string = "turkish"
	) {
		this.isUnlimitedRequest = isUnlimitedRequest;
		this.totalApiRequestsLeft = totalApiRequestsLeft;
		this.userName = userName;
		this.promptText = promptText;
		this.feature = feature;
		this.sourceLanguage = sourceLanguage;
		this.targetLanguage = targetLanguage;
		this.gptResponse = "";
		this.header = {
			"Content-Type": "application/json",
			"Authorization": `Bearer ${CHAT_GPT_API_KEY}`,
		};
		this.gptTranslateData = {
			model: "gpt-4",
			messages: [
				{
					role: "system",
					content:
						"You are a helpful multilingual translator. You always try to translate from source to target languages by trying to stay true to the meaning, culture and its context.",
				},
				{
					role: "user",
					content: `Translate the following from source:${this.sourceLanguage} into target:${this.targetLanguage}: '${this.promptText}'`,
				},
			],
			temperature: 0.3,
			max_tokens: 2000,
			top_p: 1.0,
			frequency_penalty: 0.0,
			presence_penalty: 0.0,
		};
		this.gptHelperData = {
			model: "gpt-4",
			messages: [
				{
					role: "system",
					content:
						"You are a helpful assistant, who is polite and asks for further information when needed to help better.",
				},
				{ role: "user", content: `${this.promptText}` },
			],
			temperature: 0.3,
			max_tokens: 2000,
			top_p: 1.0,
			frequency_penalty: 0.0,
			presence_penalty: 0.0,
		};
	}

	#setResponseObject() {
		if (this.isUnlimitedRequest) {
			const responseData = {
				user: {
					name: this.userName,
					apiRights: {
						unlimitedReq: this.isUnlimitedRequest,
						totalReqLeft: this.totalApiRequestsLeft,
					},
				},
				message: this.gptResponse,
			};
			return responseData;
		} else if (this.totalApiRequestsLeft <= 0) {
			console.log("total req in GPT service: ", this.totalApiRequestsLeft);
			const responseData = {
				user: {
					name: this.userName,
					apiRights: {
						unlimitedReq: this.isUnlimitedRequest,
						totalReqLeft: this.totalApiRequestsLeft,
					},
				},
				message:
					"You have exhausted all your API request tokens.\nContact the admin on neiltarar@gmail.com",
			};
			return responseData;
		}
	}

	async translate(): Promise<string | any> {
		try {
			const response = await axios.post(
				"https://api.openai.com/v1/chat/completions",
				this.gptTranslateData,
				{ headers: this.header }
			);
			this.gptResponse = response.data.choices[0].message.content.trim();
			const responseData: Record<string, any> | undefined =
				await this.#setResponseObject();
			return responseData;
		} catch (error) {
			console.error("Error:", error);
			throw new Error("An error occurred; contact the admin");
		}
	}

	async gptHelper(): Promise<string | any> {
		try {
			const response = await axios.post(
				"https://api.openai.com/v1/chat/completions",
				this.gptHelperData,
				{ headers: this.header }
			);
			this.gptResponse = response.data.choices[0].message.content.trim();
			const responseData: Record<string, any> | undefined =
				await this.#setResponseObject();
			return responseData;
		} catch (error) {
			console.error("Error:", error);
			throw new Error("An error occurred; contact the admin");
		}
	}

	async sendNoApiTokenMessage(): Promise<string | any> {
		const responseData: Record<string, any> | undefined =
			await this.#setResponseObject();
		return responseData;
	}
}
