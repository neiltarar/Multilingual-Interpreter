import http from "http";
import { userModels } from "../models/userModel";

interface User {
	id: number;
	first_name: string;
	last_name: string;
	email: string;
	password_hash: string;
	is_activated: boolean;
	unlimited_req: boolean;
	total_req_left: number;
}

export const uploadVoice = async (req: any, res: any): Promise<any> => {
	// Validate the user object
	if (!req.user) {
		console.error("User object is not correctly set.");
		return res.status(500).send({
			message: "User object is not correctly set.",
		});
	}

	const user = req.user;
	const userId = user.userId;
	const unlimitedApiRights = user.unlimitedReq;
	if (!unlimitedApiRights) {
		const userWithNewApiReqRights = await userModels.apiRequestDeduction(
			userId
		);
		if (
			!userWithNewApiReqRights ||
			userWithNewApiReqRights.total_req_left === 0
		) {
			// User has no more requests left, return an error response
			res.status(200).send({
				apiStatus: false,
				message:
					"You have used up all your requests. Please upgrade your plan or wait until your quota is renewed.",
			});
			return;
		}
	}

	const proxy = await http.request(
		{
			host: "localhost",
			port: 5000,
			path: "/api/upload",
			method: "POST",
			headers: req.headers,
		},
		(response) => {
			response.pipe(res);
		}
	);

	req.pipe(proxy);
};
