import {eq, sql} from 'drizzle-orm';
import {db} from 'src/db/index.js';
import axios from 'axios';
import {Course, courses, NewCourse, NewSection, sections,} from 'src/db/schema.js';
import {CreateCourseInput, CreateSectionInput,} from 'src/schema/courseValidation.js';
import * as process from "node:process";

const PAYMENT_URL = process.env.PAYMENT_SERVICE_URL || "http://localhost:4003/api/v1";

export class CourseService {

  async createCourse(
    data: CreateCourseInput,
    instructorId: string
  ): Promise<Course> {
    const insertData: NewCourse = {
      ...data,
      instructorId,
    };

    const [course] = await db.insert(courses).values(insertData).returning();

    if (!course) {
      throw new Error('Failed to create course');
    }

    return course;
  }

  async createSection(data: CreateSectionInput, courseId: number) {

    // transaction wrapping for concurrency
    return await db.transaction(async (tx) => {
      const [maxOrderRow] = await tx
          .select({
            maxOrder: sql<number>`COALESCE(MAX(
            ${sections.order}
            ),
            0
            )`,
          })
          .from(sections)
          .where(eq(sections.courseId, courseId));

      if (!maxOrderRow) {
        throw new Error('Unable to find Row');
      }

      const nextOrder = maxOrderRow.maxOrder + 1;

      const insertData: NewSection = {
        ...data,
        courseId,
        order: nextOrder,
      };

      const [section] = await tx
          .insert(sections)
          .values(insertData)
          .returning();

      if (!section) {
        throw new Error('Failed to create section');
      }

      return section;
    });
  }

  async enroll(courseId: number, studentId: string) {

    const [course] = await db.select({
      price: courses.price,
      currency: courses.currency,
    }).from(courses).where(eq(courses.id, courseId));

    if(!course) {
      throw new Error('Course not found');
    }

    const amountInCents = Number(course.price) * 100;

    const processPayment = await axios.post(`${PAYMENT_URL}/payments/create-intent`, {
      courseId,
      studentId,
      amount: amountInCents,
      currency: course.currency.toLowerCase(),
    });

    const {clientSecret, paymentIntentId} = processPayment.data;

    // save paymentIntentId to database

    return {
      clientSecret,
    }


  }
}
