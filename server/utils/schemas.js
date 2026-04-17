import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string().min(1, 'Username is required').optional(),
  handle: z.string().min(1, 'Handle is required').optional()
}).refine(data => data.username || data.handle, {
  message: 'Must provide either username or handle',
});

export const followUserSchema = z.object({
  targetUserId: z.string().min(1, 'Target User ID is required'),
});

export const createPostSchema = z.object({
  content: z.string().min(1, 'Content is required').max(500, 'Content must be under 500 characters'),
});

export const createCommentSchema = z.object({
  content: z.string().min(1, 'Content is required').max(300, 'Content must be under 300 characters'),
});
