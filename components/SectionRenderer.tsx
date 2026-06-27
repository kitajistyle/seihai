import { Section } from '@/types';

interface SectionRendererProps {
  sections: Section[];
}

export default function SectionRenderer({ sections }: SectionRendererProps) {
  if (!sections || sections.length === 0) return null;

  return (
    <div className="space-y-10">
      {sections.map(section => (
        <SectionBlock key={section.id} section={section} />
      ))}
    </div>
  );
}

function SectionBlock({ section }: { section: Section }) {
  switch (section.type) {
    case 'text':
      return <TextSection section={section} />;
    case 'image':
      return <ImageSection section={section} />;
    case 'image_text':
      return <ImageTextSection section={section} />;
    case 'callout':
      return <CalloutSection section={section} />;
    default:
      return null;
  }
}

function TextSection({ section }: { section: Section }) {
  return (
    <div>
      {section.heading && (
        <h3 className="text-xl font-black tracking-tight text-white mb-4 flex items-center gap-3">
          <span className="w-1 h-6 bg-[var(--color-brand-blue)] rounded-full shrink-0" />
          {section.heading}
        </h3>
      )}
      {section.content && (
        <div className="text-white leading-loose text-base whitespace-pre-wrap">
          {section.content}
        </div>
      )}
    </div>
  );
}

function ImageSection({ section }: { section: Section }) {
  if (!section.image_url) return null;
  return (
    <figure className="rounded-2xl overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={section.image_url}
        alt={section.caption || ''}
        className="w-full object-cover max-h-[500px]"
      />
      {section.caption && (
        <figcaption className="text-center text-xs text-white mt-2 px-4">
          {section.caption}
        </figcaption>
      )}
    </figure>
  );
}

function ImageTextSection({ section }: { section: Section }) {
  const isLeft = (section.image_position ?? 'left') === 'left';
  return (
    <div className={`flex flex-col ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 items-center`}>
      {section.image_url && (
        <div className="w-full md:w-2/5 shrink-0">
          <div className="rounded-2xl overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={section.image_url}
              alt={section.heading || ''}
              className="w-full object-cover aspect-[4/3]"
            />
          </div>
        </div>
      )}
      <div className="flex-1 space-y-3">
        {section.heading && (
          <h3 className="text-xl font-black tracking-tight text-white">
            {section.heading}
          </h3>
        )}
        {section.content && (
          <p className="text-white leading-loose whitespace-pre-wrap">
            {section.content}
          </p>
        )}
      </div>
    </div>
  );
}

const CALLOUT_STYLES = {
  info: {
    border: 'border-blue-500/30',
    bg: 'bg-blue-500/10',
    bar: 'bg-blue-500',
    heading: 'text-blue-300',
  },
  highlight: {
    border: 'border-yellow-500/30',
    bg: 'bg-yellow-500/10',
    bar: 'bg-yellow-500',
    heading: 'text-yellow-300',
  },
  warning: {
    border: 'border-red-500/30',
    bg: 'bg-red-500/10',
    bar: 'bg-red-400',
    heading: 'text-red-300',
  },
};

function CalloutSection({ section }: { section: Section }) {
  const style = CALLOUT_STYLES[section.style ?? 'info'];
  return (
    <div className={`flex gap-4 rounded-2xl border p-6 ${style.border} ${style.bg}`}>
      <div className={`w-1 rounded-full shrink-0 ${style.bar}`} />
      <div className="space-y-2">
        {section.heading && (
          <p className={`font-black text-base ${style.heading}`}>{section.heading}</p>
        )}
        {section.content && (
          <p className="text-white leading-loose text-sm whitespace-pre-wrap">{section.content}</p>
        )}
      </div>
    </div>
  );
}
