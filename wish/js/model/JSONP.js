(function(exportsStr){
    exportsStr =  exportsStr || 'window';

    var DIC = '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    function getRandomStr(length){//产生随机函数名
        length = length || 3;
        var len = DIC.length;
        var ret = "";
        while(length >= 0){
            ret += DIC[Math.floor(Math.random() * len)];
            length --;
        }
        return ret;
    }

    //格式化参数
    function formatParams(data) {
        var arr = [];
        for (var name in data) {
            if(data[name]){
                arr.push(encodeURIComponent(name) + '=' + encodeURIComponent(data[name]));
            }
        }
        return arr.join('&');
    }

    function removeScript(script,name,fail){
        if(script.timer) {
            clearTimeout(script.timer);
        }

        if(script.jsonp != "success"){
            fail && fail({ message: (script.jsonp || "获取数据失败") });
        }

        if (script.clearAttributes) {
            script.clearAttributes();
        } else {
            script.onload = script.onreadystatechange = script.onerror = null;
        }
        delete JSONP[name];
        script.parentNode.removeChild(script);
    }

    /**
     * 发送jsonp请求
     * @param options
     * options:{
     *      url:'',
     *      callback:'',
     *      data:{},
     *      time:15000,
     *      success:function(){},
     *      fail:function(){}
     * }
     * @constructor
     */
    var JSONP = function(options) {

        options = options || {};
        if (!options.url) {
            throw new Error("参数不合法");
        }
        var callback = options.callback || 'callback';
        var data = options.data || {};
        var time = parseInt(options.time) || 3000; //超时时长
        var name = 'CB_' + getRandomStr(6);//回掉函数名称
        var cbname = exportsStr + '.JSONP.' + name; //作为jsonp函数的属性
        data[callback] = cbname;
        var params = formatParams(data);

        var url = options.url;
        if (url.indexOf('?') === -1) {
            url += '?' + params;
        } else {
            url += '&' + params;
        }
        var script = document.createElement('script');
        //定义被脚本执行的回调函数
        JSONP[name] = function (resJson) {//
            try {
                script.jsonp = "success";
                options.success && options.success(resJson);
            } catch (e) {
                //
            }
        }

        //超时处理
        if (time) {
            script.timer = setTimeout(function () {
                script.jsonp = "timeout";
                removeScript(script,name,options.fail);
                //options.fail && options.fail({ message: "超时" });
            }, time);
        }

        //IE9 左右版本两个事件都支持 但removeScript中删除了script 所以只会触发一个 一般情况不建议这样写
        script.onreadystatechange = script.onload = function(){
            removeScript(script,name,options.fail);
        }

        //E6~8与opera11 不支持
        script.onerror = function(){
            script.jsonp = "error";
            removeScript(script,name,options.fail);
        }

        script.src = url;
        document.getElementsByTagName('head')[0].appendChild(script);
    }

    window[exportsStr].JSONP = JSONP;
})('YK');