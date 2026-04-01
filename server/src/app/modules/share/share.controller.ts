import { Request, Response } from "express";
import { asyncHandler, sendSuccessResponse } from "../../utils";
import { shareService } from "./share.service";

export const shareController = {
  sharePost: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const result = await shareService.sharePost(
      userId,
      req.params.postId as string,
    );
    sendSuccessResponse(res, {
      statusCode: result.alreadyShared ? 200 : 201,
      message: result.alreadyShared
        ? "Already shared"
        : "Post shared successfully",
      data: result,
    });
  }),

  getShareUsers: asyncHandler(async (req: Request, res: Response) => {
    const shares = await shareService.getShareUsers(
      req.params.postId as string,
    );
    sendSuccessResponse(res, {
      message: "Shares fetched successfully",
      data: shares,
    });
  }),
};
