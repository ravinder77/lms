import { z } from 'zod';

export const createCourseSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(100, 'Title must be at most 100 characters'),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(1000, 'Description must be at most 1000 characters'),
  difficulty: z
    .enum(['beginner', 'intermediate', 'advanced'])
    .default('beginner'),
  durationInSeconds: z.number().min(0, 'Duration must be at least 0'),
  tags: z.array(z.string()).default([]),
  language: z.string().max(2).optional().default('en'),
  categoryId: z.number().int().optional(),
  coverImageUrl: z.string().url(),
  previewVideoUrl: z.string().url(),
  isFeatured: z.boolean().default(false).optional(),

  price: z
    .string()
    .regex(/^\d{1,8}(\.\d{1,2})?$/, {
      message:
        'Price must be a decimal with up to 2 digits after the decimal point',
    })
    .default('0.00'),
  discountedPrice: z
    .string()
    .regex(/^\d{1,8}(\.\d{1,2})?$/, {
      message:
        'Price must be a decimal with up to 2 digits after the decimal point',
    })
    .default('0.00')
    .optional(),
  coInstructors: z.array(z.string()).optional().default([]),
  currency: z.string().max(3).default('USD'),
  status: z.enum(['draft', 'published', 'archived', 'review']).default('draft'),
});


export const createSectionSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be at most 100 characters'),
  description: z.string().min(1, 'Description is required').max(1000, 'Description must be at most 1000 characters'),
  isPublished: z.boolean().default(false).optional(),
  metadata: z.record(z.string()).optional(),
})



export type CreateCourseInput = z.infer<typeof createCourseSchema>;
export type CreateSectionInput = z.infer<typeof createSectionSchema>