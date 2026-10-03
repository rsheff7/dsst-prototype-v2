'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLesson } from '@/lib/lessonContext';
import PrepApp from '@/components/prep/PrepApp';

// Phone prep: a guided evening prep built from the lesson in context. Like
// /lesson, it needs a lesson loaded from the home page.
export default function PrepPage() {
  const { lesson } = useLesson();
  const router = useRouter();

  useEffect(() => {
    if (!lesson) router.replace('/');
  }, [lesson, router]);

  if (!lesson) return null;
  return <PrepApp lesson={lesson} />;
}
