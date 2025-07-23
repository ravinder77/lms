import {
  pgTable,
  text,
  integer,
  varchar,
  jsonb,
  pgEnum,
  timestamp,
  boolean,
  index,
  foreignKey,
  serial,
  unique,
    numeric
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
export const difficultyEnum = pgEnum('difficulty', [
  'beginner',
  'intermediate',
  'advanced',
]);

export const courseStatusEnum = pgEnum('course_status', [
  'draft',
  'published',
  'archived',
  'review',
]);

export const resourceTypeEnum = pgEnum('resource_type', [
  'pdf',
  'video',
  'link',
  'doc',
  'image',
  'other',
]);

export const enrollmentEnum = pgEnum('enrollment_status', ["pending", "success", "failed", "cancelled"]);

export const courses = pgTable(
  'courses',
  {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    description: text('description').notNull(),
    difficulty: difficultyEnum('difficulty').default('beginner').notNull(),
    durationInSeconds: integer('duration_in_seconds').default(0).notNull(),
    categoryId: integer('category_id').references(() => categories.id),
    language: varchar('language', { length: 2 }).default('en').notNull(),
    tags: jsonb('tags').$type<string[]>().default([]).notNull(),

    instructorId: varchar('instructor_id').notNull(),
    coInstructors: jsonb('co_instructors')
      .$type<string[]>()
      .default([])
      .notNull(),
    coverImageUrl: text('cover_image_url').notNull(),
    previewVideoUrl: text('preview_video_url').notNull(),
    studentsEnrolled: integer('students_enrolled').default(0).notNull(),
    //pricing
    price: numeric('price', { precision: 10, scale: 2 })
      .default('0.00')
      .notNull(),
    discountedPrice: numeric('discounted_price', {
      precision: 10,
      scale: 2,
    }).default('0.00'),
    currency: varchar('currency', { length: 3 }).default('USD').notNull(),
    status: courseStatusEnum('status').default('draft').notNull(),
    isFeatured: boolean('is_featured').default(false).notNull(),

    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (table) => [
    index('courses_instructor_id_idx').on(table.instructorId),
    index('courses_status_idx').on(table.status),
    index('courses_is_featured_idx').on(table.isFeatured),
  ]
);

export const categories = pgTable(
  'categories',
  {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    slug: text('slug').notNull().unique(),
    description: text('description').notNull(),
    parentId: integer('parent_id'),
    isActive: boolean('is_active').default(true),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (table) => [
    index('categories_slug_idx').on(table.slug),
    index('categories_parent_id_idx').on(table.parentId),
  ]
);

export const sections = pgTable(
  'sections',
  {
    id: serial('id').primaryKey(),
    courseId: integer('course_id').notNull(),
    title: varchar('title', { length: 100 }).notNull(),
    description: text('description'),
    order: integer('order').notNull().default(0),
    isPublished: boolean('is_published').default(false),
    metadata: jsonb('metadata').$type<Record<string, any>>().default({}),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (table) => [
    index('sections_course_id_idx').on(table.courseId), // helps in fast retrieval of sections for a course
    index('sections_course_order_idx').on(table.courseId, table.order),
    unique('unique_course_section_title_').on(table.courseId, table.title),
    foreignKey({
      name: 'sections_course_id_fk',
      columns: [table.courseId],
      foreignColumns: [courses.id],
    }).onDelete('cascade'),
  ]
);

export const lessons = pgTable(
  'lessons',
  {
    id: serial('id').primaryKey(),
    // foreign keys
    sectionId:integer('section_id').notNull(),
    courseId: integer('course_id').notNull(), // optional but useful for direct queries

    title: varchar('title', { length: 100 }).notNull(),
    description: text('description').notNull(),
    content: text('content'), // full lesson content
    order: integer('order').notNull(),
    durationInSeconds: integer('duration_in_seconds').default(0),

    videoUrl: varchar('video_url', { length: 500 }), // url for s3 
    isPreview: boolean('is_preview').default(false),
    isPublished: boolean('is_published').default(false),

    metadata: jsonb('metadata').$type<Record<string, any>>().default({}),

    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (table) => [
    index('lessons_section_order_idx').on(table.sectionId, table.order),
    index('lessons_course_id_idx').on(table.courseId),
    index('lessons_order_idx').on(table.order),
    foreignKey({
      name: 'lessons_section_id_fk',
      columns: [table.sectionId],
      foreignColumns: [sections.id],
    }).onDelete('cascade'),
    foreignKey({
      name: 'lessons_course_id_fk',
      columns: [table.courseId],
      foreignColumns: [courses.id],
    }).onDelete('cascade'),
  ]
);


export const resources = pgTable(
  'resources',
  {
    id: serial('id').primaryKey(),
    lessonId: integer('lesson_id').notNull(),
    title: text('name').notNull(),
    url: text('url').notNull(), // url for s3 
    type: resourceTypeEnum('type').notNull(), // pdf, video, audio, image, etc
    fileSize: integer('file_size').notNull(), // in bytes
    metadata: jsonb('metadata').$type<Record<string, any>>().default({}),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (table) => [
    index('resources_lesson_id_idx').on(table.lessonId),
    foreignKey({
      name: 'resources_lesson_id_fk',
      columns: [table.lessonId],
      foreignColumns: [lessons.id],
    }).onDelete('cascade'),
  ]
);


export const enrollments = pgTable("enrollments", {
    id: serial('id').primaryKey(),
    courseId: integer('course_id').notNull(),
    userId: varchar('student_id').notNull(),
    paymentId: varchar('payment_id'),
    status: enrollmentEnum("enrollment_status").default("pending").notNull(),
    enrolledAt: timestamp('enrolled_at').defaultNow(),

},(table) => [
    index('enrollment_course_id_idx').on(table.courseId),
    index('enrollment_student_id_idx').on(table.userId),
    unique('unique_student_course_enrollment').on(table.courseId, table.userId),
    foreignKey({
        name: 'enrollments_course_id_fk',
        columns: [table.courseId],
        foreignColumns: [courses.id],
    })
])



export const categoriesRelations = relations(categories, ({ one, many }) => ({
  parent: one(categories, {
    fields: [categories.parentId],
    references: [categories.id],
  }),
  children: many(categories),
  courses: many(courses),
}));

export const coursesRelations = relations(courses, ({ one, many }) => ({
  category: one(categories, {
    fields: [courses.categoryId],
    references: [categories.id],
  }),
  sections: many(sections),
}));

export const sectionsRelations = relations(sections, ({ one, many }) => ({
  course: one(courses, {
    fields: [sections.courseId],
    references: [courses.id],
  }),
  lessons: many(lessons),
}));


export const lessonsRelations = relations(lessons, ({ one, many}) => ({
  section: one(sections, {
    fields: [lessons.sectionId],
    references: [sections.id],
  }),
  course: one(courses, {
    fields: [lessons.courseId],
    references: [courses.id],
  }),
  resources: many(resources),
}));

export const resourcesRelations = relations(resources, ({ one }) => ({
  lesson: one(lessons, {
    fields: [resources.lessonId],
    references: [lessons.id],
  }),
}));


export const enrollmentRelations = relations(enrollments, ({ one }) => ({
    course: one(courses, {
        fields: [enrollments.courseId],
        references: [courses.id],
    })
}))


export type Course = typeof courses.$inferSelect; // this will be return when we query the db
export type NewCourse = typeof courses.$inferInsert; //

export type Section = typeof sections.$inferSelect; // this will be return when we query the db
export type NewSection = typeof sections.$inferInsert; //
