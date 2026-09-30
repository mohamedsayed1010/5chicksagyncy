import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useApi } from './auth.jsx';
import { errorMessage, syncChildren, useInvalidate } from './data.js';
import { BilingualField, useFeedback, useUnsavedChanges } from './ui.jsx';

// Loads a record (+ its child rows) for editing, tracks unsaved changes and saves everything.
//   table/child: e.g. services + { table: 'service_items', key: 'service_id' }
//   blank(): values for a new record
export function useRecordEditor({ table, id, child, blank, basePath, label }) {
  const api = useApi();
  const invalidate = useInvalidate();
  const navigate = useNavigate();
  const { toast } = useFeedback();
  const isNew = id === 'new';
  const query = useQuery({
    queryKey: ['admin', table, 'edit', id],
    enabled: Boolean(api),
    queryFn: async () => {
      if (isNew) return { row: blank(), children: [] };
      const row = await api.db.get(table, id);
      if (!row) throw new Error(`${label} not found`);
      const children = child ? await api.db.list(child.table, { filter: { [child.key]: id } }) : [];
      return { row, children };
    },
    refetchOnWindowFocus: false
  });
  const [draft, setDraft] = useState(null);
  const [children, setChildren] = useState([]);
  const [saving, setSaving] = useState(false);
  // Snapshot of the last loaded/saved state; the form is "dirty" when it differs from it.
  const [baseline, setBaseline] = useState(null);
  const snapshot = (row, list) => JSON.stringify([row, list]);

  useEffect(() => {
    if (query.data) {
      setDraft(query.data.row);
      setChildren(query.data.children);
      setBaseline(snapshot(query.data.row, query.data.children));
    }
  }, [query.data]);

  const dirty = useMemo(() => Boolean(baseline && draft) && snapshot(draft, children) !== baseline, [draft, children, baseline]);
  useUnsavedChanges(dirty && !saving);

  const save = async () => {
    setSaving(true);
    try {
      const { id: rowId, created_at, updated_at, ...fields } = draft;
      let saved;
      if (isNew) {
        const existing = await api.db.list(table, { order: 'sort_order', ascending: false, limit: 1 });
        saved = await api.db.insert(table, { ...fields, sort_order: (existing[0]?.sort_order ?? -1) + 1 });
      } else saved = await api.db.update(table, rowId, fields);
      if (child) await syncChildren(api, child.table, child.key, saved.id, isNew ? [] : query.data.children, children);
      // Saved: nothing is pending any more, even before the refetch below completes.
      setBaseline(snapshot(draft, children));
      invalidate();
      toast(`${label} saved`);
      if (isNew) navigate(`${basePath}/${saved.id}`, { replace: true });
      else await query.refetch();
      return saved;
    } catch (error) {
      toast(errorMessage(error), 'error');
      return null;
    } finally {
      setSaving(false);
    }
  };

  const reset = () => {
    setDraft(query.data.row);
    setChildren(query.data.children);
  };

  // Helpers for bilingual column pairs (name_en/name_ar).
  const bi = (field) => ({ en: draft?.[`${field}_en`] ?? '', ar: draft?.[`${field}_ar`] ?? '' });
  const setBi = (field) => (value) => setDraft((d) => ({ ...d, [`${field}_en`]: value.en, [`${field}_ar`]: value.ar }));
  const set = (field) => (value) => setDraft((d) => ({ ...d, [field]: value }));

  return { query, isNew, draft, setDraft, children, setChildren, dirty, saving, save, reset, bi, setBi, set };
}

// Bilingual field bound to a row's <field>_en / <field>_ar columns.
export function BiRowField({ row, field, onChange, ...props }) {
  return (
    <BilingualField
      value={{ en: row[`${field}_en`] ?? '', ar: row[`${field}_ar`] ?? '' }}
      onChange={(value) => onChange({ [`${field}_en`]: value.en, [`${field}_ar`]: value.ar })}
      {...props}
    />
  );
}

// Sticky save bar shown on every editor.
export function SaveBar({ dirty, saving, onSave, onReset, errors }) {
  const count = Object.keys(errors || {}).length;
  return (
    <div className={`a-savebar${dirty ? ' is-dirty' : ''}`} role="region" aria-label="Save changes">
      <span>{count ? `Fix ${count} field${count > 1 ? 's' : ''} before saving.` : dirty ? 'You have unsaved changes.' : 'All changes saved.'}</span>
      <div className="a-row">
        {dirty && <button type="button" className="a-btn a-btn--ghost" onClick={onReset}>Discard</button>}
        <button type="button" className="a-btn a-btn--primary" onClick={onSave} disabled={!dirty || saving || count > 0} aria-busy={saving || undefined}>
          {saving && <span className="a-spinner" aria-hidden="true" />}
          Save
        </button>
      </div>
    </div>
  );
}
