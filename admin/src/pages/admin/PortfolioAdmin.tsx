import React, { useEffect, useState } from 'react';
import FileUpload from '../../components/FileUpload';
import { apiService } from '../../services/apiService';
import { resolveMediaUrl } from '../../utils/media';

interface PortfolioProject {
  id: number;
  title: string;
  slug: string;
  location?: string;
  summary?: string;
  description?: string;
  image_url?: string;
  sort_order: number;
  is_active: boolean;
  meta_title?: string;
  meta_description?: string;
}

interface PortfolioSection {
  id: number;
  project_id: number;
  title: string;
  description: string;
  image_url?: string;
  sort_order: number;
  is_active: boolean;
}

interface PortfolioDocument {
  id: number;
  project_id: number;
  title: string;
  file_url: string;
  file_type?: string | null;
  file_size?: number | null;
  original_filename?: string | null;
  sort_order: number;
  is_active: boolean;
}

const slugify = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9а-яё]+/gi, '-')
    .replace(/^-+|-+$/g, '');

const emptyProject = (sortOrder: number): PortfolioProject => ({
  id: 0,
  title: '',
  slug: '',
  location: '',
  summary: '',
  description: '',
  image_url: '',
  sort_order: sortOrder,
  is_active: true,
  meta_title: '',
  meta_description: ''
});

const emptySection = (projectId: number, sortOrder: number): PortfolioSection => ({
  id: 0,
  project_id: projectId,
  title: '',
  description: '',
  image_url: '',
  sort_order: sortOrder,
  is_active: true
});

