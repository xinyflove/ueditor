# UEditor扩展

> [UEditor README](./UEditor_README.md)

## 如何打包部署

1. `git clone` 仓库

2. `npm install` 安装依赖（如果没有安装 `grunt` , 请先在全局安装 `grunt`）

> tip: 全局安装 `grunt`命令 `npm install -g grunt-cli`

3. 执行命令 `grunt default`

## 扩展

### 字间距工具

1. 扩展文件`./_src/plugins/letterspacing.js`

文件`./_examples/editor_api.js`里面加入`letterspacing`plugins路径

```js
'plugins/lineheight.js',
'plugins/letterspacing.js',
'plugins/insertcode.js',
```

2. 语言包修改

**中文**

文件`./lang/zh-cn/zh-cn.js`在`labelMap`里面添加`'letterspacing':'字间距'`,

**英文**

文件`./lang/en/en.js`在`labelMap`里面添加`'letterspacing':'LineHeight'`,

3. 添加样式

文件`./themes/default/_css/buttonicon.css`里面加上图标，因为有下拉框而且是自定义图标，不能单纯的修改`.edui-default .edui-for-letterspacing .edui-icon`，中间要加上`.edui-button-body`

```css
/**
 * 字间距样式
 */
.edui-default .edui-for-letterspacing .edui-button-body .edui-icon {
    background: url(../images/letterspacing.png) center no-repeat;
    background-size: 100%;
}
```

4. ui跟编辑器的适配层

在`./_src/adapter/editorui.js`文件里面添加`editorui.letterspacing`方法

```javascript
editorui.letterspacing = function (editor) {
  var val = editor.options.letterspacing || [];
  if (!val.length)return;
  for (var i = 0, ci, items = []; ci = val[i++];) {
      items.push({
          //todo:写死了
          label:ci,
          value:ci,
          theme:editor.options.theme,
          onclick:function () {
              editor.execCommand("letterspacing", this.value);
          }
      })
  }
  var ui = new editorui.MenuButton({
      editor:editor,
      className:'edui-for-letterspacing',
      title:editor.options.labelMap['letterspacing'] || editor.getLang("labelMap.letterspacing") || '',
      items:items,
      onbuttonclick:function () {
          var value = editor.queryCommandValue('LetterSpacing') || this.value;
          editor.execCommand("LetterSpacing", value);
      }
  });
  editorui.buttons['letterspacing'] = ui;
  editor.addListener('selectionchange', function () {
      var state = editor.queryCommandState('LetterSpacing');
      if (state == -1) {
          ui.setDisabled(true);
      } else {
          ui.setDisabled(false);
          var value = editor.queryCommandValue('LetterSpacing');
          value && ui.setValue((value + '').replace(/cm/, ''));
          ui.setChecked(state)
      }
  });
  return ui;
};
```

5. 工具栏添加字间距按钮

文件`./ueditor.config.js`里面`toolbars`时增加`letterspacing`

### 自定义的自动排版工具

1. 扩展文件`./_src/plugins/autoformat.js`

文件`./_examples/editor_api.js`里面加入`autoformat`plugins路径

```js
'plugins/autoformat.js',
```

2. 语言包修改

**中文**

文件`./lang/zh-cn/zh-cn.js`在`labelMap`里面添加`'autoformat':'自动排版'`,

**英文**

文件`./lang/en/en.js`在`labelMap`里面添加`'autoformat':'AutoFormat'`,

3. 添加样式

文件`./themes/default/_css/buttonicon.css`里面加上图标，因为有下拉框而且是自定义图标，不能单纯的修改`.edui-default .edui-for-autoformat .edui-icon`，中间要加上`.edui-button-body`

```css
/**
 * 自动排班图标
 */
.edui-default .edui-for-autoformat .edui-icon {
    background: url(../images/autoformat.png) center no-repeat !important;
    background-size: 100%;
}
```

4. ui跟编辑器的适配层

在`./_src/adapter/editorui.js`文件里面`btnCmds`上添加按钮标识`autoformat`

```javascript
//为工具栏添加按钮，以下都是统一的按钮触发命令，所以写在一起
    var btnCmds = ['undo', 'redo', 'formatmatch',
        'bold', 'italic', 'underline', 'fontborder', 'touppercase', 'tolowercase',
        'strikethrough', 'subscript', 'superscript', 'source', 'indent', 'outdent',
        'blockquote', 'pasteplain', 'pagebreak',
        'selectall', 'print','horizontal', 'removeformat', 'time', 'date', 'unlink',
        'insertparagraphbeforetable', 'insertrow', 'insertcol', 'mergeright', 'mergedown', 'deleterow',
        'deletecol', 'splittorows', 'splittocols', 'splittocells', 'mergecells', 'deletetable', 'drafts', 'autoformat'];
```

5. 工具栏添加字间距按钮

文件`./ueditor.config.js`里面`toolbars`时增加`autoformat`
