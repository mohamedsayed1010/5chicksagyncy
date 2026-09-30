// Dashboard data hooks (TanStack Query). Every successful write invalidates the admin lists and the
// public content, so the website shows published changes on the next navigation/refresh.
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { PUBLIC_CONTENT_KEY } from '../cms/CmsProvider.jsx';
import { useApi } from './auth.jsx';

export function useList(table, options = {}) {
  const api = useApi();
  return useQuery({
    queryKey: ['admin', table, options],
    queryFn: () => api.db.list(table, options),
    enabled: Boolean(api)
  });
}

export function useRow(table, id) {
  const api = useApi();
  return useQuery({
    queryKey: ['admin', table, 'row', id],
    queryFn: () => api.db.get(table, id),
    enabled: Boolean(api && id)
  });
}

export function useInvalidate() {
  const client = useQueryClient();
  return () => {
    client.invalidateQueries({ queryKey: ['admin'] });
    client.invalidateQueries({ queryKey: PUBLIC_CONTENT_KEY });
  };
}

// useCmsMutation(async (api, input) => ...) → a mutation that refreshes everything afterwards.
export function useCmsMutation(fn, options = {}) {
  const api = useApi();
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: (input) => fn(api, input),
    ...options,
    onSuccess: (...args) => {
      invalidate();
      options.onSuccess?.(...args);
    }
  });
}

const comparable = (row) => JSON.stringify(row, Object.keys(row).filter((k) => !['created_at', 'updated_at'].includes(k)).sort());

// Persist an edited list of child rows (service items, project media, slides):
// deletes removed rows, inserts new ones, updates changed ones, and stores the new order.
export async function syncChildren(api, table, parentKey, parentId, original, next) {
  const nextIds = new Set(next.filter((r) => r.id && !r.id.startsWith('new-')).map((r) => r.id));
  for (const row of original) if (!nextIds.has(row.id)) await api.db.remove(table, row.id);
  const byId = new Map(original.map((r) => [r.id, r]));
  for (const [index, row] of next.entries()) {
    const { id, created_at, updated_at, ...fields } = row;
    const values = { ...fields, [parentKey]: parentId, sort_order: index };
    if (!id || id.startsWith('new-')) await api.db.insert(table, values);
    else if (comparable({ ...byId.get(id), ...values, id }) !== comparable(byId.get(id))) await api.db.update(table, id, values);
  }
}

export const tempId = () => 'new-' + Math.random().toString(36).slice(2);

// Readable error text for Supabase/PostgREST errors.
export function errorMessage(error) {
  if (!error) return '';
  if (error.code === '23505') return 'That slug is already used. Choose another one.';
  if (error.code === '42501' || /row-level security|not authorized/i.test(error.message || ''))
    return 'You are not allowed to change this content (admin access required).';
  return error.message || String(error);
}
