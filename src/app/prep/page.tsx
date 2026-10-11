'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLesson } from '@/lib/lessonContext';
import PrepApp from '@/components/prep/PrepApp';
import { loadLastLesson, saveLastLesson } from '@/components/prep/usePrepState';
import { PREP_SAMPLES } from '@/lib/prep/samples';

// Phone prep: a guided evening prep built from the lesson in context. Unlike
// /lesson it survives a reload: the lesson last opened here is kept in the
// browser, so a teacher can stop tonight and pick up tomorrow.
export default function PrepPage() {
  const { lesson, setLesson } = useLesson();
  const router = useRouter();

  useEffect(() => {
    // /prep?sample=<key> opens a bundled comparison lesson. Read from the
    // address, not useSearchParams, which would force a Suspense boundary.
    const sample = PREP_SAMPLES[new URLSearchParams(window.location.search).get('sample') ?? ''];
    if (sample && lesson !== sample) return setLesson(sample);
    if (lesson) return saveLastLesson(lesson);
    const saved = loadLastLesson();
    if (saved) setLesson(saved);
    else router.replace('/');
  }, [lesson, setLesson, router]);

  if (!lesson) return null;
  // Keyed so a different lesson starts a fresh PrepApp, never inheriting state.
  const key = `${lesson.meta.lesson_title}:${lesson.meta.lesson_number}:${'prep' in lesson ? 'authored' : 'generated'}`;
  return <PrepApp key={key} lesson={lesson} />;
}
