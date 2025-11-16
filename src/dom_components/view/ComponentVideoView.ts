import ComponentVideo from '../model/ComponentVideo';
import ComponentImageView from './ComponentImageView';
import ComponentView from './ComponentView';

export default class ComponentVideoView extends ComponentImageView {
  videoEl?: HTMLVideoElement | HTMLIFrameElement;
  model!: ComponentVideo;

  tagName() {
    // 保持容器为 div，内部再渲染 video 或 iframe
    return 'div';
  }

  // @ts-ignore
  events() {
    return {};
  }

  initialize() {
    // @ts-ignore
    ComponentView.prototype.initialize.apply(this, arguments);
    const { model } = this;

    const props = ['loop', 'autoplay', 'controls', 'poster', 'blDanmaku'];
    const events = props.map(p => `change:${p}`).join(' ');

    this.listenTo(model, 'change:provider', this.updateProvider);
    this.listenTo(model, 'change:src', this.updateSrc);
    this.listenTo(model, events, this.updateVideo);
  }

  /**
   * Rerender on update of the provider
   * @private
   */
  updateProvider() {
    const prov = this.model.get('provider');
    this.el.innerHTML = ''; // 清空容器
    this.el.appendChild(this.renderByProvider(prov)); // 重新渲染对应 provider 的元素
  }

  /**
   * Update the source of the video based on provider
   * @private
   */
  updateSrc() {
    const { model, videoEl } = this;
    if (!videoEl) return; // 如果 videoEl 不存在，则无法更新

    let src = model.get('src');

    videoEl.src = src;
  }

  /**
   * Update video parameters
   * For HTML5 video, updates attributes directly on the element.
   * For iframe providers (Bilibili), triggers a src update.
   * @private
   */
  updateVideo() {
    const { model, videoEl } = this;
    const prov = model.get('provider');

    switch (prov) {
      case 'bl': // Bilibili
        model.trigger('change:videoId');
        break;
      default: {
        // HTML5 Source ('so')
        // 对于 HTML5 video 标签，直接更新 DOM 属性
        if (videoEl && videoEl.tagName.toLowerCase() === 'video') {
          const el = videoEl as HTMLVideoElement;
          el.loop = !!model.get('loop');
          el.autoplay = !!model.get('autoplay');
          el.controls = !!model.get('controls');
          const poster = model.get('poster');
          if (poster !== undefined) el.poster = poster; // 只有当 poster 有值时才设置
        }
      }
    }
  }

  /**
   * Render the video element based on the provider
   * @param prov The provider ('so', 'bl')
   * @returns The rendered HTML element (video or iframe)
   * @private
   */
  renderByProvider(prov: string) {
    let videoEl;

    switch (prov) {
      case 'bl': // Bilibili
        videoEl = this.renderBilibili();
        break;
      default: // HTML5 Source ('so')
        videoEl = this.renderSource();
    }

    this.videoEl = videoEl; // 保存对当前渲染元素的引用
    return videoEl;
  }

  /**
   * Render HTML5 video element
   * @returns The video element
   * @private
   */
  renderSource() {
    const el = document.createElement('video');
    el.src = this.model.get('src');
    this.initVideoEl(el);
    return el;
  }

  /**
   * Render Bilibili iframe element
   * @returns The iframe element
   * @private
   */
  renderBilibili() {
    const el = document.createElement('iframe');
    el.src = this.model.get('src');
    this.initVideoEl(el); // 应用通用样式
    return el;
  }

  /**
   * Initialize common properties for video/iframe elements
   * @param el The video or iframe element
   * @private
   */
  initVideoEl(el: HTMLElement) {
    el.className = this.ppfx + 'no-pointer';
    el.style.height = '100%';
    el.style.width = '100%';
  }

  /**
   * Render the component view
   * @returns This view instance
   */
  render() {
    ComponentView.prototype.render.apply(this);
    this.updateClasses(); // 更新容器的 CSS 类
    const prov = this.model.get('provider');
    this.el.appendChild(this.renderByProvider(prov));
    this.updateVideo();

    return this; // 返回自身以支持链式调用
  }
}
