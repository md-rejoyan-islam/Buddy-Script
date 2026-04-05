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
    const cursor = req.query.cursor as string | undefined;
    const limit = req.query.limit ? Number(req.query.limit) : 10;

    const { data, nextCursor } = await commentService.getByPostId(
      req.params.postId as string,
      userId,
      { cursor, limit },
    );

    sendSuccessResponse(res, {
      message: "Comments fetched successfully",
      data: { comments: data, nextCursor },
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
