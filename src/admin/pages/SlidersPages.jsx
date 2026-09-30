import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import CollectionList from '../CollectionList.jsx';
import { MediaField } from '../MediaPicker.jsx';
import { BiRowField, SaveBar, useRecordEditor } from '../editorKit.jsx';
import { tempId } from '../data.js';
import { slugify, validate, validators } from '../validation.js';
import { BilingualField, Card, ErrorState, Loading, MediaThumb, PageHeader, Repeater, TextInput, Toggle } from '../ui.jsx';

export function SlidersList() {
  return (
    <CollectionList
      table="sliders"
      title="Sliders"
      basePath="/admin/sliders"
      newLabel="+ New slider"
      nameField="title_en"
      publishedField="enabled"
      canDuplicate={false}
      describe={(s) => `Work collection #${s.key}`}
      publicPath={(s) => `/#${s.key}`}
    />
  );
}

const blankSlider = () => ({ key: '', enabled: true, title_en: '', title_ar: '', nav_label_en: '', nav_label_ar: '', description_en: '', description_ar: '' });
const blankSlide = () => ({
  id: tempId(), enabled: true, title_en: '', title_ar: '', description_en: '', description_ar: '', label_en: '', label_ar: '',
  video_url: '', image_url: '', poster_url: '', cta_label_en: '', cta_label_ar: '', cta_url: ''
});

export function SliderEditor() {
  const { id } = useParams();
  const editor = useRecordEditor({ table: 'sliders', id, child: { table: 'slides', key: 'slider_id' }, blank: blankSlider, basePath: '/admin/sliders', label: 'Slider' });
  const { query, isNew, draft, setDraft, children: slides, setChildren: setSlides, dirty, saving, save, reset, bi, setBi, set } = editor;

  const errors = useMemo(() => {
    if (!draft) return {};
    const e = validate(draft, { title_en: ['required'], title_ar: ['required'], key: ['slug'] });
    slides.forEach((slide, i) => {
      if (!slide.video_url && !slide.image_url) e[`slide-${i}`] = `Slide ${i + 1} needs a video or an image`;
      if (validators.link(slide.cta_url)) e[`slide-${i}-cta`] = `Slide ${i + 1}: ${validators.link(slide.cta_url)}`;
    });
    return e;
  }, [draft, slides]);

  if (query.isLoading || !draft) return <Loading />;
  if (query.error) return <ErrorState error={query.error} onRetry={query.refetch} />;

  return (
    <div className="a-editor">
      <PageHeader title={isNew ? 'New slider' : draft.title_en || 'Slider'} crumbs={[['Sliders', '/admin/sliders'], [isNew ? 'New' : draft.title_en]]} />
      <div className="a-editor__grid">
        <div className="a-editor__main">
          <Card title="Collection">
            <BilingualField
              label="Title"
              required
              value={bi('title')}
              error={{ en: errors.title_en, ar: errors.title_ar }}
              onChange={(value) => setDraft((d) => ({ ...d, title_en: value.en, title_ar: value.ar, key: isNew && !d.key ? slugify(value.en) : d.key }))}
            />
            <BilingualField label="Menu label" hint="Shown in the jump links above the collections (e.g. Reels)." value={bi('nav_label')} onChange={setBi('nav_label')} />
            <BilingualField label="Description" value={bi('description')} onChange={setBi('description')} />
          </Card>
          <Card title={`Slides (${slides.length})`} description="Each slide needs a video or an image. Drag or use the arrows to reorder.">
            {Object.entries(errors).filter(([k]) => k.startsWith('slide-')).map(([k, message]) => <p key={k} className="a-error" role="alert">{message}</p>)}
            <Repeater
              label="Slides"
              items={slides}
              onChange={setSlides}
              newItem={blankSlide}
              addLabel="+ Add slide"
              renderItem={(slide, update, index) => (
                <details className="a-collapsible" open={!slide.video_url && !slide.image_url}>
                  <summary>
                    <MediaThumb url={slide.poster_url || slide.image_url || slide.video_url} />
                    <span>{slide.title_en || `Slide ${index + 1}`}</span>
                    {!slide.enabled && <span className="a-badge a-badge--warning">Hidden</span>}
                  </summary>
                  <div className="a-collapsible__body">
                    <Toggle label="Visible" checked={slide.enabled} onChange={(enabled) => update({ enabled })} />
                    <MediaField label="Video" accept="video" value={slide.video_url} onChange={(video_url) => update({ video_url })} />
                    <MediaField label="Poster (video cover)" value={slide.poster_url} onChange={(poster_url) => update({ poster_url })} />
                    <MediaField label="Image (used when there is no video)" value={slide.image_url} onChange={(image_url) => update({ image_url })} />
                    <BiRowField label="Title" row={slide} field="title" onChange={update} />
                    <BiRowField label="Badge" row={slide} field="label" onChange={update} />
                    <BiRowField label="Description" row={slide} field="description" multiline rows={2} onChange={update} />
                    <BiRowField label="Button label" row={slide} field="cta_label" onChange={update} />
                    <TextInput label="Button link" value={slide.cta_url} onChange={(cta_url) => update({ cta_url })} hint="Optional: https://…, /services/…, #contact" />
                  </div>
                </details>
              )}
            />
          </Card>
        </div>
        <aside className="a-editor__side">
          <Card title="Visibility">
            <Toggle label="Visible on the website" checked={draft.enabled} onChange={set('enabled')} />
            <TextInput label="Anchor key" required value={draft.key} onChange={(v) => set('key')(slugify(v) || v)} error={errors.key} hint={`Section link: /#${draft.key || '…'}`} />
          </Card>
        </aside>
      </div>
      <SaveBar dirty={dirty} saving={saving} onSave={save} onReset={reset} errors={errors} />
    </div>
  );
}
