import { NextFunction, Request, Response } from 'express';
import type { Course, Section } from 'src/db/schema.js';
import {
  CreateCourseInput,
  CreateSectionInput,
} from 'src/schema/courseValidation.js';
import { CourseService } from 'src/services/courseService.js';
import { ApiResponse } from '@lms/shared/types';

export class CourseController {
  private courseService: CourseService;

  constructor() {
    this.courseService = new CourseService();

    this.createCourse = this.createCourse.bind(this);
    this.createSection = this.createSection.bind(this);
  }

  async createCourse(
    req: Request,
    res: Response,
  ): Promise<void> {
    const instructorId = req.user?.userId;

    if (!instructorId) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
      return;
    }

    const body = req.body as CreateCourseInput;

    const course = await this.courseService.createCourse(body, instructorId);

    const response: ApiResponse<Course> = {
      success: true,
      message: 'Course created successfully',
      data: course,
    };

    res.status(201).json(response);
  }

  async createSection(
    req: Request,
    res: Response,
  ): Promise<void> {
    const courseId = parseFloat(req.params?.courseId as string);
    const instructorId = req.user?.userId;
    if (isNaN(courseId)) {
      res.status(400).json({
        success: false,
        message: 'Invalid courseId',
      });
      return;
    }

    if (!instructorId) {
      res.status(401).json({
        success: false,
        message: 'You are not allowed to perform this operation',
      });
      return;
    }

    const body = req.body as CreateSectionInput;

    const section = await this.courseService.createSection(body, courseId);

    const response: ApiResponse<Section> = {
      success: true,
      message: 'Section created successfully',
      data: section,
    };

    res.status(201).json(response);
  }

  async createLesson(req: Request, res: Response): Promise<void> {}

}
