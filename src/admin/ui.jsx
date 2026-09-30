import { createContext, useCallback, useContext, useEffect, useId, useRef, useState } from 'react';
import { Link, useBlocker } from 'react-router-dom';
import { assetUrl } from '../cms/resolve.js';

// ---------------------------------------------------------------------------------------------
// Basic building blocks
// ---------------------------------------------------------------------------------------------
export function Button({ variant = 'default', size, busy, children, className = '', ...props }) {
  return (
    <button
      type="button"
      className={`a-btn a-btn--${variant}${size ? ` a-btn--${size}` : ''} ${className}`}
      disabled={busy || props.disabled}
      aria-busy={busy || undefined}
      {...props}
    >
      {busy && <span className="a-spinner" aria-hidden="true" />}
      {children}
    </button>
  );
}

export function PageHeader({ title, crumbs = [], actions, children }) {
  return (
    <div className="a-page-header">
      <nav className="a-crumbs" aria-label="Breadcrumb">
        <ol>
          <li><Link to="/admin/dashboard">Dashboard</Link></li>
          {crumbs.map(([label, to], i) => (
            <li key={i}>{to ? <Link to={to}>{label}</Link> : <span aria-current="page">{label}</span>}</li>
          ))}
        </ol>
      </nav>
      <div className="a-page-header__row">
        <h1>{title}</h1>
        {actions && <div className="a-page-header__actions">{actions}</div>}
      </div>
      {children}
    </div>
  );
}

export const Card = ({ title, description, children, actions, className = '' }) => (
  <section className={`a-card ${className}`}>
    {(title || actions) && (
      <div className="a-card__head">
        <div>
          {title && <h2>{title}</h2>}
          {description && <p>{description}</p>}
        </div>
        {actions}
      </div>
    )}
    {children}
  </section>
);

export const Badge = ({ tone = 'neutral', children }) => <span className={`a-badge a-badge--${tone}`}>{children}</span>;

export const Loading = ({ label = 'Loading…' }) => (
  <div className="a-state" role="status">
    <span className="a-spinner" aria-hidden="true" /> {label}
  </div>
);

export const ErrorState = ({ error, onRetry }) => (
  <div className="a-state a-state--error" role="alert">
    <strong>Something went wrong.</strong> {error?.message || String(error)}
    {onRetry && <Button onClick={onRetry}>Try again</Button>}
  </div>
);

export const EmptyState = ({ title, text, action }) => (
  <div className="a-empty">
    <strong>{title}</strong>
    {text && <p>{text}</p>}
    {action}
  </div>
);

// ---------------------------------------------------------------------------------------------
// Form fields
// ---------------------------------------------------------------------------------------------
export function Field({ label, hint, error, children, id, required }) {
  return (
    <div className={`a-field${error ? ' has-error' : ''}`}>
      {label && (
        <label htmlFor={id}>
          {label}
          {required && <span className="a-required" aria-hidden="true"> *</span>}
        </label>
      )}
      {children}
      {hint && !error && <p className="a-hint" id={id + '-hint'}>{hint}</p>}
      {error && <p className="a-error" id={id + '-error'} role="alert">{error}</p>}
    </div>
  );
}

export function TextInput({ label, hint, error, value, onChange, multiline, rows = 3, dir, required, ...props }) {
  const id = useId();
  const Tag = multiline ? 'textarea' : 'input';
  return (
    <Field label={label} hint={hint} error={error} id={id} required={required}>
      <Tag
        id={id}
        className="a-input"
        value={value ?? ''}
        dir={dir}
        rows={multiline ? rows : undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? id + '-error' : hint ? id + '-hint' : undefined}
        onChange={(e) => onChange(e.target.value)}
        {...props}
      />
    </Field>
  );
}

export function Toggle({ label, checked, onChange, hint }) {
  const id = useId();
  return (
    <div className="a-toggle-row">
      <label className="a-toggle" htmlFor={id}>
        <input id={id} type="checkbox" role="switch" checked={Boolean(checked)} onChange={(e) => onChange(e.target.checked)} />
        <span className="a-toggle__track" aria-hidden="true" />
        <span>{label}</span>
      </label>
      {hint && <p className="a-hint">{hint}</p>}
    </div>
  );
}

