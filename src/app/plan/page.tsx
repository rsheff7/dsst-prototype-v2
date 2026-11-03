'use client';

import { PLANNED } from '@/lib/u3/planContent';
import UnitView from '@/components/u3/UnitView';

// The whole unit, as on /u3, with each built lesson opening the planning view.
export default function PlanIndex() {
  return <UnitView lessons={PLANNED} href={(c) => `/plan/${c}`} go="Plan →" />;
}
