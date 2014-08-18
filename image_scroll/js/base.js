var Base = function (){
	var own = this;
	own.__base_inline_style_mode__ = 0;
	var herf = new own.Href();
	
	own.inlineDisplayClass();//调用该方法为了解决谷歌浏览器兼容性问题 该未加载被使用
    return{
		 clazz:function() {
			 own.clazz(arguments[0],arguments[1],arguments[2]);
		 },
		 cfgDefault:function(src, def){
			 return own.cfgDefault(src, def);
		 },
		 addCss:function(path){
			document.write("<link type='text/css' rel='stylesheet' href='"+path+"' />");
		 },
		 addScript:function(path){
			document.write("<script type='text/javascript' src='"+path+"' ></script>");
		 },
		 loadScript:function(path){
			own.loadScript(path);
		 },
		 loadCss:function(path){
			own.loadCss(path);
		 },
		 packages:function(path){
			own.__ns(path, false);
		 },
		 string2Var:function(name){
			try {
				var o = eval(name);
				if(typeof o == 'undefined')
					return null;
				return o;
			} catch (e) {
				return null;
			}
		},
	    href:function(){
			return herf;
		},
		inlineDisplayClass:function() {
			return own.inlineDisplayClass();
		}
	}
}

Base.prototype = {
    __ns:function(path, flag) {
        var arr = path.split(".");      var length = arr.length;
        if(flag==true) length--;
        if(length <= 0 ) return;

        var i=1;
        var ns = arr[0];
        do {
            eval("if(typeof(" + ns + ") == 'undefined') " + ns + " = new Object();");
            ns += "."+arr[i++];
        }while(length>=i);
    },
    clazz:function() {
        var own = this;
        if(arguments.length < 2 || arguments.length >3)
            return;
		
        own.__ns(arguments[0],true);
        var inx = arguments[0].lastIndexOf('.');
        if(inx >= 0) {
            var pack = eval(arguments[0].substring(0,inx));
            pack[arguments[0].substring(inx+1)] = arguments[1];
        } else {
            window[arguments[0]] = arguments[1];
        }

        if(typeof arguments[2] == 'object') 
            eval(arguments[0]+".prototype = arguments[2]");
    },
    cfgDefault:function(src, def){
        if(typeof src == 'undefined')
            return def;

        if(def == null) return src;
        if (typeof def != 'object')
            return src;

            if (def instanceof Array) {  
                if (!(src instanceof Array)) 
                return def;
            } else {
            if(typeof src != 'object' || src instanceof Array)
                return def;
        }

        for (var i in def)
            src[i] = arguments.callee(src[i], def[i]);
        
        return src;
    },
    loadScript:function(path){  
        var x = document.createElement('script');
        x.src=path;
        x.type = 'text/javascript';
        var head = document.head || document.getElementsByTagName("head")[0];//document.head为Html5新出的，此种写法兼容新旧浏览器
        head.appendChild(x);
    },
    loadCss:function(path){
        var x = document.createElement('link');
        x.href=path;
        x.rel = 'stylesheet';
        x.type="text/css";
        var head = document.head || document.getElementsByTagName("head")[0];//document.head为Html5新出的，此种写法兼容新旧浏览器
        head.appendChild(x);
    },
	inlineDisplayClass:function() {
		var own = this;
		if(own.__base_inline_style_mode__ & 1 > 0) 
			return 'stc-base-display-inline';

		$('head').append('<style type="text/css">.stc-base-display-inline {zoom:1;display:inline-block;*display:inline;vertical-align:top;}</style>');

		own.__base_inline_style_mode__ |= 1;
		return 'stc-base-display-inline';
	},
    Href:function() {
        var args = [];

        var result = window.location.search.match(new RegExp("[\?\&][^\?\&]+=[^\?\&]+","g"));
        if(result != null){
                for(var i = 0; i < result.length; i++){
                var ele = result[i];
                var inx = ele.indexOf("=");
                args[ele.substring(1, inx)] = ele.substring(inx+1);
                }
        }
        return {
            getParameter:function(key){
                var rt = args[key];
                if(rt == undefined)
                    return null;
                return rt;
            }, 
            getAllParameter:function() {
                return args;
            }
        }
    }
}

var stc = new Base();

/*
stc.LocalStorage = function() {
return{
    get:function(name){return []},
    set:function(name, value){},
    add:function(name, value){},
    del:function(name, value){},
    clean:function(name){}
}};
stc.localStorage = new stc.LocalStorage();
*/

//put、post请求时,body体中的json被转换成键值对，而不是json对象，导致后台接收报错
//需要调用JSON.stringify方法将JSON对象转化下
//JSON.stringify在某些浏览器中不能找到JSON这个方法
//找不到时，将此对象重写
if(typeof JSON == 'undefined') {
    JSON = function (){
        var m = { '\b': '\\b', '\t': '\\t', '\n': '\\n', '\f': '\\f', '\r': '\\r', '"' : '\\"', '\\': '\\\\' },
        s = {
            'boolean': function (x) { return String(x); },
            number: function (x) { return isFinite(x) ? String(x) : 'null'; },
            string: function (x) { if (/["\\\x00-\x1f]/.test(x)) {
                x = x.replace(/([\x00-\x1f\\"])/g, function(a, b) {
                        var c = m[b];
                        if (c) { return c; }

                        c = b.charCodeAt();
                        return '\\u00' + Math.floor(c / 16).toString(16) + (c % 16).toString(16);
                    });
                }
                return '"' + x + '"';
            },
            object: function (x) {
                if (x) {
                    var a = [], b, f, i, l, v;
                    if (x instanceof Array) {
                        a[0] = '[';
                        l = x.length;
                        for (i = 0; i < l; i += 1) {
                            v = x[i];
                            f = s[typeof v];
                            if (f) {
                                v = f(v);
                                if (typeof v == 'string') {
                                    if (b) { a[a.length] = ','; }
                                    a[a.length] = v;
                                    b = true;
                                }
                            }
                        }
                        a[a.length] = ']';
                    } else if (x instanceof Object) {
                        a[0] = '{';
                        for (i in x) {
                            v = x[i];
                            f = s[typeof v];
                            if (f) {
                                v = f(v);
                                if (typeof v == 'string') {
                                    if (b) { a[a.length] = ','; }
                                    a.push(s.string(i), ':', v);
                                    b = true;
                            }
                        }
                    }

                    a[a.length] = '}';
                } else {
                    return;
                }
                return a.join('');
            }
            return 'null';
        }
        };
    return {
        stringify: function (v) {
            var f = s[typeof v];
            if (f) {
                v = f(v);
                if (typeof v == 'string') {
                    return v;
                }
            }
            return null;
        },
        parse: function (text) {
            try {
                return !(/[^,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]/.test(text.replace(/"(\\.|[^"\\])*"/g, ''))) && eval('(' + text + ')');
            } catch (e) {
                return false;
            }
        }
        };
    }();
}