export function Select({ label, value, onChange, options, hint }) {
  const id = useId();
  return (
    <Field label={label} hint={hint} id={id}>
      <select id={id} className="a-input" value={value ?? ''} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </Field>
  );
}

export function ColorInput({ label, value, onChange, error }) {
  const id = useId();
  return (
    <Field label={label} error={error} id={id}>
      <div className="a-color">
        <input type="color" value={/^#[0-9a-f]{6}$/i.test(value || '') ? value : '#00ff87'} onChange={(e) => onChange(e.target.value)} aria-label={`${label} picker`} />
        <input id={id} className="a-input" value={value ?? ''} onChange={(e) => onChange(e.target.value)} aria-invalid={error ? true : undefined} />
      </div>
    </Field>
  );
}

// English and Arabic side by side; the Arabic input is right-to-left.
export function BilingualField({ label, value = {}, onChange, multiline, rows, hint, error, required }) {
  return (
    <fieldset className="a-bilingual">
      <legend>
        {label}
        {required && <span className="a-required" aria-hidden="true"> *</span>}
      </legend>
      <TextInput label="English" value={value.en} multiline={multiline} rows={rows} error={error?.en} required={required} onChange={(en) => onChange({ ...value, en })} />
      <TextInput label="العربية" dir="rtl" lang="ar" value={value.ar} multiline={multiline} rows={rows} error={error?.ar} onChange={(ar) => onChange({ ...value, ar })} />
      {hint && <p className="a-hint">{hint}</p>}
    </fieldset>
  );
}

// ---------------------------------------------------------------------------------------------
// Sortable list: drag handles + keyboard-accessible up/down buttons
// ---------------------------------------------------------------------------------------------
export function SortableList({ items, getKey = (item) => item.id, onReorder, renderItem, label = 'items' }) {
  const [dragIndex, setDragIndex] = useState(null);
  const [overIndex, setOverIndex] = useState(null);
  const move = (from, to) => {
    if (to < 0 || to >= items.length || from === to) return;
    const next = [...items];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    onReorder(next);
  };
  return (
    <ol className="a-sortable" aria-label={label}>
      {items.map((item, index) => (
        <li
          key={getKey(item)}
          className={`a-sortable__item${dragIndex === index ? ' is-dragging' : ''}${overIndex === index && dragIndex !== index ? ' is-over' : ''}`}
          draggable={Boolean(onReorder)}
          onDragStart={(e) => {
            if (!e.target.closest?.('.a-drag')) return e.preventDefault();
            setDragIndex(index);
            e.dataTransfer.effectAllowed = 'move';
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setOverIndex(index);
          }}
          onDrop={(e) => {
            e.preventDefault();
            if (dragIndex !== null) move(dragIndex, index);
            setDragIndex(null);
            setOverIndex(null);
          }}
          onDragEnd={() => {
            setDragIndex(null);
            setOverIndex(null);
          }}
        >
          {onReorder && (
            <div className="a-sortable__handle">
              <span className="a-drag" title="Drag to reorder" aria-hidden="true">⋮⋮</span>
              <button type="button" className="a-icon-btn" aria-label={`Move item ${index + 1} up`} disabled={index === 0} onClick={() => move(index, index - 1)}>↑</button>
              <button type="button" className="a-icon-btn" aria-label={`Move item ${index + 1} down`} disabled={index === items.length - 1} onClick={() => move(index, index + 1)}>↓</button>
            </div>
          )}
          <div className="a-sortable__body">{renderItem(item, index)}</div>
        </li>
      ))}
    </ol>
  );
}

// Repeatable field group with "+ Add item": each item is edited inline, can be removed and reordered.
export function Repeater({ label, items, onChange, newItem, renderItem, addLabel = '+ Add item', empty = 'No items yet.' }) {
  const update = (index, patch) => onChange(items.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  return (
    <div className="a-repeater">
      <div className="a-repeater__head">
        <h3>{label} <span className="a-count">{items.length}</span></h3>
      </div>
      {items.length === 0 && <p className="a-muted">{empty}</p>}
      <SortableList
        label={label}
        items={items}
        getKey={(item) => item.id || item._key}
        onReorder={onChange}
        renderItem={(item, index) => (
          <div className="a-repeater__item">
            <div className="a-repeater__fields">{renderItem(item, (patch) => update(index, patch), index)}</div>
            <button type="button" className="a-icon-btn a-icon-btn--danger" aria-label={`Remove item ${index + 1}`} onClick={() => onChange(items.filter((_, i) => i !== index))}>
              ✕
            </button>
          </div>
        )}
      />
      <Button onClick={() => onChange([...items, newItem()])}>{addLabel}</Button>
    </div>
  );
}

// ---------------------------------------------------------------------------------------------
// Modal, confirmation dialog and toasts
// ---------------------------------------------------------------------------------------------
export function Modal({ title, onClose, children, footer, wide }) {
  const ref = useRef(null);
  useEffect(() => {
    const dialog = ref.current;
    dialog.showModal();
    return () => dialog.open && dialog.close();
  }, []);
  return (
    <dialog ref={ref} className={`a-modal${wide ? ' a-modal--wide' : ''}`} onCancel={(e) => { e.preventDefault(); onClose(); }} aria-label={title}>
      <div className="a-modal__head">
        <h2>{title}</h2>
        <button type="button" className="a-icon-btn" aria-label="Close" onClick={onClose}>✕</button>
      </div>
      <div className="a-modal__body">{children}</div>
      {footer && <div className="a-modal__foot">{footer}</div>}
    </dialog>
  );
}

const FeedbackContext = createContext(null);

export function FeedbackProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const [confirmState, setConfirmState] = useState(null);
  const toast = useCallback((message, tone = 'success') => {
    const id = Math.random();
    setToasts((list) => [...list, { id, message, tone }]);
    setTimeout(() => setToasts((list) => list.filter((t) => t.id !== id)), tone === 'error' ? 7000 : 3500);
  }, []);
  const confirm = useCallback(
    (options) => new Promise((resolve) => setConfirmState({ ...options, resolve })),
    []
  );
  const close = (result) => {
    confirmState.resolve(result);
    setConfirmState(null);
  };
  return (
    <FeedbackContext.Provider value={{ toast, confirm }}>
      {children}
      <div className="a-toasts" role="status" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`a-toast a-toast--${t.tone}`}>{t.message}</div>
        ))}
      </div>
      {confirmState && (
        <Modal
          title={confirmState.title || 'Are you sure?'}
          onClose={() => close(false)}
          footer={
            <>
              <Button onClick={() => close(false)}>{confirmState.cancelLabel || 'Cancel'}</Button>
              <Button variant={confirmState.danger ? 'danger' : 'primary'} onClick={() => close(true)} autoFocus>
                {confirmState.confirmLabel || 'Confirm'}
              </Button>
            </>
          }
        >
          <p>{confirmState.message}</p>
          {confirmState.details && <ul className="a-list">{confirmState.details.map((d) => <li key={d}>{d}</li>)}</ul>}
        </Modal>
      )}
    </FeedbackContext.Provider>
  );
}

