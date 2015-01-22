var NaviMenu = function(_ele,data){
    data = data || [];
    var own = this;
    var _div = document.createElement('div');
    $(_div).attr('id','content').css({'position':'absolute','z-index':'100'});
    own.content =  document.createElement('ul');
    $(own.content).attr('id','nav');
    $(_div).append(own.content);
    own.root = _div;
    var _par = document.body;
    if(null != _ele) {
        own.init(_par,_ele);
    }
    own.navis = []; //二级标题集合
    if(null != data && data.length>0){
        own.reflushData(data);
    }
    return {
        getRoot:function(){
            return _div;
        },
        renderTo:function(_ele){
            if(null != _ele) {
                own.init(_par,_ele);
            }
        },
        reflushData:function(){
            if(1 == arguments.length){//刷新全部数据
                var data = arguments[0];
                if(null != data && data.length>0){
                    own.reflushData(data);
                }
            }else{//根据标题刷新二级导航数据
                var name = arguments[0];
                var _obj = own.navis[name];
                var data = arguments[1];
                if(null != _obj && null != data && data.length>0){
                    _obj.reflushData(data);
                }
            }
        }
    };
}

NaviMenu.prototype = {
    init:function(_par,_ele){//初始化 只能执行一次
        var own = this;
//            if(own.isInit){
//                return;
//            }
        var _div = own.root;
        $(_par).append(_div);
        $(_par).ready(function(){
            own.fixPosition(_div, _ele, _par);
        });
        $(window).resize(function () {//页面尺寸发生变化时 重新调整位置
            own.fixPosition(_div, _ele, _par);
        });
//        own.isInit = true;
    },
    reflushData:function(data){
        var own = this;
        var _par = own.content;
        $(_par).empty();
        for(var k in data){
            $(_par).append(own.createMenuNaviLi(data[k]));
        }
    },
    //修正位置
    //_child:待修正元素 _par:显示位置(显示效果上的父元素) root:真实追加位置 父元素
    fixPosition:function(_child,_par,root){
        $(_child).css({
            top: ($(_par).offset().top - $(root).offset().top) + "px",
            left: ($(_par).offset().left - $(root).offset().left) + "px"
        });
    },
    //创建导航中的每一个标题
    createMenuNaviLi:function(data){
        var own = this;
        var _li =  document.createElement('li');
        var _a0 =  document.createElement('div');//中文标题
        $(_a0).addClass('menu-title').html(data.name);
        var _a =  document.createElement('a');
        if(null != data.href){
            $(_a).attr('href',data.href).attr('target',data.target);
        }
        $(_a).append(_a0);
        $(_li).append(_a);

        $(_li).addClass('inline').hover(function(){
            $(_a0).addClass('current');
        },function(){
            $(_a0).removeClass('current');
        });

        /*屏蔽英文标题
         var _a1 =  document.createElement('div');//英文标题 带背景
         $(_a1).addClass('current menu-title').html(data.ename).hide();

         $(_li).append(_a0).append(_a1);

         $(_li).hover(function(){//控制文字显示
         $(_a1).show();
         $(_a0).hide();
         },function(){
         $(_a0).show();
         $(_a1).hide();
         });
         */
        var _d = data.data;
        if(null != _d){//包含二级菜单
            var _n = parseInt(data.columns);
            if(isNaN(_n)){
                _n = 1; //默认按照一列展示
            }
            var _obj = own.createNaviUl(_d,_n);
            var _ul = _obj.getRoot();
            var flag = false;

            $(_li).append(_ul);
            own.navis[data.name] = _obj;
            $(_li).hover(function(){//控制二级菜单显示
                if($(_ul).is(":animated")){
                    return;
                }
                $(_ul).slideDown();
            },function(){
                if(flag==false){
                    $(_ul).hide();
                    flag=true;
                    return ;
                }
                if($(_ul).is(":animated")){
                    $(_ul).stop();
                }
                $(_ul).slideUp(100);//.fadeOut();
            });
        }
        return _li;
    },
    //创建导航二级标题
    createNaviUl:function(data,columns){
        var _ul = document.createElement('ul');
        var _num = (null == columns ? 1 : columns);
        var reflush = function(data){
            if(null != data){
                $(_ul).empty();
                for(var k in data){
                    var d = data[k];
                    var _li =  document.createElement('li');
                    var _a =  document.createElement('a');
                    $(_a).addClass('wrap').attr('target',d.target).attr('href',d.href).html(d.name);
                    $(_li).append(_a).addClass('inline').css({'float':'left'});
                    $(_ul).append(_li);
                }
            }
            //var len = data.length > 12?12:data.length;
            //$(_ul).css({'background-position-y':-(360-len*30)+'px'});
        };
        $(_ul).addClass('child').css({'width':110*columns+'px'});
        reflush(data);
        return {
            getRoot:function(){
                return _ul;
            },
            reflushData:function(data){
                reflush(data);
            }
        };
    }
};
