import { PanelProperties } from '../model/Panel';

const swv = 'sw-visibility';
const expt = 'export-template';
const osm = 'open-sm';
const otm = 'open-tm';
const ola = 'open-layers';
const obl = 'open-blocks';
const ful = 'fullscreen';
const prv = 'preview';

interface ButtonProps {
  id?: string;
  active?: boolean;
  togglable?: boolean;
  className?: string;
  command?: string | (() => any);
  context?: string;
  attributes?: Record<string, any>;
}

interface PanelProps extends Omit<PanelProperties, 'id' | 'buttons'> {
  id?: string;
  buttons?: ButtonProps[];
}

export interface PanelsConfig {
  stylePrefix?: string;

  /**
   * Default panels.
   */
  defaults?: PanelProps[];
}

const config: PanelsConfig = {
  stylePrefix: 'pn-',
  defaults: [
    {
      id: 'commands',
      buttons: [{}],
    },
    {
      id: 'options',
      buttons: [
        {
          active: true,
          id: swv,
          className: 'fa fa-square-o',
          command: 'core:component-outline',
          context: swv,
          attributes: { title: 'View components' },
        },
        {
          id: prv,
          className: 'fa fa-eye',
          command: prv,
          context: prv,
          attributes: { title: 'Preview' },
        },
        {
          id: ful,
          className: 'fa fa-arrows-alt',
          command: ful,
          context: ful,
          attributes: { title: 'Fullscreen' },
        },
      ],
    },
    {
      id: 'views',
      buttons: [
        {
          id: osm,
          className: 'fa fa-paint-brush',
          command: osm,
          active: true,
          togglable: false,
          attributes: { title: 'Open Style Manager' },
        },
        {
          id: obl,
          className: 'fa fa-th-large',
          command: obl,
          togglable: false,
          attributes: { title: 'Open Blocks' },
        },
      ],
    },
  ],
};

export default config;
