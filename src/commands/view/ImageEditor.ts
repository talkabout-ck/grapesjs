import { CommandObject } from './CommandAbstract';

const ImageEditorCommand: CommandObject = {
  run(editor, sender) {
    const selected = editor.getSelected();
    if (!selected || selected.get('type') !== 'image') {
      return;
    }

    // 标记按钮激活（可选）
    if (sender?.set) {
      sender.set('active', true);
    }

    // 👇 在这里写你的 Weaver 图片编辑逻辑
    const currentSrc = selected.get('src');
    const newSrc = prompt('请输入新的图片 URL', currentSrc);
    if (newSrc !== null) {
      selected.set('src', newSrc);
    }
  },
};

export default ImageEditorCommand;
