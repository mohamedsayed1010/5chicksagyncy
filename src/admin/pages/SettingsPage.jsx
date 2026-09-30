import { useEffect, useMemo, useState } from 'react';
import { MediaField } from '../MediaPicker.jsx';
import { BiRowField, SaveBar } from '../editorKit.jsx';
import { errorMessage, useInvalidate, useList } from '../data.js';
import { useApi } from '../auth.jsx';
import { validate, validators } from '../validation.js';
import { whatsappUrl } from '../../cms/resolve.js';
import { Card, ErrorState, Loading, PageHeader, Repeater, TextInput, useFeedback, useUnsavedChanges } from '../ui.jsx';

// Loads and saves the single site_settings row (shared with the SEO screen).
export function useSettingsEditor() {
  const api = useApi();
  const invalidate = useInvalidate();
  const { toast } = useFeedback();
  const settings = useList('site_settings', { order: null });
  const row = settings.data?.[0];
  const [draft, setDraft] = useState(null);
  const [saving, setSaving] = useState(false);
  const [baseline, setBaseline] = useState(null);
  useEffect(() => {
    if (row) {
      setDraft(row);
      setBaseline(JSON.stringify(row));
    }
  }, [row]);
  const dirty = Boolean(baseline && draft) && JSON.stringify(draft) !== baseline;
  useUnsavedChanges(dirty && !saving);
  const save = async () => {
    setSaving(true);
    try {
      const { id, created_at, updated_at, ...fields } = draft;
      await api.db.update('site_settings', id, fields);
      setBaseline(JSON.stringify(draft));
      invalidate();
      toast('Settings saved');
    } catch (error) {
      toast(errorMessage(error), 'error');
    } finally {
      setSaving(false);
    }
  };
  const update = (patch) => setDraft((d) => ({ ...d, ...patch }));
  return { settings, draft, update, dirty, saving, save, reset: () => setDraft(row) };
}

export default function SettingsPage() {
  const { settings, draft, update, dirty, saving, save, reset } = useSettingsEditor();
  const errors = useMemo(() => {
    if (!draft) return {};
    const e = validate(draft, { site_name: ['required'], whatsapp_number: ['whatsapp'], email: ['email'] });
    (draft.social_links || []).forEach((link, i) => {
      if (validators.link(link.url) || !link.url) e[`social-${i}`] = `Social link ${i + 1}: enter a full URL`;
    });
    return e;
  }, [draft]);

  if (settings.isLoading || !draft) return <Loading />;
  if (settings.error) return <ErrorState error={settings.error} onRetry={settings.refetch} />;
  const preview = whatsappUrl(draft.whatsapp_number, draft.whatsapp_message_en);

  return (
    <div className="a-editor">
      <PageHeader title="Settings" crumbs={[['Settings']]} />
      <div className="a-editor__grid">
        <div className="a-editor__main">
          <Card title="Brand">
            <TextInput label="Site name" required value={draft.site_name} onChange={(site_name) => update({ site_name })} error={errors.site_name} />
            <MediaField label="Logo (used in structured data)" value={draft.logo_url} onChange={(logo_url) => update({ logo_url })} />
            <MediaField label="Favicon" value={draft.favicon_url} onChange={(favicon_url) => update({ favicon_url })} hint="Takes effect after the next deployment (it is part of the page head)." />
          </Card>
          <Card title="Contact">
            <TextInput label="Phone (for tel: links)" value={draft.phone} onChange={(phone) => update({ phone })} hint="International format, e.g. +201004066939" />
            <TextInput label="Phone as displayed" value={draft.phone_display} onChange={(phone_display) => update({ phone_display })} hint="e.g. +20 100 406 6939" />
            <TextInput label="Email" type="email" value={draft.email} onChange={(email) => update({ email })} error={errors.email} />
          </Card>
          <Card title="WhatsApp" description="Used by the floating button and every service's WhatsApp button.">
            <TextInput
              label="WhatsApp number"
              value={draft.whatsapp_number}
              onChange={(v) => update({ whatsapp_number: v.replace(/[^\d]/g, '') })}
              error={errors.whatsapp_number}
              hint="Country code + number, digits only (e.g. 201004066939). If this is invalid, WhatsApp buttons are hidden."
            />
            <BiRowField label="Default message (floating button)" row={draft} field="whatsapp_message" multiline onChange={update} hint="Optional. Service pages use the service's own message." />
            <BiRowField label="Floating button label" row={draft} field="whatsapp_label" onChange={update} />
            <BiRowField label="Floating button label (screen readers)" row={draft} field="whatsapp_aria" onChange={update} />
            {preview && <p className="a-hint">Link: <a href={preview} target="_blank" rel="noopener noreferrer">{preview}</a></p>}
          </Card>
          <Card title="Social links" description="Shown in the footer and added to the site's structured data.">
            {Object.entries(errors).filter(([k]) => k.startsWith('social-')).map(([k, m]) => <p key={k} className="a-error">{m}</p>)}
            <Repeater
              label="Social links"
              items={(draft.social_links || []).map((l, i) => ({ _key: String(i), ...l }))}
              onChange={(items) => update({ social_links: items.map(({ _key, ...l }) => l) })}
              addLabel="+ Add social link"
              newItem={() => ({ _key: Math.random().toString(36).slice(2), label: '', url: '' })}
              renderItem={(item, change) => (
                <>
                  <TextInput label="Label" value={item.label} onChange={(label) => change({ label })} placeholder="Instagram" />
                  <TextInput label="URL" value={item.url} onChange={(url) => change({ url })} placeholder="https://…" />
                </>
              )}
            />
          </Card>
        </div>
      </div>
      <SaveBar dirty={dirty} saving={saving} onSave={save} onReset={reset} errors={errors} />
    </div>
  );
}
