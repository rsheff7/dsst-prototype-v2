import Link from 'next/link';
import { UNIT } from '@/lib/u3/content';
import { PLANNED } from '@/lib/u3/planContent';
import { ImCredit, PilotBanner } from '@/components/u3/U3Notice';

// The lessons the planning view is built for.
export default function PlanIndex() {
  return (
    <>
      <PilotBanner />
      <main style={{ maxWidth: 560, margin: '0 auto', padding: 24, display: 'grid', gap: 16 }}>
        <h1 style={{ margin: 0 }}>Planning view</h1>
        <p style={{ margin: 0 }}>Grade 6 · Unit 3 · {UNIT.title}</p>
        <ul style={{ margin: 0, paddingLeft: 18, display: 'grid', gap: 8 }}>
          {PLANNED.map((c) => (
            <li key={c}>
              <Link href={`/plan/${c}`}>
                {c} {UNIT.lessonTitles[c]}
              </Link>
            </li>
          ))}
        </ul>
        <ImCredit />
      </main>
    </>
  );
}
