'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import PlanApp from '@/components/plan/PlanApp';
import { getLesson } from '@/lib/u3/content';
import { getPlan } from '@/lib/u3/planContent';
import { PilotBanner } from '@/components/u3/U3Notice';

// One lesson's planning view. Saved progress lives in this browser, so it renders
// only in the browser (see /u3/[code] for why).
export default function PlanLessonPage() {
  const { code } = useParams<{ code: string }>();
  const lesson = getLesson(code);
  const plan = getPlan(code);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted)
    return <main style={{ maxWidth: 560, margin: '0 auto', padding: 24, color: 'var(--color-ink-muted)' }}>Loading tonight’s planning…</main>;
  if (!lesson || !plan)
    return (
      <main style={{ maxWidth: 560, margin: '0 auto', padding: 24 }}>
        <p>Lesson {code} isn’t ready for the planning view yet.</p>
        <p>
          <Link href="/plan">All lessons</Link>
        </p>
      </main>
    );
  return (
    <>
      <PilotBanner />
      <PlanApp key={code} lesson={lesson} plan={plan} />
    </>
  );
}
