//http://www.w3school.com.cn/jsref/dom_obj_location.asp
//https://developer.mozilla.org/en-US/docs/Web/API/Location
//https://developer.mozilla.org/en-US/docs/Web/API/URLUtils
//https://developer.mozilla.org/en-US/docs/Web/API/URL
//https://url.spec.whatwg.org/
//https://tools.ietf.org/html/rfc2616#section-3.2.2
//https://tools.ietf.org/html/rfc6454#section-4

//https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a
//https://developer.mozilla.org/en-US/docs/Web/API/HTMLAnchorElement

/****
 * 解析URl
 * @param url
 * @returns {{
 *      hash: string,
 *      host: string,
 *      hostname: string,
 *      href: string,
 *      pathname: string,
 *      port: string,
 *      protocol: string,
 *      search: string,
 *      username: string,
 *      password: string,
 *      origin: string,
 *      searchParams: []
 *      }}
 */
function parseURL(url) {
    var hasOwnProp = Object.prototype.hasOwnProperty;
    var setVal = function (obj1, obj2) {
        if (!obj2) {
            return obj1;
        }
        for (var key in obj1) {
             if(hasOwnProp.call(obj1,key) && "undefined" != typeof obj2[key]){
                  obj1[key] = obj2[key];
             }
        }
        return obj1;
    }

    var res = {
        hash: "", //从井号 (#) 开始的 URL（锚）。
        host: "",//主机名和 URL 的端口号。
        hostname: "",// URL 的主机名。
        href: "",//完整的 URL
        pathname: "",//URL 的路径部分
        port: "",//URL 的端口号
        protocol: "",// URL 的协议
        search: "",//从问号 (?) 开始的 URL（查询部分）
        username: "",
        password: "",
        origin: "",
        searchParams: null
    }

    if ("function" == typeof URL) { //浏览器支持URL方法
        res = setVal(res, new URL(url));
        //与URL 一样底层都是使用URLUtils
        //IE7等低版本 通过HTMLAnchorElement 来获取 会有安全性问题
    } else if (document.createElement) {//通过创建HTMLAnchorElement 比如a链接来实现
        var a = document.createElement('a');
        a.href = url;
        res = setVal(res, a);
    } else { //非浏览器环境

        //通过正则表达式来解析
        var regex = /^((\w+:)\/\/)?((\w+):?(\w+)?@)?([^\/\?:]+):?(\d+)?(\/?[^\?#]+)?(\??[^#]+)?(#?\w*)/;
        //var regex = /^((\w+):\/\/)?((\w+):?(\w+)?@)?([^\/\?:]+):?(\d+)?(\/?[^\?#]+)?\??([^#]+)?#?(\w*)/;
        var result = regex.exec(url);

        var fileds = {
            'username': 4,
            'password': 5,
            'port': 7,
            'protocol': 2,
            'hostname': 6,
            'pathname': 8,
            'href': 0,
            'search': 9,
            'hash': 10
        };
        for (var k in fileds) {
            res[k] = result[fileds[k]] || res[k];
        }
        //补全属性
        res.host = res.hostname;
        if (res["port"]) {
            res.host += ":" + res["port"]
        }
        res.origin = res.protocol + "//" + res.host;
    }
    //补全Params
    if (null == res.searchParams) {
        var params = [];
        var result = res.search.match(new RegExp("[\?\&][^\?\&]+=[^\?\&]+", "g"));
        if (result != null) {
            for (var i = 0; i < result.length; i++) {
                var ele = result[i];
                var inx = ele.indexOf("=");
                params[ele.substring(1, inx)] = ele.substring(inx + 1);
            }
        }
        res.searchParams = params;
    }

    return res;
}