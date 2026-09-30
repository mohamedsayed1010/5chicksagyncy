import { MediaField } from './MediaPicker.jsx';
import { validators } from './validation.js';
import { BilingualField, ColorInput, Repeater, Select, TextInput, Toggle } from './ui.jsx';

// Renders one schema field (see sectionSchemas.js) — no raw JSON editing anywhere.
export function FieldRenderer({ field, value, onChange }) {
  const multiline = field.type === 'textarea';
  if (field.type === 'list')
    return (
      <Repeater
        label={field.label}
        items={value || []}
        onChange={onChange}
        addLabel={`+ Add ${field.itemLabel || 'item'}`}
        newItem={() =>
          Object.fromEntries([
            ['_key', Math.random().toString(36).slice(2)],
            ...field.fields.map((sub) => [sub.key, sub.i18n ? { en: '', ar: '' } : sub.default ?? ''])
          ])
        }
        renderItem={(item, update) =>
          field.fields.map((sub) => (
            <FieldRenderer key={sub.key} field={sub} value={item[sub.key]} onChange={(v) => update({ [sub.key]: v })} />
          ))
        }
      />
    );
  if (field.i18n)
    return <BilingualField label={field.label} hint={field.hint} multiline={multiline} rows={multiline ? 3 : undefined} value={value} onChange={onChange} />;
  if (field.type === 'media')
    return <MediaField label={field.label} hint={field.hint} accept={field.accept || 'image'} value={value} onChange={onChange} />;
  if (field.type === 'select')
    return <Select label={field.label} value={value} onChange={onChange} options={field.options.map(([v, l]) => ({ value: v, label: l }))} />;
  if (field.type === 'toggle') return <Toggle label={field.label} checked={value !== false} onChange={onChange} />;
  if (field.type === 'color') return <ColorInput label={field.label} value={value} onChange={onChange} error={value ? validators.color(value) : ''} />;
  return (
    <TextInput
      label={field.label}
      hint={field.hint}
      value={value}
      onChange={onChange}
      error={field.type === 'link' ? validators.link(value) : ''}
    />
  );
}

// Collects validation errors for a schema's values (links and colours, including inside lists).
export function schemaErrors(schema, values) {
  const errors = {};
  const check = (field, value, path) => {
    if (field.type === 'link' && validators.link(value)) errors[path] = `${field.label}: ${validators.link(value)}`;
    if (field.type === 'color' && value && validators.color(value)) errors[path] = `${field.label}: ${validators.color(value)}`;
    if (field.type === 'list') (value || []).forEach((item, i) => field.fields.forEach((sub) => check(sub, item[sub.key], `${path}.${i}.${sub.key}`)));
  };
  for (const field of schema.fields) check(field, values[field.key], field.key);
  return errors;
}
