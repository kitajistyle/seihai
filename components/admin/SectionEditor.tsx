'use client';

import { useState } from 'react';
import { Plus, Trash2, ChevronUp, ChevronDown, Image as ImageIcon, Type, AlignLeft, Zap } from 'lucide-react';
import { Section, SectionType } from '@/types';
import CloudinaryUpload from './CloudinaryUpload';

interface SectionEditorProps {
  value: Section[];
  onChange: (sections: Section[]) => void;
  imageFolder?: string;
}

const SECTION_TYPES: { type: SectionType; label: string; icon: React.ReactNode; description: string }[] = [
  { type: 'text', label: 'テキスト', icon: <AlignLeft size={16} />, description: '見出し＋本文のテキストブロック' },
  { type: 'image', label: '画像', icon: <ImageIcon size={16} />, description: 'フル幅の画像（キャプション付き）' },
  { type: 'image_text', label: '画像＋テキスト', icon: <Type size={16} />, description: '画像とテキストを横並びに配置' },
  { type: 'callout', label: 'コールアウト', icon: <Zap size={16} />, description: '重要情報をハイライト表示' },
];

function generateId() {
  return Math.random().toString(36).slice(2, 9);
}

function createSection(type: SectionType): Section {
  return { id: generateId(), type };
}

export default function SectionEditor({ value, onChange, imageFolder = 'sections' }: SectionEditorProps) {
  const [addingType, setAddingType] = useState(false);

  const add = (type: SectionType) => {
    onChange([...value, createSection(type)]);
    setAddingType(false);
  };

  const remove = (id: string) => {
    onChange(value.filter(s => s.id !== id));
  };

  const update = (id: string, patch: Partial<Section>) => {
    onChange(value.map(s => s.id === id ? { ...s, ...patch } : s));
  };

  const move = (index: number, dir: -1 | 1) => {
    const next = [...value];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  return (
    <div className="space-y-3">
      {value.length === 0 && (
        <p className="text-xs text-gray-600 italic py-4 text-center border border-dashed border-white/10 rounded-xl">
          セクションがありません。下の「セクションを追加」から追加してください。
        </p>
      )}

      {value.map((section, index) => (
        <div key={section.id} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
          {/* Section Header */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-white/5 border-b border-white/5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                {SECTION_TYPES.find(t => t.type === section.type)?.label}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button type="button" onClick={() => move(index, -1)} disabled={index === 0} className="p-1.5 text-gray-600 hover:text-white disabled:opacity-20 transition-colors">
                <ChevronUp size={14} />
              </button>
              <button type="button" onClick={() => move(index, 1)} disabled={index === value.length - 1} className="p-1.5 text-gray-600 hover:text-white disabled:opacity-20 transition-colors">
                <ChevronDown size={14} />
              </button>
              <button type="button" onClick={() => remove(section.id)} className="p-1.5 text-gray-600 hover:text-red-400 transition-colors ml-1">
                <Trash2 size={14} />
              </button>
            </div>
          </div>

          {/* Section Body */}
          <div className="p-4 space-y-3">
            {section.type === 'text' && (
              <TextSectionFields section={section} update={update} />
            )}
            {section.type === 'image' && (
              <ImageSectionFields section={section} update={update} folder={imageFolder} />
            )}
            {section.type === 'image_text' && (
              <ImageTextSectionFields section={section} update={update} folder={imageFolder} />
            )}
            {section.type === 'callout' && (
              <CalloutSectionFields section={section} update={update} />
            )}
          </div>
        </div>
      ))}

      {/* Add Section */}
      {addingType ? (
        <div className="border border-white/10 rounded-xl p-4 space-y-2 bg-black/20">
          <p className="text-xs font-bold text-gray-400 mb-3">追加するセクションの種類を選択</p>
          <div className="grid grid-cols-2 gap-2">
            {SECTION_TYPES.map(t => (
              <button
                key={t.type}
                type="button"
                onClick={() => add(t.type)}
                className="flex items-start gap-3 p-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[var(--color-brand-blue)]/50 rounded-xl text-left transition-all group"
              >
                <span className="text-[var(--color-brand-blue)] mt-0.5 shrink-0">{t.icon}</span>
                <div>
                  <p className="text-xs font-bold text-white">{t.label}</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">{t.description}</p>
                </div>
              </button>
            ))}
          </div>
          <button type="button" onClick={() => setAddingType(false)} className="w-full text-xs text-gray-600 hover:text-gray-400 py-1 transition-colors">
            キャンセル
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setAddingType(true)}
          className="w-full flex items-center justify-center gap-2 py-3 border border-dashed border-white/15 hover:border-[var(--color-brand-blue)]/50 rounded-xl text-xs font-bold text-gray-500 hover:text-[var(--color-brand-blue)] transition-all"
        >
          <Plus size={14} /> セクションを追加
        </button>
      )}
    </div>
  );
}

function TextSectionFields({ section, update }: { section: Section; update: (id: string, patch: Partial<Section>) => void }) {
  return (
    <>
      <div className="space-y-1">
        <label className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">見出し（任意）</label>
        <input
          type="text"
          value={section.heading || ''}
          onChange={e => update(section.id, { heading: e.target.value })}
          className="admin-input w-full text-sm"
          placeholder="セクションの見出し"
        />
      </div>
      <div className="space-y-1">
        <label className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">本文</label>
        <textarea
          value={section.content || ''}
          onChange={e => update(section.id, { content: e.target.value })}
          className="admin-input w-full h-28 resize-none py-3 text-sm"
          placeholder="本文を入力してください..."
        />
      </div>
    </>
  );
}

function ImageSectionFields({ section, update, folder }: { section: Section; update: (id: string, patch: Partial<Section>) => void; folder: string }) {
  return (
    <>
      <div className="space-y-1">
        <label className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">画像URL</label>
        <div className="space-y-1.5">
          <input
            type="text"
            value={section.image_url || ''}
            onChange={e => update(section.id, { image_url: e.target.value })}
            className="admin-input w-full text-sm"
            placeholder="https://..."
          />
          <CloudinaryUpload folder={folder} onUploadSuccess={url => update(section.id, { image_url: url })} />
        </div>
        {section.image_url && (
          <img src={section.image_url} alt="" className="mt-2 h-24 w-full object-cover rounded-lg opacity-70" />
        )}
      </div>
      <div className="space-y-1">
        <label className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">キャプション（任意）</label>
        <input
          type="text"
          value={section.caption || ''}
          onChange={e => update(section.id, { caption: e.target.value })}
          className="admin-input w-full text-sm"
          placeholder="画像の説明文"
        />
      </div>
    </>
  );
}

function ImageTextSectionFields({ section, update, folder }: { section: Section; update: (id: string, patch: Partial<Section>) => void; folder: string }) {
  return (
    <>
      <div className="grid grid-cols-2 gap-2 mb-1">
        {(['left', 'right'] as const).map(pos => (
          <button
            key={pos}
            type="button"
            onClick={() => update(section.id, { image_position: pos })}
            className={`py-1.5 rounded-lg text-[10px] font-bold border transition-all ${(section.image_position ?? 'left') === pos ? 'bg-[var(--color-brand-blue)] border-transparent text-white' : 'bg-white/5 border-white/10 text-gray-500'}`}
          >
            画像 {pos === 'left' ? '左' : '右'}
          </button>
        ))}
      </div>
      <div className="space-y-1">
        <label className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">画像URL</label>
        <div className="space-y-1.5">
          <input
            type="text"
            value={section.image_url || ''}
            onChange={e => update(section.id, { image_url: e.target.value })}
            className="admin-input w-full text-sm"
            placeholder="https://..."
          />
          <CloudinaryUpload folder={folder} onUploadSuccess={url => update(section.id, { image_url: url })} />
        </div>
        {section.image_url && (
          <img src={section.image_url} alt="" className="mt-2 h-20 w-full object-cover rounded-lg opacity-70" />
        )}
      </div>
      <div className="space-y-1">
        <label className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">見出し（任意）</label>
        <input
          type="text"
          value={section.heading || ''}
          onChange={e => update(section.id, { heading: e.target.value })}
          className="admin-input w-full text-sm"
          placeholder="見出し"
        />
      </div>
      <div className="space-y-1">
        <label className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">テキスト</label>
        <textarea
          value={section.content || ''}
          onChange={e => update(section.id, { content: e.target.value })}
          className="admin-input w-full h-24 resize-none py-3 text-sm"
          placeholder="テキストを入力..."
        />
      </div>
    </>
  );
}

function CalloutSectionFields({ section, update }: { section: Section; update: (id: string, patch: Partial<Section>) => void }) {
  return (
    <>
      <div className="grid grid-cols-3 gap-2 mb-1">
        {([
          { value: 'info', label: '情報', color: 'bg-blue-500/20 border-blue-500/50 text-blue-300' },
          { value: 'highlight', label: '注目', color: 'bg-yellow-500/20 border-yellow-500/50 text-yellow-300' },
          { value: 'warning', label: '注意', color: 'bg-red-500/20 border-red-500/50 text-red-300' },
        ] as const).map(s => (
          <button
            key={s.value}
            type="button"
            onClick={() => update(section.id, { style: s.value })}
            className={`py-1.5 rounded-lg text-[10px] font-bold border transition-all ${(section.style ?? 'info') === s.value ? s.color : 'bg-white/5 border-white/10 text-gray-500'}`}
          >
            {s.label}
          </button>
        ))}
      </div>
      <div className="space-y-1">
        <label className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">見出し</label>
        <input
          type="text"
          value={section.heading || ''}
          onChange={e => update(section.id, { heading: e.target.value })}
          className="admin-input w-full text-sm"
          placeholder="例: 優勝賞品について"
        />
      </div>
      <div className="space-y-1">
        <label className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">内容</label>
        <textarea
          value={section.content || ''}
          onChange={e => update(section.id, { content: e.target.value })}
          className="admin-input w-full h-20 resize-none py-3 text-sm"
          placeholder="重要な情報を入力..."
        />
      </div>
    </>
  );
}
