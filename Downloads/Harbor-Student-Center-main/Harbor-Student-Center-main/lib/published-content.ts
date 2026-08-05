/** PostgREST filter: published now, or scheduled and due. */
export function publishedOrDueFilter(nowIso = new Date().toISOString()) {
  return `status.eq.published,and(status.eq.scheduled,scheduled_for.lte."${nowIso}")`;
}

