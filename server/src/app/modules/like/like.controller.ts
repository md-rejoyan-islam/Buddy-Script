import { Request, Response } from "express";
import { asyncHandler, sendSuccessResponse } from "../../utils";
import { likeService } from "./like.service";

export const likeController = {
  togglePostLike: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const reaction = req.body?.reaction || "like";
    const result = await likeService.togglePostLike(
      userId,
      req.params.postId as string,
      reaction,
    );
    sendSuccessResponse(res, {
      message: result.liked ? "Post liked" : "Post unliked",
      data: result,
    });
  }),

  toggleCommentLike: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const reaction = req.body?.reaction || "like";
    const result = await likeService.toggleCommentLike(
      userId,
      req.params.commentId as string,
      reaction,
    );
    sendSuccessResponse(res, {
      message: result.liked ? "Comment liked" : "Comment unliked",
      data: result,
    });
  }),

  toggleReplyLike: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const reaction = req.body?.reaction || "like";
    const result = await likeService.toggleReplyLike(
      userId,
      req.params.replyId as string,
      reaction,
    );
    sendSuccessResponse(res, {
      message: result.liked ? "Reply liked" : "Reply unliked",
      data: result,
    });
  }),

  getLikeUsers: asyncHandler(async (req: Request, res: Response) => {
    const likes = await likeService.getLikeUsers(
      req.params.type as string,
      req.params.id as string,
    );
    sendSuccessResponse(res, {
      message: "Likes fetched successfully",
      data: likes,
    });
  }),
};
