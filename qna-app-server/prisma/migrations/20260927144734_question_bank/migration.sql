/*
  Warnings:

  - You are about to drop the column `quiz_id` on the `Question` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "QuestionDifficulty" AS ENUM ('easy', 'medium', 'hard');

-- DropForeignKey
ALTER TABLE "Question" DROP CONSTRAINT "Question_quiz_id_fkey";

-- AlterTable
ALTER TABLE "Question" DROP COLUMN "quiz_id",
ADD COLUMN     "category" TEXT,
ADD COLUMN     "created_by" TEXT,
ADD COLUMN     "difficulty" "QuestionDifficulty" NOT NULL DEFAULT 'medium',
ADD COLUMN     "explanation" TEXT,
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "tags" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- CreateTable
CREATE TABLE "quiz_questions" (
    "quiz_id" TEXT NOT NULL,
    "question_id" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "added_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "quiz_questions_pkey" PRIMARY KEY ("quiz_id","question_id")
);

-- CreateIndex
CREATE INDEX "quiz_questions_question_id_idx" ON "quiz_questions"("question_id");

-- CreateIndex
CREATE INDEX "Question_is_active_created_at_idx" ON "Question"("is_active", "created_at");

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_questions" ADD CONSTRAINT "quiz_questions_quiz_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "Quiz"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_questions" ADD CONSTRAINT "quiz_questions_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
