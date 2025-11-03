import { BlockProperties } from './Block';

const blockPresets: BlockProperties[] = [
  {
    id: 'div',
    label: 'Div',
    category: 'Basic',
    content: {
      type: 'div',
      style: {
        display: 'flex',
        'flex-wrap': 'wrap',
        padding: '80px',
      },
    },
  },
  {
    id: 'img',
    label: 'Img',
    category: 'Basic',
    content: {
      type: 'image',
    },
  },
  {
    id: 'text',
    label: 'Text',
    category: 'Basic',
    content: {
      type: 'text',
      content: 'Edit me!',
      style: {
        'font-size': '16px',
        'line-height': '1.5',
        color: '#000000',
      },
    },
  },
  {
    id: 'video',
    label: 'Video',
    category: 'Basic',
    content: {
      type: 'video',
    },
  },
  {
    id: 'navbar',
    label: 'Navbar',
    category: 'Layout',
    content: {
      type: 'nav',
      style: {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        'z-index': '1000',
        'background-color': '#000000',
        padding: '80px 20px',
        display: 'flex',
        'flex-wrap': 'nowrap',
      },
    },
  },
  {
    id: 'gallery',
    label: 'Gallery',
    category: 'Layout',
    content: {
      type: 'div',
      style: {
        display: 'flex',
        'flex-wrap': 'wrap',
        padding: '20px',
        'justify-content': 'space-evenly',
      },
      components: [
        {
          type: 'div',
          style: {
            display: 'flex',
            padding: '80px',
            'flex-basis': '24%',
            'justify-content': 'center',
          },
          components: [{ type: 'image' }],
        },
        {
          type: 'div',
          style: {
            display: 'flex',
            padding: '80px',
            'flex-basis': '24%',
            'justify-content': 'center',
          },
          components: [{ type: 'image' }],
        },
        {
          type: 'div',
          style: {
            display: 'flex',
            padding: '80px',
            'flex-basis': '24%',
            'justify-content': 'center',
          },
          components: [{ type: 'image' }],
        },
      ],
    },
  },
  {
    id: 'corner-icon',
    label: 'Corner Icon',
    category: 'Layout',
    content: {
      type: 'div',
      tagName: 'div',
      style: {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        width: '40px',
        height: '40px',
        'background-color': '#333',
        'border-radius': '50%',
        display: 'flex',
        'align-items': 'center',
        'justify-content': 'center',
        'z-index': '9999',
        color: '#fff',
        'font-size': '18px',
        cursor: 'pointer',
      },
      content: '↑',
    },
  },
];

export default blockPresets;
