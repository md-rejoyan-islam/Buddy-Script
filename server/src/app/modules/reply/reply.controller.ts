import { Request, Response } from "express";
import { asyncHandler, sendSuccessResponse } from "../../utils";
import { replyService } from "./reply.service";

export const replyController = {
  create: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const reply = await replyService.create(
      req.params.commentId as string,
      userId,
      req.body,
    );
    sendSuccessResponse(res, {
      statusCode: 201,
      message: "Reply created successfully",
      data: reply,
    });
  }),

  getByCommentId: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const replies = await replyService.getByCommentId(
      req.params.commentId as string,
      userId,
    );
    sendSuccessResponse(res, {
      message: "Replies fetched successfully",
      data: replies,
    });
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const reply = await replyService.update(
      req.params.id as string,
      userId,
      req.body,
    );
    sendSuccessResponse(res, {
      message: "Reply updated successfully",
      data: reply,
    });
  }),

  delete: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    await replyService.delete(req.params.id as string, userId);
    sendSuccessResponse(res, {
      message: "Reply deleted successfully",
    });
  }),
};
