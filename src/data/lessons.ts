import type { Lesson } from '../types'
import { trendLessons } from './lessons/trend'
import { connectLessons } from './lessons/connect'
import { promptLessons } from './lessons/prompt'
import { vibeLessons } from './lessons/vibe'
import { claudeLessons } from './lessons/claude'

// 강의 추가: data/lessons/ 아래 파일에 Lesson 객체를 추가하고 data/courses.ts 의 lessonIds 에 등록하세요.
// 배열 순서 = 권장 학습 동선(L01 → L22)
export const lessons: Lesson[] = [...trendLessons, ...connectLessons, ...promptLessons, ...vibeLessons, ...claudeLessons].sort((a, b) => a.no - b.no)

export const lessonById = (id: string) => lessons.find((l) => l.id === id)
