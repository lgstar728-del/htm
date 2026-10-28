import type { Lesson } from '../types'
import { paradigmLessons } from './lessons/paradigm'
import { engineeringLessons } from './lessons/engineering'
import { toolLessons } from './lessons/tools'

// 강의 추가: data/lessons/ 아래 파일에 Lesson 객체를 추가하고 data/courses.ts 의 lessonIds 에 등록하세요.
export const lessons: Lesson[] = [...paradigmLessons, ...engineeringLessons, ...toolLessons]

export const lessonById = (id: string) => lessons.find((l) => l.id === id)
