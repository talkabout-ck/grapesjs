// src/dom_components/view/ComponentVideoView.ts

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
    // 如果不需要特定事件，可以为空
    return {};
  }

  initialize() {
    // @ts-ignore
    ComponentView.prototype.initialize.apply(this, arguments);
    const { model } = this;

    // 👇 修改：移除了 YouTube/Vimeo 特有属性 'color', 'rel', 'modestbranding'
    const props = [
      'loop',
      'autoplay',
      'controls',
      'poster',
      'blAutoplay',
      'blMute',
      'blLoop',
      'blDanmaku',
      'blQuality',
    ]; // 添加 Bilibili 特有属性
    const events = props.map(p => `change:${p}`).join(' ');

    this.listenTo(model, 'change:provider', this.updateProvider);
    this.listenTo(model, 'change:src', this.updateSrc);
    // 👇 修改：移除了对 model.getYoutubeSrc 等方法的监听，依赖 change:src 和 change:videoId
    this.listenTo(model, events, this.updateVideo);
    // 如果 Bilibili 参数变化需要重新生成 src，可能还需要监听 videoId
    this.listenTo(model, 'change:videoId', this.updateVideo); // 这会间接触发 updateSrc
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

    const prov = model.get('provider');
    let src = model.get('src'); // 默认使用模型的 src

    // 👇 修改：添加 Bilibili 逻辑，移除 YouTube/Vimeo 逻辑
    switch (prov) {
      case 'bl': // Bilibili
        src = model.getBilibiliSrc(); // 调用模型的 Bilibili URL 生成方法
        break;
      // case 'yt': // YouTube (已移除)
      //   src = model.getYoutubeSrc();
      //   break;
      // case 'ytnc': // YouTube No Cookie (已移除)
      //   src = model.getYoutubeNoCookieSrc();
      //   break;
      // case 'vi': // Vimeo (已移除)
      //   src = model.getVimeoSrc();
      //   break;
      default: // HTML5 Source ('so')
        // HTML5 video 的 src 通常直接来自 model.get('src')
        // 但 updateSrc 本身是监听 change:src 触发的，所以这里可能不需要再设置
        // src = model.get('src'); // 可能是多余的
        // 如果 HTML5 模式下 src 有特殊逻辑，可以在这里处理
        // 对于 iframe，src 由 URL 参数控制；对于 video，src 由属性控制
        // 这里我们只处理 iframe 的 src
        if (videoEl.tagName.toLowerCase() === 'iframe') {
          // 如果 provider 变回 'so'，但 videoEl 仍然是 iframe，理论上不应该发生
          // 但如果发生，这里会用 model.get('src') 更新它
          // 但更常见的是 provider 变化会触发 updateProvider，重新渲染元素
          // 所以这个 default 分支对 iframe 的处理可能不是必需的
          // 但为了安全，可以保留，不过通常不会执行到这里
          // src = model.get('src');
        }
        // 如果 videoEl 是 video 标签，则其 src 由 getAttrToHTML 控制，或者在 renderSource 时设置
        return; // 不更新 video 标签的 src，因为它由 HTML 属性控制
    }

    // 如果 videoEl 是 iframe (Bilibili 情况)，则更新其 src
    if (videoEl instanceof HTMLIFrameElement) {
      videoEl.src = src;
    }
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

    // 👇 修改：添加 Bilibili 逻辑，移除 YouTube/Vimeo 逻辑
    switch (prov) {
      case 'bl': // Bilibili
        // Bilibili 的参数在 URL 中，更改参数需要重新生成 src
        // 调用 model.trigger('change:videoId') 会触发 updateSrc
        // 但更明确的方式是直接触发 change:src 或者一个自定义事件
        // 或者，直接在这里调用 updateSrc
        // 更好的方式是触发一个 change:src 事件，因为 updateSrc 监听的就是它
        // model.trigger('change:src'); // 可选，如果 updateSrc 足够智能
        // 最直接的方式是调用 updateSrc
        this.updateSrc(); // 重新生成并设置 src
        break;
      // case 'yt': // YouTube (已移除)
      // case 'ytnc': // YouTube No Cookie (已移除)
      // case 'vi': // Vimeo (已移除)
      //   model.trigger('change:videoId'); // 这行会触发 updateSrc
      //   break;
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

    // 👇 修改：添加 Bilibili case，移除 YouTube/Vimeo cases
    switch (prov) {
      case 'bl': // Bilibili
        videoEl = this.renderBilibili();
        break;
      // case 'yt': // YouTube (已移除)
      //   videoEl = this.renderYoutube();
      //   break;
      // case 'ytnc': // YouTube No Cookie (已移除)
      //   videoEl = this.renderYoutubeNoCookie();
      //   break;
      // case 'vi': // Vimeo (已移除)
      //   videoEl = this.renderVimeo();
      //   break;
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
    // 初始 src 可以从 model.get('src') 获取，但最终渲染由 getAttrToHTML 控制
    // 这里设置是为了在没有 poster 时可能显示第一帧
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
    // 初始 src 从模型的 Bilibili URL 生成方法获取
    el.src = this.model.getBilibiliSrc();
    el.frameBorder = '0'; // 设置边框为 0
    el.setAttribute('allowfullscreen', 'true'); // 允许全屏
    this.initVideoEl(el); // 应用通用样式
    return el;
  }

  // 👇 移除 renderYoutube, renderYoutubeNoCookie, renderVimeo 方法

  /**
   * Initialize common properties for video/iframe elements
   * @param el The video or iframe element
   * @private
   */
  initVideoEl(el: HTMLElement) {
    // 添加 CSS 类名，可能用于禁用指针事件等
    el.className = this.ppfx + 'no-pointer';
    // 设置样式，使其填充父容器
    el.style.height = '100%';
    el.style.width = '100%';
  }

  /**
   * Render the component view
   * @returns This view instance
   */
  render() {
    // 调用父类的 render 方法
    ComponentView.prototype.render.apply(this);
    this.updateClasses(); // 更新容器的 CSS 类

    const prov = this.model.get('provider');
    // 根据 provider 渲染对应的视频元素并添加到容器
    this.el.appendChild(this.renderByProvider(prov));

    // 渲染完成后，更新视频参数（如 HTML5 的 loop, autoplay 等属性）
    this.updateVideo();

    return this; // 返回自身以支持链式调用
  }
}