export const useFeedback = () => useContext(FeedbackContext);

// Warns before leaving a page with unsaved changes (in-app navigation and closing/reloading the tab).
export function useUnsavedChanges(dirty) {
  const { confirm } = useFeedback();
  const blocker = useBlocker(({ currentLocation, nextLocation }) => dirty && currentLocation.pathname !== nextLocation.pathname);
  useEffect(() => {
    if (blocker.state !== 'blocked') return;
    confirm({
      title: 'Discard unsaved changes?',
      message: 'You have changes that have not been saved. Leaving this page will discard them.',
      confirmLabel: 'Discard changes',
      cancelLabel: 'Keep editing',
      danger: true
    }).then((ok) => (ok ? blocker.proceed() : blocker.reset()));
  }, [blocker, confirm]);
  useEffect(() => {
    if (!dirty) return;
    const handler = (e) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [dirty]);
}

// Preview for an image/video URL.
export function MediaThumb({ url, kind, alt = '' }) {
  if (!url) return <span className="a-thumb a-thumb--empty">No file</span>;
  const src = assetUrl(url);
  const isVideo = kind === 'video' || /\.(mp4|webm|mov)(\?|$)/i.test(url);
  const isDoc = kind === 'document' || /\.pdf(\?|$)/i.test(url);
  if (isDoc) return <span className="a-thumb a-thumb--doc">PDF</span>;
  return isVideo ? (
    <video className="a-thumb" src={src} muted preload="metadata" aria-label={alt || 'Video preview'} />
  ) : (
    <img className="a-thumb" src={src} alt={alt} loading="lazy" />
  );
}
