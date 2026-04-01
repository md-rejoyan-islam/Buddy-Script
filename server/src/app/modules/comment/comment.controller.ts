import { Request, Response } from "express";
import { asyncHandler, sendSuccessResponse } from "../../utils";
import { commentService } from "./comment.service";

export const commentController = {
  create: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const comment = await commentService.create(
      req.params.postId as string,
      userId,
      req.body,
    );
    sendSuccessResponse(res, {
      statusCode: 201,
      message: "Comment created successfully",
      data: comment,
    });
  }),

  getByPostId: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const comments = await commentService.getByPostId(
      req.params.postId as string,
      userId,
    );
    sendSuccessResponse(res, {
      message: "Comments fetched successfully",
      data: comments,
    });
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const comment = await commentService.update(
      req.params.id as string,
      userId,
      req.body,
    );
    sendSuccessResponse(res, {
      message: "Comment updated successfully",
      data: comment,
    });
  }),

  delete: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    await commentService.delete(req.params.id as string, userId);
    sendSuccessResponse(res, {
      message: "Comment deleted successfully",
    });
  }),
};
