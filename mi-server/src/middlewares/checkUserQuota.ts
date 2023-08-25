import { Request, Response, NextFunction } from "express";
import { GPTConversation } from "../services/GPTService";
import { userModels } from "../models/userModel";

export const checkUserQuota = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  //@ts-ignore
  const { userId } = req.user;
  //@ts-ignore
  const foundUser = await userModels.findUserById(userId);
  if (!foundUser) {
    return res.status(404).send({ message: "User not found" });
  }

  const {
    first_name: userName,
    unlimited_req: unlimitedReq,
    total_req_left: totalReqLeft,
  } = foundUser;
  if (!unlimitedReq && totalReqLeft < 1) {
    const Conversation = new GPTConversation(
      unlimitedReq,
      totalReqLeft,
      userName,
    );
    const responseData = Conversation.sendNoApiTokenMessage();
    return res.status(429).send(responseData);
  } else if (!unlimitedReq && totalReqLeft > 0) {
    try {
      const userWithNewApiReqRights =
        await userModels.apiRequestDeduction(userId);

      if (!userWithNewApiReqRights) {
        const Conversation = new GPTConversation(
          unlimitedReq,
          totalReqLeft,
          userName,
        );
        const responseData = Conversation.sendNoApiTokenMessage();
        return res.status(429).send(responseData);
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
