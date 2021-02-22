/**
 * 自动排版扩展
 * @file
 * @author PeakXin<xinyflove@gmail.com>
 */

/**
 * 对当前编辑器的内容执行自动排版。
 * @command autoformat
 * @method execCommand
 * @param { String } cmd 命令字符串
 * @example
 * ```javascript
 * editor.execCommand( 'autoformat' );
 * ```
 */

UE.plugins['autoformat'] = function() {

    this.setOpt({
        'mergeEmptyline': true, //合并空行
        'removeEmptyline': true, //去掉空行，保留占位的空行
        'indent': true, // 行首缩进
        'indentValue': '2em', //行首缩进的大小
    });
    var me = this,
        opt = me.options,
        remainTag = {
            'li': 1
        },
        tags = {
            div: 1,
            p: 1,
            //trace:2183 这些也认为是行
            blockquote: 1,
            center: 1,
            h1: 1,
            h2: 1,
            h3: 1,
            h4: 1,
            h5: 1,
            h6: 1,
            span: 1
        },
        highlightCont;

    /**
     * 判断是空行
     * @param {Object} node
     * @param {Object} notEmpty
     */
    function isLine(node, notEmpty) {
        if (!node || node.nodeType == 3)
            return 0;
        if (domUtils.isBr(node))
            return 1;
        if (node && node.parentNode && tags[node.tagName.toLowerCase()]) {
            if (highlightCont && highlightCont.contains(node) ||
                node.getAttribute('pagebreak')
            ) {
                return 0;
            }

            return notEmpty ? !domUtils.isEmptyBlock(node) : domUtils.isEmptyBlock(node, new RegExp('[\\s' +
                domUtils.fillChar + ']', 'g'));
        }
    }

    /**
     * 移除没有属性的span标签
     * @param {Object} node
     */
    function removeNotAttributeSpan(node) {
        if (!node.style.cssText) {
            domUtils.removeAttributes(node, ['style']);
            if (node.tagName.toLowerCase() == 'span' && domUtils.hasNoAttributes(node)) {
                domUtils.remove(node, true);
            }
        }
    }

    function autotype(type, html) {

        var me = this;
        var cont = me.document.body;
        var nodes = domUtils.getElementsByTagName(cont, '*');

        for (var i = 0, ci; ci = nodes[i++];) {
            domUtils.setStyle(ci, 'margin-bottom', '10px'); //设置段落间距
            domUtils.setStyle(ci, 'font-family', '微软雅黑'); //设置字体样式
            domUtils.setStyle(ci, 'font-size', '18px'); //设置字体大小
            domUtils.setStyle(ci, 'line-height', '28px'); //设置行间距
            domUtils.setStyle(ci, 'letter-spacing', '1px'); //设置字间距
            removeNotAttributeSpan(ci);

            if (isLine(ci)) {
                //合并空行
                if (opt.mergeEmptyline) {
                    var next = ci.nextSibling,
                        tmpNode, isBr = domUtils.isBr(ci);
                    while (isLine(next)) {
                        tmpNode = next;
                        next = tmpNode.nextSibling;
                        if (isBr && (!next || next && !domUtils.isBr(next))) {
                            break;
                        }
                        domUtils.remove(tmpNode);
                    }

                }
                //去掉空行，保留占位的空行
                if (opt.removeEmptyline && domUtils.inDoc(ci, cont) && !remainTag[ci.parentNode.tagName.toLowerCase()]) {
                    if (domUtils.isBr(ci)) {
                        next = ci.nextSibling;
                        if (next && !domUtils.isBr(next)) {
                            continue;
                        }
                    }
                    domUtils.remove(ci);
                    continue;
                }
            }

            if (isLine(ci, true) && ci.tagName != 'SPAN' && !remainTag[ci.parentNode.tagName.toLowerCase()]) {
                if (opt.indent) {
                    ci.style.textIndent = opt.indentValue;
                }
            }
        }
    }

    me.commands['autoformat'] = {
        execCommand: function() {
            autotype.call(me);
            //ue.execCommand('selectall');
            //ue.execCommand('fontsize', '18px'); //设置字体大小
            //ue.execCommand('fontfamily', '微软雅黑'); //设置字体样式
            //ue.execCommand('lineheight', '1'); //设置行间距
            //ue.execCommand('letterspacing', '1'); //设置字间距
        }
    };
};
