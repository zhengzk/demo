/*
说明:该类实现了一个滚动图片组件
依赖js:jquery-1.7.2.min.js  base.js
具有方法:
	getRoot():获取组件根节点 用于添加至页面等处理
    reflushData(data):刷新组件内图片资源
	参数:data: 数组 格式要讲求:[{url:'图片资源路径'}]
使用方法:
	1、构造对象:
	var obj = new stc.component.ImgScroll({
	    data: [],
        cb_click: null,
		height:600 ,
        width:800,
        index:3,
		times:{slide:1000,interval:6000},//时间间隔 slide:动画移动时间  interval:定时器间隔
        style: stc.component.ImgScroll.style
	});
	参数说明:
	data: 数组 格式要讲求:[{url:'图片资源路径'}],构造时可不传 后续调用reflushData方法设置或更新
	cb_click:方法 点击图片执行的回掉函数 会将图片在data中的下标作为参数注入 
	height:高度 单位:px  默认值:600
	width:宽度 单位:px 默认值:800
	inx:默认展示图片的下标 默认值:0
	opacity:{min:0.3,max:1.0} :淡入淡出透明度设置
	times:{ 时间间隔
		slide:1000,动画移动时间 默认值:1000
		interval:6000 定时器间隔  默认值:6000
	},
	 style:组件样式风格 如需更改样式需重新传入

	 2、调用getRoot()方法将组件添加至页面

	 *3、如构造时未传入图片 调用reflushData()方法传入图片参数

	 存在问题:1、未对图片做严格校验 目前仅支持两张及两张以上的滚动
*/
stc.clazz('stc.component.ImgScroll',function(_cfg) {
    this.cfg = stc.cfgDefault(_cfg, {
        data: [],
        cb_click: null,
		height:600 ,
        width:800,
        index:0,
		opacity:{min:0.3,max:1.0},//淡入淡出透明度设置
		times:{slide:1000,interval:6000},//时间间隔 slide:动画移动时间  interval:定时器间隔
        style: stc.component.ImgScroll.style
    });
	
    var own = this;
    own.style = own.cfg.style;

    own.root = document.createElement('div');
    $(own.root).css(own.style.root).css({
			'width':own.cfg.width+'px',
			'height':own.cfg.height+'px'
     });

	own.createContent();
	own.direction = 'right';//'left'
	
	var data = own.cfg.data;
	if(null != data){
		own.reflushData(data);
		own.interval_flag = true;//触发定时器标识
		own.start();
	}
    return {
        getRoot: function() {
            return own.root;
        },
        reflushData: function(data) {
			if(null != data){
				own.cfg.data = data;
				own.reflushData(data);
				own.interval_flag = true;//触发定时器标识
				own.start();
			}
        }
    }
},{
    reflushData: function(data) {//刷新数据
        var own = this;
        var _imgs = [];
        for (var k in data) {
            var _img = own.createImg(k,data[k]);
            _imgs.push(_img);
        }
        own.imgs = _imgs;
        own.init();
    },
    init: function() {//初始化
        var own = this;
        own.cur_inx = own.cfg.index;
        own.curr_img = own.getImg(own.cur_inx);
        $(own.img_layer).append(own.curr_img);
    },
	createContent:function(){
		var own = this;
		own.createBtn(own.root,function() {
			own.prev();
		 },function() {
			own.next();
		});
		own.img_layer = document.createElement('div');
		$(own.img_layer).css({'width':2*own.cfg.width+'px'});
		$(own.img_layer).hover(function() {
			own.interval_flag = false;
        },function() {
			own.interval_flag = true;
        });

		$(own.root).append(own.img_layer);
	},
    getImg: function(_inx) {//根据_inx 获取对应图片
        var own = this;
        var len = own.cfg.data.length;
        _inx = (_inx + len) % len;
        return own.imgs[_inx];
    },
	checkAnimated: function() { //若图片处于动画状态返回true
        var own = this;
        if ($(own.prev_img).is(":animated")) {
			return true;
        }
		if  ($(own.curr_img).is(":animated")) {
			return true;
		}
		return false;
    },
	/* //处理正在移动的动画 默认:直接停止 flag=true 立即完成 
	stopAnimated: function(flag) {
		var own = this;
		if ($(own.prev_img).is(":animated")) {
			if(flag == true){
				$(own.prev_img).stop(true, true);
			}else{
				$(own.prev_img).stop();
			}
        }

		if  ($(own.curr_img).is(":animated")) {
			if(flag == true){
				$(own.curr_img).stop(true, true);
			}else{
				$(own.curr_img).stop();
			}
		}
    },*/
    prev: function() { //上一张
        var own = this;
        if(own.checkAnimated()){//处于移动状态 不处理
			return;
		}
        own.cur_inx = own.cur_inx - 1;
		var time = own.cfg.times.slide;
        own.prev_img = own.getImg(own.cur_inx);
        var _w = $(own.curr_img).width();
		var _opacity = own.cfg.opacity;
		$(own.prev_img).css({opacity:_opacity.min}).hide();
		//$(own.prev_img).hide();
		$(own.img_layer).prepend(own.prev_img);
		//$(own.curr_img).animate({opacity:_opacity.min},time);
		$(own.curr_img).fadeOut(time/2,function(){
			$(own.prev_img).fadeIn(time/2,function(){
				$(own.curr_img).remove();
			});
		});
		//$(own.prev_img).fadeIn(time/2);
		//$(own.prev_img).animate({opacity:_opacity.max},time);
    },
    next:function() { //下一张
        var own = this;
		if(own.checkAnimated()){ //处于移动状态 不处理
			return;
		}
        own.cur_inx = own.cur_inx + 1;
		var time = own.cfg.times.slide;
        var _next = own.getImg(own.cur_inx);
		var _opacity = own.cfg.opacity;
        $(_next).css({opacity:_opacity.min}).hide();
		$(own.img_layer).append(_next);
        var _w = $(own.curr_img).width();
		//$(own.curr_img).animate({opacity: _opacity.min},time);
		$(own.curr_img).fadeOut(time/2,function(){
			$(_next).fadeIn(time/2,function(){
				$(own.curr_img).remove();
			});
		});
		//$(_next).animate({opacity:_opacity.max},time);
    },
    start: function() {//设置定时器 
        var own = this;
		var time = own.cfg.times.interval;
        own.interval = setInterval(function() {
			if(own.interval_flag){
				if(own.direction == 'left'){
					own.prev();
				}else{
					own.next();
				}
			}
        },time);
    },
    createImg: function(inx,data) {//创建一张图片
        var own = this;
        var _img = document.createElement('div');
        $(_img).addClass(stc.inlineDisplayClass).css(this.style.img).css({
            'background-image': 'url("' + data.url + '")',
			'width':own.cfg.width+'px',
			'height':own.cfg.height+'px'
        });

		$(_img).click(function(){
			cb_click = own.cfg.cb_click;
			if('function' == typeof cb_click){
				cb_click(inx);
			}
		});
        return _img;
    },
    createBtn: function(_par,cb_left, cb_right) {//创建左右button
        var own = this;
        var _left = document.createElement('div');
        $(_left).css(own.style.left).addClass('ie6-png-fix');
        $(_left).click(function() {
            if ('function' == typeof cb_left) {
                cb_left();
            }
        });
        var _right = document.createElement('div');
        $(_right).css(own.style.right).addClass('ie6-png-fix');
        $(_right).click(function() {
            if ('function' == typeof cb_right) {
                cb_right();
            }
        });
		var _h = own.cfg.height;
		$(_left).css({'top': (_h - $(_left).height()) / 2 + 'px'});
        $(_right).css({'top': (_h - $(_right).height()) / 2 + 'px'});
        $(_par).append(_left).append(_right);
    }
});

stc.component.ImgScroll.style = {
    root: {
        'position': 'relative',
        'cursor': 'pointer',
        'margin': '0px auto',
        'overflow': 'hidden'
    },
    img: {
        'background-position': '0 0',
        'background-repeat': 'no-repeat',
        'overflow': 'hidden'
    },
    left: {
        'position': 'absolute',
        'z-index': '300',
        'left': '50px',
        'background': 'url(images/btn-left.png) 0px 0px no-repeat',
        'width': '62px',
        'height': '62px'
    },
    right: {
        'position': 'absolute',
        'right': '50px',
        'z-index': '300',
        'background': 'url(images/btn-right.png) 0px 0px no-repeat',
        'width': '62px',
        'height': '62px'
    }
}