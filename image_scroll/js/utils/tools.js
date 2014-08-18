clazz('stc.utils.tools',function(_cfg) {
	var own =this;
    return {
        /*深度复制对象*/
        cloneObj: function(obj1) {
            return own.cloneObj(obj1);
        },
        /** 获取传入字符串的字节长度 **/
        getByteLen: function(val) {
            return own.getByteLen(val);
        },
        /**特殊字符转义*/
        htmlEncode: function(text) {
            return own.htmlEncode(text);
        },
        /**特殊字符反转义*/
        htmlDecode: function(text) {
            return own.htmlDecode(text);
        },
        /**光标定位到文本框指定位置 */
        setSelection: function(editor, pos) {
            own.setSelection(editor, pos);
        },
        //按照不同的模式把数据转换为数组
        toArray: function(data, schema) {
            return own.toArray(data, schema);
        }
    }
},{
    /*深度复制对象*/
    cloneObj: function(obj1) {
        function F() {};
        F.prototype = obj1;
        var f = new F();
        for (var key in obj1) {
            if (typeof obj1[key] == "object") {
                f[key] = this.cloneObj(obj1[key])
            }
        }
        return f;
    },
    /**
	@description 获取传入字符串的字节长度 
	@param {String} val 需计算长度的字符串  (注意编码需为UTF-8)
	**/
    getByteLen: function(val) {
        val = val.replace(/(^\s*)|(\s*$)/g, "");
        var cArr = val.match(/[^\x00-\xff]/ig);
        var byteLen = val.length + (cArr == null ? 0 : cArr.length);
        return byteLen;
    },

    /**
	 * @description 特殊字符转义
	 * @param {String} text 需要被转义检查的字符串
	 * @return {String} 转义后的字符串
	 */
    htmlEncode: function(text) {
        if (typeof text != "string") text = text.toString();
        text = text.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        return text;
    },
    /**
	 * @description 特殊字符反转义
	 * @param {String} 需要被反转义检查的字符串
	 * @return {String} 反转义后的字符串
	 */
    htmlDecode: function(text) {
        if (typeof text != "string") text = text.toString();
        text = text.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">");
        return text;
    },
    /**
	 * @description 光标定位到文本框指定位置 
	 * @param {Object} editor文本所在的页面元素，如某文本框，dom对象
	 * @param　{num} pos要定位的位置
	 */
    setSelection: function(editor, pos) {
        try {
            if (editor.setSelectionRange) { //火狐浏览器兼容的写法
                editor.focus();
                editor.setSelectionRange(pos, pos);
            } else if (editor.createTextRange) {
                var textRange = editor.createTextRange();
                textRange.collapse(true);
                textRange.moveEnd("character", pos);
                textRange.moveStart("character", pos);
                textRange.select();
            }
        } catch(e) {}
    },
    //按照不同的模式把数据转换为数组
    toArray: function(data, schema) {
        var line = [];
        for (var i = 0; i < data.length; i++) {
            var ele = data[i];
            var rec = [];
            for (var j = 0; j < schema.length; j++) {
                var sc = schema[j];
                if (typeof sc == 'object') {
                    if ('function' == typeof sc.__analy_line) {
                        rec = sc.__analy_line(ele);
                    } else rec.push(arguments.callee(ele[sc.__child], sc.__data));
                } else rec.push(ele[sc]);
            }
            line.push(rec);
        }
        return line;
    }
});