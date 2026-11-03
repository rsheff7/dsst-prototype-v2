'use client';

import { BUILT } from '@/lib/u3/content';
import UnitView from '@/components/u3/UnitView';

// Unit 3 at a glance, with each built lesson opening the prep DSST reviewed.
export default function U3UnitPage() {
  return <UnitView lessons={BUILT} href={(c) => `/u3/${c}`} go="Prep →" />;
}
