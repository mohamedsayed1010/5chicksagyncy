import { Link, useNavigate } from 'react-router-dom';
import { useCmsMutation, useList, errorMessage } from './data.js';
import { Badge, Button, EmptyState, ErrorState, Loading, MediaThumb, PageHeader, SortableList, useFeedback } from './ui.jsx';

// Shared list screen for services, projects and sliders: reorder, publish/unpublish,
// duplicate, delete, edit.
export default function CollectionList({
  table,
  title,
  basePath,
  publishedField = 'published',
  nameField = 'name_en',
  thumbField,
  describe,
  publicPath,
  canDuplicate = true,
  newLabel
}) {
  const navigate = useNavigate();
  const { toast, confirm } = useFeedback();
  const list = useList(table);
  const onError = (error) => toast(errorMessage(error), 'error');
  const reorder = useCmsMutation((api, ids) => api.db.reorder(table, ids), { onError, onSuccess: () => toast('Order saved') });
  const toggle = useCmsMutation((api, row) => api.db.update(table, row.id, { [publishedField]: !row[publishedField] }), {
    onError,
    onSuccess: (row) => toast(row[publishedField] ? 'Published' : 'Unpublished')
  });
  const duplicate = useCmsMutation((api, row) => api.db.duplicate(table, row.id), {
    onError,
    onSuccess: (id) => {
      toast('Duplicated as an unpublished draft');
      navigate(`${basePath}/${id}`);
    }
  });
  const remove = useCmsMutation((api, row) => api.db.remove(table, row.id), { onError, onSuccess: () => toast('Deleted') });

  const rows = list.data || [];
  return (
    <>
      <PageHeader
        title={title}
        crumbs={[[title]]}
        actions={newLabel && <Link className="a-btn a-btn--primary" to={`${basePath}/new`}>{newLabel}</Link>}
      />
      {list.isLoading ? (
        <Loading />
      ) : list.error ? (
        <ErrorState error={list.error} onRetry={list.refetch} />
      ) : rows.length === 0 ? (
        <EmptyState
          title={`No ${title.toLowerCase()} yet`}
          action={newLabel && <Link className="a-btn a-btn--primary" to={`${basePath}/new`}>{newLabel}</Link>}
        />
      ) : (
        <SortableList
          label={title}
          items={rows}
          onReorder={(next) => reorder.mutate(next.map((r) => r.id))}
          renderItem={(row) => (
            <div className="a-row-item">
              {thumbField && <MediaThumb url={row[thumbField]} />}
              <div className="a-row-item__text">
                <Link to={`${basePath}/${row.id}`} className="a-row-item__title">{row[nameField] || '(untitled)'}</Link>
                <span className="a-muted">{describe?.(row)}</span>
              </div>
              <Badge tone={row[publishedField] ? 'success' : 'warning'}>{row[publishedField] ? (publishedField === 'enabled' ? 'Visible' : 'Published') : publishedField === 'enabled' ? 'Hidden' : 'Draft'}</Badge>
              <div className="a-row-item__actions">
                {publicPath && row[publishedField] && (
                  <a className="a-btn a-btn--ghost a-btn--sm" href={publicPath(row)} target="_blank" rel="noopener noreferrer">View ↗</a>
                )}
                <Button size="sm" onClick={() => toggle.mutate(row)}>{row[publishedField] ? (publishedField === 'enabled' ? 'Hide' : 'Unpublish') : publishedField === 'enabled' ? 'Show' : 'Publish'}</Button>
                {canDuplicate && <Button size="sm" onClick={() => duplicate.mutate(row)}>Duplicate</Button>}
                <Link className="a-btn a-btn--sm" to={`${basePath}/${row.id}`}>Edit</Link>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={async () => {
                    if (await confirm({ title: `Delete “${row[nameField]}”?`, message: 'This permanently deletes it and everything inside it. This cannot be undone.', confirmLabel: 'Delete', danger: true }))
                      remove.mutate(row);
                  }}
                >
                  Delete
                </Button>
              </div>
            </div>
          )}
        />
      )}
    </>
  );
}
