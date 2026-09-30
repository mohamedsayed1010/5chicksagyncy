// Supabase implementation of the CMS API. Uses only the anon/publishable key: every write is
// authorised by the signed-in user's session and enforced by the RLS policies in supabase/migrations.
import { createClient } from '@supabase/supabase-js';
import { MEDIA_BUCKET, SUPABASE_ANON_KEY, SUPABASE_URL } from '../config.js';

export const PUBLIC_TABLES = [
  'site_settings', 'pages', 'page_sections', 'services', 'service_items',
  'sliders', 'slides', 'clients', 'projects', 'project_media'
];

export function createSupabaseApi() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: true, autoRefreshToken: true }
  });
  const check = ({ data, error }) => {
    if (error) throw error;
    return data;
  };

  return {
    mode: 'supabase',

    // Everything the public site needs, in one round of parallel requests.
    async fetchPublicRows() {
      const results = await Promise.all(
        PUBLIC_TABLES.map((table) => supabase.from(table).select('*'))
      );
      return Object.fromEntries(PUBLIC_TABLES.map((table, i) => [table, check(results[i])]));
    },

    auth: {
      async getSession() {
        return check(await supabase.auth.getSession()).session;
      },
      async signIn(email, password) {
        return check(await supabase.auth.signInWithPassword({ email, password })).session;
      },
      async signOut() {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
      },
      onChange(callback) {
        // Keep the listener synchronous: callers query Supabase (is_admin) in response, and doing that
        // inside the auth callback can deadlock with a token refresh. Run it right after instead.
        const { data } = supabase.auth.onAuthStateChange((_event, session) => {
          setTimeout(() => callback(session), 0);
        });
        return () => data.subscription.unsubscribe();
      },
      // Server-side check (same function the RLS policies use).
      async isAdmin() {
        return Boolean(check(await supabase.rpc('is_admin')));
      }
    },

    db: {
      async list(table, { order = 'sort_order', ascending = true, filter, limit } = {}) {
        let query = supabase.from(table).select('*');
        if (filter) for (const [column, value] of Object.entries(filter)) query = query.eq(column, value);
        if (order) query = query.order(order, { ascending });
        if (limit) query = query.limit(limit);
        return check(await query);
      },
      async get(table, id) {
        return check(await supabase.from(table).select('*').eq('id', id).maybeSingle());
      },
      async insert(table, row) {
        return check(await supabase.from(table).insert(row).select().single());
      },
      async update(table, id, patch) {
        return check(await supabase.from(table).update(patch).eq('id', id).select().single());
      },
      async remove(table, id) {
        check(await supabase.from(table).delete().eq('id', id));
      },
      async reorder(table, ids) {
        check(await supabase.rpc('reorder_rows', { p_table: table, p_ids: ids }));
      },
      async duplicate(table, id) {
        const fn = table === 'services' ? 'duplicate_service' : 'duplicate_project';
        return check(await supabase.rpc(fn, { p_id: id }));
      },
      async count(table, filter) {
        let query = supabase.from(table).select('id', { count: 'exact', head: true });
        if (filter) for (const [column, value] of Object.entries(filter)) query = query.eq(column, value);
        const { count, error } = await query;
        if (error) throw error;
        return count || 0;
      }
    },

    storage: {
      async upload(file, path, { upsert = false } = {}) {
        check(await supabase.storage.from(MEDIA_BUCKET).upload(path, file, {
          upsert,
          contentType: file.type,
          cacheControl: '3600'
        }));
        return supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path).data.publicUrl;
      },
      async remove(path) {
        check(await supabase.storage.from(MEDIA_BUCKET).remove([path]));
      }
    }
  };
}
