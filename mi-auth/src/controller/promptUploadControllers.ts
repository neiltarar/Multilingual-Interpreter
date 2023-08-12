import http from "http";
import { Response } from "express";

export const uploadPrompt = async (req: any, res: Response): Promise<any> => {
	// Validate the user object
	if (!req.user) {
		console.error("User object is not correctly set.");
		return res.status(500).send({
			message: "User object is not correctly set.",
		});
	}
	if (!req.user.unlimitedReq) {
		const {
			total_req_left: totalApiRequestsLeft,
			first_name: firstName,
			unlimited_req: unlimitedReq,
		} = req.userWithNewApiReqRights;

		try {
			if (!unlimitedReq && totalApiRequestsLeft === 0) {
				return res.status(429).json({
					user: {
						name: firstName,
						apiRights: {
							unlimitedReq: unlimitedReq,
							totalReqLeft: totalApiRequestsLeft,
						},
					},
					message:
						"You have exhausted all your API request tokens.\nContact the admin on neiltarar@gmail.com",
				});
			}

			const proxy = await http.request(
				{
					host: "localhost",
					port: 5000,
					path: "/api/prompt",
					method: "POST",
					headers: req.headers,
				},
				async (response) => {
					const chunks: any[] = [];
					response.on("data", (chunk) => chunks.push(chunk));
					response.on("end", () => {
						//@ts-ignore
						const responseBody = Buffer.concat(chunks);
						// Try to parse the response as JSON
						let responseData;
						try {
							responseData = JSON.parse(responseBody.toString());
						} catch (error) {
							// If parsing as JSON fails, return a generic error (this shouldn't happen since all routes return JSON)
							console.error(
								"Failed to parse proxy server response as JSON:",
								error
							);
							return res
								.status(500)
								.json({ message: "Proxy server returned unexpected data." });
						}
						// Modify the response
						responseData.user = {
							name: firstName,
							apiRights: {
								unlimitedReq: unlimitedReq,
								totalReqLeft: totalApiRequestsLeft,
							},
						};
						res.json(responseData);
					});
				}
			);
			req.pipe(proxy);
		} catch (error) {
			console.error("Error deducting API request count for user:", error);
			return res.status(500).send({ message: "Internal server error." });
		}
	} else {
		const proxy = await http.request(
			{
				host: "localhost",
				port: 5000,
				path: "/api/prompt",
				method: "POST",
				headers: req.headers,
			},
			async (response) => {
				const chunks: any[] = [];
				response.on("data", (chunk) => chunks.push(chunk));
				response.on("end", () => {
					//@ts-ignore
					const responseBody = Buffer.concat(chunks);
					// Try to parse the response as JSON
					let responseData;
					try {
						responseData = JSON.parse(responseBody.toString());
					} catch (error) {
						// If parsing as JSON fails, return a generic error (this shouldn't happen since all routes return JSON)
						console.error(
							"Failed to parse proxy server response as JSON:",
							error
						);
						return res
							.status(500)
							.json({ message: "Proxy server returned unexpected data." });
					}
					// Modify the response
					responseData.user = {
						name: req.user.name,
						apiRights: {
							unlimitedReq: req.user.unlimitedReq,
							totalReqLeft: 0,
						},
					};
					res.json(responseData);
				});
			}
		);
		req.pipe(proxy);
	}
};
