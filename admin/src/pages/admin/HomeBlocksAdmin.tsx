import React, { useEffect, useState } from 'react';
import { apiService } from '../../services/apiService';

interface HomeBlock {
  id: number;
  block_key: string;
  title: string;
  description?: string | null;
  sort_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

const HomeBlocksAdmin: React.FC = () => {
  const [blocks, setBlocks] = useState<HomeBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const loadBlocks = async () => {
    setLoading(true);
    const response = await apiService.getHomeBlocks();

    if (response.success && Array.isArray(response.data)) {
      setBlocks((response.data as HomeBlock[])
        .map(block => ({ ...block, is_active: Boolean(block.is_active) }))
        .sort((a, b) => a.sort_order - b.sort_order));
    } else {
      setMessage(response.error || 'Ошибка загрузки блоков главной страницы');
    }

    setLoading(false);
  };

  useEffect(() => {
    loadBlocks();
  }, []);

  const toggleBlock = async (block: HomeBlock, isActive: boolean) => {
    const previousBlocks = blocks;
    setSavingKey(block.block_key);
    setMessage(null);
    setBlocks(currentBlocks =>
      currentBlocks.map(item =>
        item.block_key === block.block_key ? { ...item, is_active: isActive } : item
      )
    );

    const response = await apiService.updateHomeBlock(block.block_key, { is_active: isActive });

    if (response.success && response.data) {
      const updatedBlock = response.data as HomeBlock;
      setBlocks(currentBlocks =>
        currentBlocks.map(item =>
          item.block_key === block.block_key
            ? { ...updatedBlock, is_active: Boolean(updatedBlock.is_active) }
            : item
        ).sort((a, b) => a.sort_order - b.sort_order)
      );
      setMessage(isActive ? 'Блок включен' : 'Блок скрыт');
      setTimeout(() => setMessage(null), 2500);
    } else {
      setBlocks(previousBlocks);
      setMessage(response.error || 'Ошибка сохранения статуса блока');
    }

    setSavingKey(null);
  };

  if (loading) {
    return <div className="p-8">Загрузка блоков главной...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-3" style={{ color: '#F2F0F0' }}>
          Блоки главной страницы
        </h1>
        <p className="text-sm max-w-3xl" style={{ color: '#B8B8B8' }}>
          Управление отображением секций на главной странице. Отключенный блок не выводится в пользовательской части и не попадает в новый пререндер после его генерации.
        </p>
      </div>

      {message && (
        <div
          className="mb-6 p-4 rounded-lg border"
          style={{
            color: message.includes('Ошибка') ? '#FCA5A5' : '#86EFAC',
            backgroundColor: message.includes('Ошибка') ? 'rgba(127, 29, 29, 0.25)' : 'rgba(22, 101, 52, 0.2)',
            borderColor: message.includes('Ошибка') ? 'rgba(252, 165, 165, 0.25)' : 'rgba(134, 239, 172, 0.25)'
          }}
        >
          {message}
        </div>
      )}

      <div className="grid gap-4">
        {blocks.map(block => {
          const isSaving = savingKey === block.block_key;

          return (
            <div key={block.block_key} className="admin-card">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold" style={{ color: '#F2F0F0' }}>
                      {block.title}
                    </h3>
                    <span
                      className="text-xs px-3 py-1 rounded-full border"
                      style={{
                        color: block.is_active ? '#86EFAC' : '#FCA5A5',
                        borderColor: block.is_active ? 'rgba(134, 239, 172, 0.35)' : 'rgba(252, 165, 165, 0.35)',
                        backgroundColor: block.is_active ? 'rgba(22, 101, 52, 0.18)' : 'rgba(127, 29, 29, 0.2)'
                      }}
                    >
                      {block.is_active ? 'Включен' : 'Скрыт'}
                    </span>
                  </div>
                  {block.description && (
                    <p className="mb-3" style={{ color: '#B8B8B8' }}>
                      {block.description}
                    </p>
                  )}
                  <div className="text-sm" style={{ color: '#8B8B8B' }}>
                    Ключ: {block.block_key} | Порядок: {block.sort_order}
                  </div>
                </div>

                <label className={`relative inline-flex items-center ${isSaving ? 'opacity-60 cursor-wait' : 'cursor-pointer'}`}>
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={block.is_active}
                    disabled={isSaving}
                    onChange={event => toggleBlock(block, event.target.checked)}
                    aria-label={`Переключить блок ${block.title}`}
                  />
                  <span
                    className="block w-14 h-8 rounded-full transition-colors"
                    style={{
                      backgroundColor: block.is_active ? '#D71920' : 'rgba(255, 255, 255, 0.18)',
                      border: '1px solid rgba(255, 255, 255, 0.16)'
                    }}
                  />
                  <span
                    className="absolute top-1 left-1 w-6 h-6 rounded-full bg-white transition-transform"
                    style={{
                      transform: block.is_active ? 'translateX(24px)' : 'translateX(0)'
                    }}
                  />
                </label>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HomeBlocksAdmin;
