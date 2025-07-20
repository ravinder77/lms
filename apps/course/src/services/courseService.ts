import {eq, sql} from 'drizzle-orm';
import {db} from 'src/db/index.js';
import {Course, courses, NewCourse, NewSection, sections,} from 'src/db/schema.js';
import {CreateCourseInput, CreateSectionInput,} from 'src/schema/courseValidation.js';

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
}
