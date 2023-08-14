import http from "http";
import { Response } from "express";

export const uploadVoice = async (req: any, res: Response): Promise<void> => {
	try {
		// Validate the user object
		//@ts-ignore
		if (!req.user) {
			console.error("User object is not correctly set.");
			res.status(500).json({
				message: "User object is not correctly set.",
			});
		}
		//@ts-ignore
		if (!req.user.unlimitedReq) {
			const {
				total_req_left: totalApiRequestsLeft,
				first_name: firstName,
				unlimited_req: unlimitedReq,
				//@ts-ignore
			} = req.userWithNewApiReqRights;

			const proxy = await http.request(
				{
					host: "localhost",
					port: 5000,
					path: "/api/upload",
					method: "POST",
					headers: req.headers,
				},
				async (response) => {
					const chunks: any[] = [];
					response.on("data", (chunk) => chunks.push(chunk));
					response.on("end", () => {
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
		} else {
			const proxy = await http.request(
				{
					host: "localhost",
					port: 5000,
					path: "/api/upload",
					method: "POST",
					headers: req.headers,
				},
				async (response) => {
					const chunks: any[] = [];
					response.on("data", (chunk) => chunks.push(chunk));
					response.on("end", () => {
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
	} catch (error) {
		console.error("Error processing voice upload:", error);
		res.status(500).json({ message: "Internal server error." });
	}
};
