import { useMemo, useState } from 'react';
import { MediaField } from '../MediaPicker.jsx';
import { BiRowField } from '../editorKit.jsx';
import { errorMessage, useCmsMutation, useList } from '../data.js';
import { validate } from '../validation.js';
import { Badge, Button, EmptyState, ErrorState, Loading, MediaThumb, Modal, PageHeader, Select, SortableList, TextInput, Toggle, useFeedback, useUnsavedChanges } from '../ui.jsx';

const blankClient = () => ({ name_en: '', name_ar: '', logo_url: '', url: '', theme: 'light', enabled: true });

function ClientForm({ client, onClose }) {
  const { toast } = useFeedback();
  const [draft, setDraft] = useState(client);
  const errors = useMemo(() => validate(draft, { name_en: ['required'], url: ['link'] }), [draft]);
  const dirty = JSON.stringify(draft) !== JSON.stringify(client);
  useUnsavedChanges(dirty);
  const save = useCmsMutation(
    async (api) => {
      const { id, created_at, updated_at, ...fields } = draft;
      if (id) return api.db.update('clients', id, fields);
      const rows = await api.db.list('clients', { order: 'sort_order', ascending: false, limit: 1 });
      return api.db.insert('clients', { ...fields, name_ar: fields.name_ar || fields.name_en, sort_order: (rows[0]?.sort_order ?? -1) + 1 });
    },
    { onSuccess: () => { toast('Client saved'); onClose(); }, onError: (e) => toast(errorMessage(e), 'error') }
  );
  const update = (patch) => setDraft((d) => ({ ...d, ...patch }));
  return (
    <Modal
      title={client.id ? `Edit ${client.name_en}` : 'New client'}
      onClose={onClose}
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="primary" busy={save.isPending} disabled={Object.keys(errors).length > 0} onClick={() => save.mutate()}>Save</Button>
        </>
      }
    >
      <BiRowField label="Name" required row={draft} field="name" error={{ en: errors.name_en }} onChange={update} />
      <MediaField label="Logo" value={draft.logo_url} onChange={(logo_url) => update({ logo_url })} />
      <TextInput label="Website (optional)" value={draft.url} onChange={(url) => update({ url })} error={errors.url} hint="When set, the logo links to the client's website." />
      <Select label="Logo background" value={draft.theme} onChange={(theme) => update({ theme })} options={[{ value: 'light', label: 'Light' }, { value: 'dark', label: 'Dark' }]} />
      <Toggle label="Visible on the website" checked={draft.enabled} onChange={(enabled) => update({ enabled })} />
    </Modal>
  );
}

export default function ClientsPage() {
  const { toast, confirm } = useFeedback();
  const clients = useList('clients');
  const [editing, setEditing] = useState(null);
  const onError = (e) => toast(errorMessage(e), 'error');
  const reorder = useCmsMutation((api, ids) => api.db.reorder('clients', ids), { onError, onSuccess: () => toast('Order saved') });
  const toggle = useCmsMutation((api, c) => api.db.update('clients', c.id, { enabled: !c.enabled }), { onError });
  const remove = useCmsMutation((api, c) => api.db.remove('clients', c.id), { onError, onSuccess: () => toast('Client deleted') });

  return (
    <>
      <PageHeader title="Clients" crumbs={[['Clients']]} actions={<Button variant="primary" onClick={() => setEditing(blankClient())}>+ New client</Button>} />
      {clients.isLoading ? (
        <Loading />
      ) : clients.error ? (
        <ErrorState error={clients.error} onRetry={clients.refetch} />
      ) : clients.data.length === 0 ? (
        <EmptyState title="No clients yet" text="The website shows placeholder logos until you add clients." />
      ) : (
        <SortableList
          label="Clients"
          items={clients.data}
          onReorder={(next) => reorder.mutate(next.map((c) => c.id))}
          renderItem={(client) => (
            <div className="a-row-item">
              <MediaThumb url={client.logo_url} />
              <div className="a-row-item__text">
                <button type="button" className="a-link-btn a-row-item__title" onClick={() => setEditing(client)}>{client.name_en}</button>
                <span className="a-muted">{client.name_ar}{client.url ? ` · ${client.url}` : ''}</span>
              </div>
              <Badge tone={client.enabled ? 'success' : 'warning'}>{client.enabled ? 'Visible' : 'Hidden'}</Badge>
              <div className="a-row-item__actions">
                <Button size="sm" onClick={() => toggle.mutate(client)}>{client.enabled ? 'Hide' : 'Show'}</Button>
                <Button size="sm" onClick={() => setEditing(client)}>Edit</Button>
                <Button size="sm" variant="danger" onClick={async () => { if (await confirm({ title: `Delete ${client.name_en}?`, message: 'The logo will be removed from the website.', confirmLabel: 'Delete', danger: true })) remove.mutate(client); }}>Delete</Button>
              </div>
            </div>
          )}
        />
      )}
      {editing && <ClientForm client={editing} onClose={() => setEditing(null)} />}
    </>
  );
}
