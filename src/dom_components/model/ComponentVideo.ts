import { ObjectAny } from '../../common';
import { isDef, isEmptyObj, toLowerCase } from '../../utils/mixins';
import ComponentImage from './ComponentImage';

const type = 'video';
const bl = 'bl';
const defProvider = 'so';

const hasParam = (value: string) => value && value !== '0';

export default class ComponentVideo extends ComponentImage {
  get defaults() {
    return {
      // @ts-ignore
      ...super.defaults,
      src: '',
      type,
      tagName: type,
      videoId: '',
      void: false,
      provider: defProvider, // on change of provider, traits are switched
      blUrl: 'https://player.bilibili.com/player.html?bvid=',
      loop: false,
      poster: '',
      muted: 0,
      autoplay: false,
      controls: true,
      blDanmaku: false,
      sources: [],
      attributes: { allowfullscreen: 'allowfullscreen' },
    };
  }

  initialize(props: any, opts: any) {
    this.em = opts.em;
    if (this.get('src')) this.parseFromSrc();
    this.updatePropsFromAttr();
    this.updateTraits();
    this.on('change:provider', this.updateTraits);
    this.on('change:videoId change:provider', this.updateSrc);
    super.initialize(props, opts);
  }

  updatePropsFromAttr() {
    if (this.get('provider') === defProvider) {
      const { controls, autoplay, loop } = this.get('attributes')!;
      const toUp: ObjectAny = {};

      if (isDef(controls)) toUp.controls = !!controls;
      if (isDef(autoplay)) toUp.autoplay = !!autoplay;
      if (isDef(loop)) toUp.loop = !!loop;

      if (!isEmptyObj(toUp)) {
        this.set(toUp);
      }
    }
  }

  /**
   * Update traits by provider
   * @private
   */
  updateTraits() {
    const { em } = this;
    const prov = this.get('provider');
    let tagName = 'iframe';
    let traits;

    switch (prov) {
      case bl:
        traits = this.getBilibiliTraits();
        break;
      default:
        tagName = 'video';
        traits = this.getSourceTraits();
    }

    this.set({ tagName }, { silent: true }); // avoid break in view
    // @ts-ignore
    this.set({ traits });
    em.get('ready') && em.trigger('component:toggled');
  }

  /**
   * Set attributes by src string
   */
  parseFromSrc() {
    const prov = this.get('provider');
    const uri = this.parseUri(this.get('src'));
    const qr = uri.query;
    switch (prov) {
      case bl:
        let videoId = qr.bvid;
        if (videoId) {
          this.set('videoId', videoId);
        }
        hasParam(qr.danmaku) && this.set('blDanmaku', true);
        break;
      default:
    }
  }

  /**
   * Update src on change of video ID
   * @private
   */
  updateSrc() {
    const prov = this.get('provider');
    let src = '';

    switch (prov) {
      case bl:
        src = this.getBilibiliSrc();
        break;
    }

    this.set({ src });
  }

  /**
   * Returns url to Bilibili video
   * @return {string}
   * @private
   */
  getBilibiliSrc() {
    // 从 videoId 中提取 BV 号
    let videoId = this.get('videoId');
    if (videoId && videoId.includes('bilibili.com')) {
      const match = videoId.match(/BV[a-zA-Z0-9]+/);
      videoId = match ? match[0] : '';
    }

    if (!videoId) return this.get('blUrl'); // 如果没有 ID，返回基础 URL

    let url = this.get('blUrl') as string; // 'https://player.bilibili.com/player.html?bvid='
    url += videoId;

    // 添加参数
    const params = [];
    params.push(`danmaku=${this.get('blDanmaku') ? 1 : 0}`); // 弹幕

    if (params.length > 0) {
      url += '&' + params.join('&');
    }

    return url;
  }
  /**
   * Returns object of attributes for HTML
   * @return {Object}
   * @private
   */
  getAttrToHTML() {
    const attr = super.getAttrToHTML();
    const prov = this.get('provider');

    switch (prov) {
      case bl:
        break;
      default:
        attr.loop = !!this.get('loop');
        attr.autoplay = !!this.get('autoplay');
        attr.controls = !!this.get('controls');
    }

    return attr;
  }

  // Listen provider change and switch traits, in TraitView listen traits change

  /**
   * Return the provider trait
   * @return {Object}
   * @private
   */
  getProviderTrait() {
    return {
      type: 'select',
      label: 'Provider',
      name: 'provider',
      changeProp: true,
      options: [
        { value: 'so', name: 'HTML5 Source' },
        { value: bl, name: 'Bilibili' },
      ],
    };
  }

  /**
   * Return traits for the source provider
   * @return {Array<Object>}
   * @private
   */
  getSourceTraits() {
    return [
      this.getProviderTrait(),
      {
        label: 'Source',
        name: 'src',
        placeholder: 'eg. ./media/video.mp4',
        changeProp: true,
      },
      {
        label: 'Poster',
        name: 'poster',
        placeholder: 'eg. ./media/image.jpg',
      },
      this.getAutoplayTrait(),
      this.getLoopTrait(),
      this.getControlsTrait(),
    ];
  }

  /**
   * Return traits for the Bilibili provider
   * @return {Array<Object>}
   * @private
   */
  getBilibiliTraits() {
    return [
      this.getProviderTrait(),
      {
        label: '链接',
        name: 'videoId',
        placeholder: '输入Bilibili视频链接',
        changeProp: true,
      },
      {
        type: 'checkbox',
        label: '显示弹幕',
        name: 'blDanmaku',
        changeProp: true,
      },
    ];
  }

  /**
   * Return object trait
   * @return {Object}
   * @private
   */
  getAutoplayTrait() {
    return {
      type: 'checkbox',
      label: 'Autoplay',
      name: 'autoplay',
      changeProp: true,
    };
  }

  /**
   * Return object trait
   * @return {Object}
   * @private
   */
  getLoopTrait() {
    return {
      type: 'checkbox',
      label: 'Loop',
      name: 'loop',
      changeProp: true,
    };
  }

  /**
   * Return object trait
   * @return {Object}
   * @private
   */
  getControlsTrait() {
    return {
      type: 'checkbox',
      label: 'Controls',
      name: 'controls',
      changeProp: true,
    };
  }

  static isComponent(el: HTMLVideoElement) {
    const { tagName, src } = el;
    const isBlProv = /player\.bilibili\.com\/player\.html/.test(src);
    const isExtProv = isBlProv;
    if (toLowerCase(tagName) == type || (toLowerCase(tagName) == 'iframe' && isExtProv)) {
      const result: any = { type: 'video' };
      if (src) result.src = src;
      if (isExtProv) {
        if (isBlProv) result.provider = bl;
      }
      return result;
    }
  }
}
