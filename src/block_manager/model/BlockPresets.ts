import { BlockProperties } from './Block';

// 所有预设 block 的集合
const blockPresets: BlockProperties[] = [
  {
    id: 'header',
    label: '页头',
    content: '<header><h1>欢迎访问</h1></header>',
    category: 'Layout',
    media: `<svg viewBox="0 0 24 24" width="24" height="24">
      <rect x="2" y="4" width="20" height="6" rx="2" stroke="#666" fill="none"/>
    </svg>`,
  },
  {
    id: 'text-btn',
    label: '文本+按钮',
    content: { type: 'text' },
    activate: true,
    category: 'Content',
    media: `<svg viewBox="0 0 24 24" width="24" height="24">
      <text x="12" y="16" font-size="14" text-anchor="middle">T</text>
    </svg>`,
  },
  {
    id: 'image-block',
    label: '图片',
    content: { type: 'image' },
    category: 'Media',
    activate: true,
    media: `<svg viewBox="0 0 24 24" width="24" height="24">
      <path d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/>
      <circle cx="8.5" cy="8.5" r="1.5"/>
      <path d="M21 15l-5-5L5 21"/>
    </svg>`,
  },
];

export default blockPresets;