const PortfolioAdmin: React.FC = () => {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [sections, setSections] = useState<PortfolioSection[]>([]);
  const [documents, setDocuments] = useState<PortfolioDocument[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [editingProject, setEditingProject] = useState<PortfolioProject | null>(null);
  const [editingSection, setEditingSection] = useState<PortfolioSection | null>(null);
  const [creatingProject, setCreatingProject] = useState(false);
  const [creatingSection, setCreatingSection] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingDocument, setUploadingDocument] = useState(false);

  const selectedProject = projects.find(project => project.id === selectedProjectId) || null;

  const loadProjects = async () => {
    setLoading(true);
    const response = await apiService.getPortfolioProjects(true);
    if (response.success && Array.isArray(response.data)) {
      const data = (response.data as PortfolioProject[]).sort((a, b) => a.sort_order - b.sort_order);
      setProjects(data);
      setSelectedProjectId(current => current || data[0]?.id || null);
    }
    setLoading(false);
  };

  const loadSections = async (projectId: number | null) => {
    if (!projectId) {
      setSections([]);
      return;
    }
    const response = await apiService.getPortfolioSections(projectId, true);
    if (response.success && Array.isArray(response.data)) {
      setSections((response.data as PortfolioSection[]).sort((a, b) => a.sort_order - b.sort_order));
    }
  };

  const loadDocuments = async (projectId: number | null) => {
    if (!projectId) {
      setDocuments([]);
      return;
    }
    const response = await apiService.getPortfolioDocuments(projectId, true);
    if (response.success && Array.isArray(response.data)) {
      setDocuments((response.data as PortfolioDocument[]).sort((a, b) => a.sort_order - b.sort_order));
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    loadSections(selectedProjectId);
    loadDocuments(selectedProjectId);
  }, [selectedProjectId]);

  const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch('/api/upload', { method: 'POST', body: formData });
    if (!response.ok) throw new Error('Ошибка загрузки файла');
    const result = await response.json();
    return result.data.url;
  };

  const uploadProjectImage = async (file: File) => {
    if (!editingProject) return;
    setUploading(true);
    try {
      const url = await uploadFile(file);
      setEditingProject({ ...editingProject, image_url: url });
    } catch (error) {
      console.error('Project image upload error:', error);
      alert('Ошибка загрузки изображения');
    } finally {
      setUploading(false);
    }
  };

  const uploadSectionImage = async (file: File) => {
    if (!editingSection) return;
    setUploading(true);
    try {
      const url = await uploadFile(file);
      setEditingSection({ ...editingSection, image_url: url });
    } catch (error) {
      console.error('Section image upload error:', error);
      alert('Ошибка загрузки изображения');
    } finally {
      setUploading(false);
    }
  };

  const uploadPortfolioDocument = async (file: File) => {
    if (!selectedProjectId) return;
    setUploadingDocument(true);
    try {
      const response = await apiService.uploadFile(file, 'document');
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Ошибка загрузки документа');
      }

      const data = response.data as {
        url?: string;
        publicUrl?: string;
        originalName?: string;
        mimetype?: string;
        size?: number;
      };
      const fileUrl = data.url || data.publicUrl;
      if (!fileUrl) {
        throw new Error('Сервер не вернул URL документа');
      }

      const documentResponse = await apiService.createPortfolioDocument(selectedProjectId, {
        title: data.originalName || file.name,
        file_url: fileUrl,
        file_type: data.mimetype || file.type || null,
        file_size: data.size || file.size || null,
        original_filename: data.originalName || file.name,
        sort_order: documents.length + 1,
        is_active: true
      });

      if (!documentResponse.success) {
        throw new Error(documentResponse.error || 'Ошибка сохранения документа проекта');
      }

      await loadDocuments(selectedProjectId);
    } catch (error) {
      console.error('Portfolio document upload error:', error);
      alert(error instanceof Error ? error.message : 'Ошибка загрузки документа');
    } finally {
      setUploadingDocument(false);
    }
  };

  const deleteDocument = async (id: number) => {
    if (!window.confirm('Удалить документ проекта?')) return;
    const response = await apiService.deletePortfolioDocument(id);
    if (response.success) {
      setDocuments(documents.filter(document => document.id !== id));
    } else {
      alert(response.error || 'Ошибка удаления документа');
    }
  };

  const saveProject = async () => {
    if (!editingProject) return;
    const projectToSave = {
      ...editingProject,
      slug: editingProject.slug || slugify(editingProject.title)
    };
    setSaving(true);
    const response = creatingProject
      ? await apiService.createPortfolioProject(projectToSave)
      : await apiService.updatePortfolioProject(projectToSave.id, projectToSave);

    if (response.success) {
      await loadProjects();
      setEditingProject(null);
      setCreatingProject(false);
    } else {
      alert(response.error || 'Ошибка сохранения проекта');
    }
    setSaving(false);
  };

  const deleteProject = async (id: number) => {
    if (!window.confirm('Удалить проект вместе со всеми секциями карточки?')) return;
    const response = await apiService.deletePortfolioProject(id);
    if (response.success) {
      await loadProjects();
      if (selectedProjectId === id) {
        setSelectedProjectId(null);
      }
    } else {
      alert(response.error || 'Ошибка удаления проекта');
    }
  };

  const saveSection = async () => {
    if (!editingSection || !selectedProjectId) return;
    setSaving(true);
    const response = creatingSection
      ? await apiService.createPortfolioSection(selectedProjectId, editingSection)
      : await apiService.updatePortfolioSection(editingSection.id, editingSection);

    if (response.success) {
      await loadSections(selectedProjectId);
      setEditingSection(null);
      setCreatingSection(false);
    } else {
      alert(response.error || 'Ошибка сохранения секции');
    }
    setSaving(false);
  };

  const deleteSection = async (id: number) => {
    if (!window.confirm('Удалить секцию карточки?')) return;
    const response = await apiService.deletePortfolioSection(id);
    if (response.success) {
      setSections(sections.filter(section => section.id !== id));
    } else {
      alert(response.error || 'Ошибка удаления секции');
    }
  };

  const moveProject = async (index: number, direction: -1 | 1) => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= projects.length) return;
    const ordered = [...projects];
    const [project] = ordered.splice(index, 1);
    ordered.splice(nextIndex, 0, project);
    const normalized = ordered.map((entry, orderIndex) => ({ ...entry, sort_order: orderIndex + 1 }));
    setProjects(normalized);
    await Promise.all(normalized.map(item => apiService.updatePortfolioProject(item.id, item)));
    await loadProjects();
  };

  const moveSection = async (index: number, direction: -1 | 1) => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= sections.length) return;
    const ordered = [...sections];
    const [section] = ordered.splice(index, 1);
    ordered.splice(nextIndex, 0, section);
    const normalized = ordered.map((entry, orderIndex) => ({ ...entry, sort_order: orderIndex + 1 }));
    setSections(normalized);
    await Promise.all(normalized.map(item => apiService.updatePortfolioSection(item.id, item)));
    await loadSections(selectedProjectId);
  };

  if (loading) return <div className="p-8">Загрузка портфолио...</div>;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6" style={{ color: '#F2F0F0' }}>
          Управление портфолио
        </h1>
        <button
          onClick={() => {
            setEditingProject(emptyProject(projects.length + 1));
            setCreatingProject(true);
          }}
          className="admin-button-primary"
        >
          Добавить проект
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <section>
          <h2 className="text-xl font-semibold mb-4" style={{ color: '#F2F0F0' }}>Проекты</h2>
          <div className="grid gap-5">
            {projects.map((project, index) => (
              <div
                key={project.id}
                className="admin-card"
                style={{ borderColor: selectedProjectId === project.id ? '#D71920' : undefined }}
              >
                <div className="flex gap-4">
                  {project.image_url && (
                    <img src={resolveMediaUrl(project.image_url)} alt={project.title} className="w-28 h-28 object-cover rounded-lg flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <button onClick={() => setSelectedProjectId(project.id)} className="text-left">
                      <h3 className="text-lg font-semibold mb-2" style={{ color: '#F2F0F0' }}>{project.title}</h3>
                    </button>
                    <div className="text-sm mb-2" style={{ color: '#8B8B8B' }}>/{project.slug}</div>
                    <p className="text-sm" style={{ color: '#B8B8B8' }}>{project.summary}</p>
                    <div className="text-sm mt-3" style={{ color: '#8B8B8B' }}>
                      Порядок: {project.sort_order} | Статус: {project.is_active ? 'Активен' : 'Скрыт'}
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  <button onClick={() => moveProject(index, -1)} className="admin-button-secondary" disabled={index === 0}>Выше</button>
                  <button onClick={() => moveProject(index, 1)} className="admin-button-secondary" disabled={index === projects.length - 1}>Ниже</button>
                  <button onClick={() => setSelectedProjectId(project.id)} className="admin-button-secondary">Секции</button>
                  <button onClick={() => { setEditingProject({ ...project }); setCreatingProject(false); }} className="admin-button-secondary">Редактировать</button>
                  <button onClick={() => deleteProject(project.id)} className="admin-button-danger">Удалить</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold" style={{ color: '#F2F0F0' }}>
              Секции карточки {selectedProject ? `«${selectedProject.title}»` : ''}
            </h2>
            {selectedProjectId && (
              <button
                onClick={() => {
                  setEditingSection(emptySection(selectedProjectId, sections.length + 1));
                  setCreatingSection(true);
                }}
                className="admin-button-primary"
              >
                Добавить секцию
              </button>
            )}
          </div>

          {!selectedProjectId ? (
            <div className="admin-card" style={{ color: '#B8B8B8' }}>Выберите проект для редактирования карточки.</div>
          ) : (
            <div className="grid gap-5">
              {sections.map((section, index) => (
                <div key={section.id} className="admin-card">
                  <div className="flex gap-4">
                    {section.image_url && (
                      <img src={resolveMediaUrl(section.image_url)} alt={section.title} className="w-28 h-20 object-cover rounded-lg flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2" style={{ color: '#F2F0F0' }}>{section.title}</h3>
                      <p className="text-sm whitespace-pre-line" style={{ color: '#B8B8B8' }}>{section.description}</p>
                      <div className="text-sm mt-3" style={{ color: '#8B8B8B' }}>
                        Порядок: {section.sort_order} | Статус: {section.is_active ? 'Активна' : 'Скрыта'}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    <button onClick={() => moveSection(index, -1)} className="admin-button-secondary" disabled={index === 0}>Выше</button>
                    <button onClick={() => moveSection(index, 1)} className="admin-button-secondary" disabled={index === sections.length - 1}>Ниже</button>
                    <button onClick={() => { setEditingSection({ ...section }); setCreatingSection(false); }} className="admin-button-secondary">Редактировать</button>
                    <button onClick={() => deleteSection(section.id)} className="admin-button-danger">Удалить</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {selectedProjectId && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4" style={{ color: '#F2F0F0' }}>
                Документация проекта для ZIP-архива
              </h3>
              <div className="admin-card">
                <FileUpload
                  onFileSelect={uploadPortfolioDocument}
                  accept=".pdf,.doc,.docx,.xls,.xlsx"
                  maxSize={100}
                  disabled={uploadingDocument}
                />
                {uploadingDocument && (
                  <div className="mt-2 text-sm" style={{ color: '#B8B8B8' }}>Загрузка документа...</div>
                )}

                <div className="mt-5 space-y-3">
                  {documents.length === 0 ? (
                    <div className="text-sm" style={{ color: '#8B8B8B' }}>
                      Документы пока не загружены.
                    </div>
                  ) : (
                    documents.map(document => (
                      <div key={document.id} className="flex items-center justify-between gap-4 p-3 bg-gray-800 rounded-lg">
                        <div className="min-w-0">
                          <div className="text-sm font-medium truncate" style={{ color: '#F2F0F0' }}>
                            {document.title}
                          </div>
                          <div className="text-xs" style={{ color: '#8B8B8B' }}>
                            {document.file_size ? `${(document.file_size / 1024 / 1024).toFixed(2)} MB` : 'Размер не указан'}
                          </div>
                        </div>
                        <button onClick={() => deleteDocument(document.id)} className="admin-button-danger">
                          Удалить
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </section>
      </div>

      {editingProject && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="admin-card max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6" style={{ color: '#F2F0F0' }}>
              {creatingProject ? 'Новый проект' : 'Редактирование проекта'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#B8B8B8' }}>Название</label>
                <input className="admin-input" value={editingProject.title} onChange={e => setEditingProject({ ...editingProject, title: e.target.value, slug: editingProject.slug || slugify(e.target.value) })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#B8B8B8' }}>Slug</label>
                <input className="admin-input" value={editingProject.slug} onChange={e => setEditingProject({ ...editingProject, slug: slugify(e.target.value) })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#B8B8B8' }}>Локация</label>
                <input className="admin-input" value={editingProject.location || ''} onChange={e => setEditingProject({ ...editingProject, location: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#B8B8B8' }}>Порядок</label>
                <input type="number" className="admin-input" value={editingProject.sort_order} onChange={e => setEditingProject({ ...editingProject, sort_order: parseInt(e.target.value, 10) || 0 })} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2" style={{ color: '#B8B8B8' }}>Краткое описание для списка</label>
                <textarea className="admin-input h-24" value={editingProject.summary || ''} onChange={e => setEditingProject({ ...editingProject, summary: e.target.value })} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2" style={{ color: '#B8B8B8' }}>Описание для карточки</label>
                <textarea className="admin-input h-36" value={editingProject.description || ''} onChange={e => setEditingProject({ ...editingProject, description: e.target.value })} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2" style={{ color: '#B8B8B8' }}>Изображение</label>
                <FileUpload onFileSelect={uploadProjectImage} accept="image/*" maxSize={10} disabled={uploading} showPreview />
                <input className="admin-input mt-3" value={editingProject.image_url || ''} onChange={e => setEditingProject({ ...editingProject, image_url: e.target.value })} />
                {editingProject.image_url && <img src={resolveMediaUrl(editingProject.image_url)} alt="Preview" className="mt-3 w-44 h-32 object-cover rounded-lg" />}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#B8B8B8' }}>SEO title</label>
                <input className="admin-input" value={editingProject.meta_title || ''} onChange={e => setEditingProject({ ...editingProject, meta_title: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#B8B8B8' }}>SEO description</label>
                <textarea className="admin-input h-24" value={editingProject.meta_description || ''} onChange={e => setEditingProject({ ...editingProject, meta_description: e.target.value })} />
              </div>
              <label className="flex items-center gap-2 text-sm" style={{ color: '#B8B8B8' }}>
                <input type="checkbox" checked={editingProject.is_active} onChange={e => setEditingProject({ ...editingProject, is_active: e.target.checked })} style={{ accentColor: '#D71920' }} />
                Активен на сайте
              </label>
            </div>
            <div className="flex gap-4 mt-8">
              <button onClick={saveProject} className="admin-button-success" disabled={saving}>{saving ? 'Сохранение...' : 'Сохранить'}</button>
              <button onClick={() => setEditingProject(null)} className="admin-button-secondary">Отмена</button>
            </div>
          </div>
        </div>
      )}

      {editingSection && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="admin-card max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6" style={{ color: '#F2F0F0' }}>
              {creatingSection ? 'Новая секция карточки' : 'Редактирование секции'}
            </h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#B8B8B8' }}>Заголовок</label>
                <input className="admin-input" value={editingSection.title} onChange={e => setEditingSection({ ...editingSection, title: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#B8B8B8' }}>Описание</label>
                <textarea className="admin-input h-40" value={editingSection.description} onChange={e => setEditingSection({ ...editingSection, description: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#B8B8B8' }}>Изображение</label>
                <FileUpload onFileSelect={uploadSectionImage} accept="image/*" maxSize={10} disabled={uploading} showPreview />
                <input className="admin-input mt-3" value={editingSection.image_url || ''} onChange={e => setEditingSection({ ...editingSection, image_url: e.target.value })} />
                {editingSection.image_url && <img src={resolveMediaUrl(editingSection.image_url)} alt="Preview" className="mt-3 w-44 h-32 object-cover rounded-lg" />}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#B8B8B8' }}>Порядок</label>
                <input type="number" className="admin-input" value={editingSection.sort_order} onChange={e => setEditingSection({ ...editingSection, sort_order: parseInt(e.target.value, 10) || 0 })} />
              </div>
              <label className="flex items-center gap-2 text-sm" style={{ color: '#B8B8B8' }}>
                <input type="checkbox" checked={editingSection.is_active} onChange={e => setEditingSection({ ...editingSection, is_active: e.target.checked })} style={{ accentColor: '#D71920' }} />
                Активна на сайте
              </label>
            </div>
            <div className="flex gap-4 mt-8">
              <button onClick={saveSection} className="admin-button-success" disabled={saving}>{saving ? 'Сохранение...' : 'Сохранить'}</button>
              <button onClick={() => setEditingSection(null)} className="admin-button-secondary">Отмена</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioAdmin;
