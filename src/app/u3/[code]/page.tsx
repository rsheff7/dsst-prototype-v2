'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import PrepApp from '@/components/prep/PrepApp';
import { getLesson } from '@/lib/u3/content';

// One Unit 3 lesson's phone prep, built ahead of time from IM's teacher
// materials. Nothing is analysed at upload; the lesson files ship with the app.
export default function U3LessonPage() {
  const { code } = useParams<{ code: string }>();
  const lesson = getLesson(code);
  // Saved progress is read from this browser when the prep starts, so the prep
  // renders only in the browser; a server render would show a fresh prep and
  // then disagree with it.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted)
    return (
      <main style={{ maxWidth: 560, margin: '0 auto', padding: 24, color: '#6b6a64' }}>Loading tonight’s prep…</main>
    );
  if (!lesson) {
    return (
      <main style={{ maxWidth: 560, margin: '0 auto', padding: 24 }}>
        <p>Lesson {code} isn’t built yet.</p>
        <p>
          <Link href="/u3">Back to Unit 3</Link>
        </p>
      </main>
    );
  }
  return <PrepApp key={code} u3={lesson} />;
}
