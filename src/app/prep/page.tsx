'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLesson } from '@/lib/lessonContext';
import PrepApp from '@/components/prep/PrepApp';
import { loadLastLesson, saveLastLesson } from '@/components/prep/usePrepState';

// Phone prep: a guided evening prep built from the lesson in context. Unlike
// /lesson it survives a reload: the lesson last opened here is kept in the
// browser, so a teacher can stop tonight and pick up tomorrow.
export default function PrepPage() {
  const { lesson, setLesson } = useLesson();
  const router = useRouter();

  useEffect(() => {
    if (lesson) return saveLastLesson(lesson);
    const saved = loadLastLesson();
    if (saved) setLesson(saved);
    else router.replace('/');
  }, [lesson, setLesson, router]);

  if (!lesson) return null;
  return <PrepApp lesson={lesson} />;
}
