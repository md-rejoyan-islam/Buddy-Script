import { Request, Response } from "express";
import {
  asyncHandler,
  sendSuccessResponse,
  uploadImage,
  deleteImage,
} from "../../utils";
import { postService } from "./post.service";

export const postController = {
  create: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    let imageUrl: string | undefined;

    if (req.file) {
      imageUrl = await uploadImage(req.file, "posts");
    }

    const post = await postService.create(userId, {
      ...req.body,
      image: imageUrl,
    });

    sendSuccessResponse(res, {
      statusCode: 201,
      message: "Post created successfully",
      data: post,
    });
  }),

  getFeed: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const cursor = req.query.cursor as string | undefined;
    const limit = req.query.limit ? Number(req.query.limit) : 10;

    const { data, nextCursor } = await postService.getFeed(userId, {
      cursor,
      limit,
    });

    sendSuccessResponse(res, {
      message: "Feed fetched successfully",
      data: { posts: data, nextCursor },
    });
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const post = await postService.getById(req.params.id as string, userId);
    sendSuccessResponse(res, {
      message: "Post fetched successfully",
      data: post,
    });
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const postId = req.params.id as string;
    const removeImage = req.body.removeImage === "true" || req.body.removeImage === true;
    let imageUrl: string | null | undefined;

    if (req.file) {
      const existingPost = await postService.getById(postId, userId);
      if (existingPost?.image) {
        await deleteImage(existingPost.image);
      }
      imageUrl = await uploadImage(req.file, "posts");
    } else if (removeImage) {
      const existingPost = await postService.getById(postId, userId);
      if (existingPost?.image) {
        await deleteImage(existingPost.image);
      }
      imageUrl = null;
    }

    // Strip the flag so it doesn't leak into Prisma
    const { removeImage: _removeImage, ...body } = req.body;

    const post = await postService.update(postId, userId, {
      ...body,
      ...(imageUrl !== undefined && { image: imageUrl }),
    });

    sendSuccessResponse(res, {
      message: "Post updated successfully",
      data: post,
    });
  }),

  delete: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const postId = req.params.id as string;

    const existingPost = await postService.getById(postId, userId);
    if (existingPost?.image) {
      await deleteImage(existingPost.image);
    }

    await postService.delete(postId, userId);
    sendSuccessResponse(res, {
      message: "Post deleted successfully",
    });
  }),
};
