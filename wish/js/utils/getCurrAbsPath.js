//参照2:http://www.cnblogs.com/rubylouvre/archive/2013/01/23/2872618.html 
//参照1:https://github.com/fsjohnhuang/getCurrAbsPath/blob/master/lib/getCurrAbsPath.js
//(http://www.cnblogs.com/fsjohnhuang/p/3903607.html)
(function(exports){

    exports.getCurrAbsPath = function(){
        //取得正在解析的script节点
        if(document.currentScript) { //firefox 4+
            return document.currentScript.src;
        }
        // 参考 https://github.com/samyk/jiagra/blob/master/jiagra.js
        var stack;
        try {
            a.b.c(); //强制报错,以便捕获e.stack
        } catch(e) {//safari的错误对象只有line,sourceId,sourceURL
            stack = e.fileName || e.sourceURL || e.stack || e.stacktrace;
            if(!stack && window.opera){
                //opera 9没有e.stack,但有e.Backtrace,但不能直接取得,需要对e对象转字符串进行抽取
                stack = (String(e).match(/of linked script \S+/g) || []).join(" ");
            }
        }

        if(stack) {
            /**e.stack最后一行在所有支持的浏览器大致如下:
             *chrome23:
             * at http://113.93.50.63/data.js:4:1
             *firefox17:
             *@http://113.93.50.63/query.js:4
             *opera12:
             *@http://113.93.50.63/data.js:4
             *IE10:
             *  at Global code (http://113.93.50.63/data.js:4:1)
             */
            stack = stack.split( /[@ ]/g).pop();//取得最后一行,最后一个空格或@之后的部分
            stack = stack[0] == "(" ? stack.slice(1,-1) : stack;
            return stack.replace(/(:\d+)?:\d+$/i, "");//去掉行号与或许存在的出错字符起始位置
        }
        var isLtIE8 = ('' + document.querySelector).indexOf('[native code]') === -1;

        // IE5-9
        for(var scripts = document.scripts,
                i = scripts.length - 1,
                script; script = scripts[i--];){
            if (script.readyState === 'interactive'){
                // if less than ie 8, must get abs path by getAttribute(src, 4)
                return isLtIE8 ? script.getAttribute('src', 4) : script.src;
            }
        }
    }
}(window));
