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
        padding: '50px',
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
        margin: '0 0 16px 0',
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
        padding: '50px 20px',
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
];

export default blockPresets;
