import { Request, Response, NextFunction } from "express";
import { userModels } from "../models/userModel";

export const checkUserQuota = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	//@ts-ignore
	const { userId } = req.user;
	const foundUser = await userModels.findUserById(userId);
	if (!foundUser) {
		return res.status(404).send({ message: "User not found" });
	}
	const { unlimited_req: unlimitedReq, total_req_left: totalReqLeft } =
		foundUser;

	if (!unlimitedReq && totalReqLeft <= 0) {
		return res.status(429).send({
			apiStatus: false,
			message:
				"You have used up all your requests. Please upgrade your plan or wait until your quota is renewed.",
		});
	} else if (!unlimitedReq && totalReqLeft > 0) {
		try {
			const userWithNewApiReqRights = await userModels.apiRequestDeduction(
				userId
			);

			if (!userWithNewApiReqRights) {
				return res.status(429).send({
					apiStatus: false,
					message:
						"You have used up all your requests. Please upgrade your plan or wait until your quota is renewed.",
				});
			}

			//@ts-ignore
			req.user = userWithNewApiReqRights;
			next();
		} catch (error) {
			console.error("Error deducting API request count for user:", error);
			return res.status(500).send({ message: "Internal server error." });
		}
	} else {
		next();
	}
};
