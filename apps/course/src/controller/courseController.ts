import { Request, Response } from 'express';
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
    this.getCourse = this.getCourse.bind(this);
    this.createLesson = this.createLesson.bind(this);
    this.enrollStudent = this.enrollStudent.bind(this);


  }

  async createCourse(req: Request, res: Response,): Promise<void> {
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

  async getCourse(req: Request, res: Response): Promise<void> {

    const courseId = parseInt(<string>req.params?.courseId);

    if (!courseId) {
      res.status(401).json({
        success: false,
        message: 'Could not find course with this id'
      })
      return;
    }

    const course = await this.courseService.getCourseById(courseId);

    const response: ApiResponse<Course> = {
      success: true,
      message: 'Course get successfully',
      data: course,

    }

    res.status(200).json(response);
  }

  async createSection(req: Request, res: Response,): Promise<void> {
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

  async enrollStudent(req: Request, res: Response, ): Promise<void> {

    const courseId = parseFloat(req.params.courseId as string);
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized to perform this operation',
      })
      return;
    }
    if(!courseId) {
      res.status(401).json({
        success: false,
        message: 'Course id not found',
      })
    }

    const result = await this.courseService.handleEnrollment(courseId, userId);

    const response: ApiResponse<{clientSecret: string, enrollmentId: number }> = {
      success: true,
      message: 'Student enrolled successfully',
      data: result
    }

    res.status(201).json(response);

  }

  async paymentCallback(req: Request, res: Response): Promise<void> {

    const {status, enrollmentId} = req.body;

    if(!status || !enrollmentId) {
      res.status(401).json({
        success: false,
        message: 'Missing required parameter',
      })
      return;
    }

    const result = await this.courseService.handlePaymentCallback(status, enrollmentId);

    if(result.success) {
      res.redirect(`/payment-success?status=success&enrollmentId=${enrollmentId}`);
    } else {
      res.redirect(`/payment-failure?status=failed&enrollmentId=${enrollmentId}`);
    }



  }

}
