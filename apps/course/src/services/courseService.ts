import {eq, sql} from 'drizzle-orm';
import {db} from 'src/db/index.js';
import axios from 'axios';
import {Course, Section, courses, NewCourse, NewSection, sections, enrollments} from 'src/db/schema.js';
import {CreateCourseInput, CreateSectionInput,} from 'src/schema/courseValidation.js';

const PAYMENT_URL = process.env.PAYMENT_SERVICE_URL || "http://localhost:4003";
const COURSE_BASE_URL = process.env.COURSE_BASE_URL!;

export class CourseService {

  async createCourse(data: CreateCourseInput, instructorId: string): Promise<Course> {
    const insertData: NewCourse = {...data, instructorId };

    const [course] = await db.insert(courses).values(insertData).returning();

    if (!course) {
      throw new Error('Failed to create course');
    }
    return course;
  }

  async getCourseById(id: number): Promise<Course> {

    const [course] = await db.select().from(courses).where(eq(courses.id, id));

    if (!course) {
      throw new Error('Failed to get course with id ' + id);
    }

    return course;
  }

  async createSection(data: CreateSectionInput, courseId: number):Promise<Section> {

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

  async handleEnrollment(courseId: number, userId: string) {

    const [course] = await db.select({
      price: courses.price,
      currency: courses.currency,
    }).from(courses).where(eq(courses.id, courseId));

    if(!course) {
      throw new Error('Course not found');
    }

    // create enrollment record
    const [enrollment] = await db.insert(enrollments).values({
      courseId,
      userId,
      status: 'pending',
    }).returning({id: enrollments.id});

    if (!enrollment) {
      throw new Error('Failed to create enrollment');
    }

    const amountInCents = Number(course.price) * 100;


    const paymentResponse = await axios.post(`${PAYMENT_URL}/api/v1/payments/create-checkout-session`, {
      courseId,
      userId,
      enrollmentId: enrollment.id,
      amount: amountInCents,
      callbackUrl: `${COURSE_BASE_URL}/api/v1/courses/payment-callback`,
      currency: course.currency.toLowerCase(),
    });

    const {clientSecret, paymentIntentId} = paymentResponse.data;

    // save paymentIntentId to a database
    await db.update(enrollments).set({
      paymentId: paymentIntentId,
    }).where(eq(enrollments.id, enrollment.id))


    return {
      clientSecret,
      enrollmentId: enrollment.id,
    }


  }

  async handlePaymentCallback(status: string, enrollmentId: number)  {

    if(status !== 'success') {
      return {success: false};
    }

    const [enrollment] = await db.select().from(enrollments).where(eq(enrollments.id, enrollmentId));

    if (!enrollment) {
      throw new Error('Failed to find enrollment');
    }

    // update
    await db.update(enrollments).set({
      status: 'success',
    }).where(eq(enrollments.id, enrollmentId));

    return {success: true};

  }
}
