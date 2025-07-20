import { Router } from 'express';
import { authenticateUser, requireRole } from 'src/middleware/authMiddleware.js';
import { validate } from 'src/middleware/validate.js';
import {
  createCourseSchema,
  createSectionSchema,
} from 'src/schema/courseValidation.js';
import { CourseController } from 'src/controller/courseController.js';
import { asyncHandler } from 'src/utils/asyncHandler.js';

const router = Router();
const courseController = new CourseController();

router.post(
  '/create',
  authenticateUser,
  requireRole('instructor'),
  validate(createCourseSchema),
  asyncHandler(courseController.createCourse)
);

router.post(
  '/:courseId/sections',
  authenticateUser,
  requireRole('instructor'),
  validate(createSectionSchema),
  asyncHandler(courseController.createSection)
);

router.post("/:courseId/sections/:sectionId/lessons",  authenticateUser, requireRole('instructor'), asyncHandler(courseController.createLesson));




export default router;
