/**
 * @author echd
 * @description Float类型运算公共方法
 * @version 1.0
 */
clazz('stc.utils.FloatOperation',function() {
    var own = this;
    return {
		 //float加法
        floatAdd: function(arg1, arg2) {
            return own.floatAdd(arg1, arg2);
        },
        //float减法
        floatSubtract: function(arg1, arg2) {
            return own.floatSubtract(arg1, arg2);
        },
        //float乘法
        floatMultiply: function(arg1, arg2) {
            return own.floatMultiply(arg1, arg2);
        },
        //float除法
        floatDivide: function(arg1, arg2) {
            return own.floatDivide(arg1, arg2);
        },
		//float向下取整 precision:保留位数
		floatFloor:function(num,precision){
			return own.floatFloor(num,precision);
		},
		//float向上取整 precision:保留位数
		floatCeil:function(num,precision){
			return own.floatCeil(num,precision);
		},
		//float四舍五入 precision:保留位数
		floatRound:function(num,precision){
			return own.floatRound(num,precision);
		},
		//四舍五入
		formatCurrency: function(num) {
			return own.formatCurrency(num);
		}
	}
},{
	//获取参数精度，如果为整数则精度为0  
	_getPrecision: function(arg) {
		if (arg.toString().indexOf(".") == -1) {
			return 0;
		} else {
			return arg.toString().split(".")[1].length;
		}
	},
	//获取小数的整数形式  
	_getIntFromFloat: function(arg) {
		if (arg.toString().indexOf(".") == -1) {
			return arg;
		} else {
			return Number(arg.toString().replace(".", ""));
		}
	},
	//乘法  
	floatMultiply: function(arg1, arg2) {
		var precision1 = this._getPrecision(arg1);
		var precision2 = this._getPrecision(arg2);
		var tempPrecision = 0;

		tempPrecision += precision1;
		tempPrecision += precision2;
		var int1 = this._getIntFromFloat(arg1);
		var int2 = this._getIntFromFloat(arg2);
		return (int1 * int2) /Math.pow(10, tempPrecision);
	},
	//加法  
	floatAdd: function(arg1, arg2) {
		var precision1 = this._getPrecision(arg1);
		var precision2 = this._getPrecision(arg2);
		var temp = Math.pow(10, Math.max(precision1, precision2));
		return (this.floatMultiply(arg1, temp) + this.floatMultiply(arg2, temp)) / temp;
	},
	//减法  
	//arg1 被减数  
	//arg2 减数  
	floatSubtract: function(arg1, arg2) {
		var precision1 = this._getPrecision(arg1);
		var precision2 = this._getPrecision(arg2);
		var temp = Math.pow(10, Math.max(precision1, precision2));
		return (this.floatMultiply(arg1, temp) - this.floatMultiply(arg2, temp)) / temp;
	},
	//除法  
	//arg1 被除数  
	//arg2 除数  
	floatDivide: function(arg1, arg2) {
		var precision1 = this._getPrecision(arg1);
		var precision2 = this._getPrecision(arg2);
		var int1 = this._getIntFromFloat(arg1);
		var int2 = this._getIntFromFloat(arg2);
		var result = (int1 / int2) * Math.pow(10, precision2 - precision1);
		return result;
	},
	//float向下取整 
	//num:待处理的数 precision:保留位数
	floatFloor:function(num,precision){
		var own = this;
		if (num == null || isNaN(num)) {
			return "";
		}
		precision = (null == precision ? 2:precision);
		var t1 = own.floatMultiply(num,Math.pow(10,precision));//扩大10的precision次方
		var t2 = parseInt(Math.floor(t1));//去除小数部分
		var result = own.floatDivide(t2,Math.pow(10,precision));//转换为小数
		return result.toFixed(precision);
	},
	//float向上取整 
	//num:待处理的数 precision:保留位数
	floatCeil:function(num,precision){
		var own = this;
		if (num == null || isNaN(num)) {
			return "";
		}
		precision = (null == precision ? 2:precision);
		var t1 = own.floatMultiply(num,Math.pow(10,precision));//扩大10的precision次方
		var t2 = parseInt(Math.ceil(t1));//去除小数部分
		var result = own.floatDivide(t2,Math.pow(10,precision));//转换为小数
		return result.toFixed(precision);
	},
	//float四舍五入
	//num:待处理的数 precision:保留位数
	floatRound:function(num,precision){
		var own = this;
		if (num == null || isNaN(num)) {
			return "";
		}
		precision = (null == precision ? 2:precision);
		var t1 = own.floatMultiply(num,Math.pow(10,precision));//扩大10的precision次方
		var t2 = parseInt(Math.round(t1));//去除小数部分
		var result = own.floatDivide(t2,Math.pow(10,precision));//转换为小数
		return result.toFixed(precision);
	},
	/**
	 * @description 将数值四舍五入（保留2位小数)后格式化成金额形式
	 * @param {String} num数值
	*/
    formatCurrency: function(num) {
        if (num == null || typeof num == 'undefined' || num == "" || isNaN(num)) {
            return "";
        } else {
            num = num.toString().replace(/\$|\,/g, '');
            sign = (num == (num = Math.abs(num)));
            num = Math.floor(num * 100 + 0.50000000001);
            cents = num % 100;
            num = Math.floor(num / 100).toString();
            if (cents < 10) cents = "0" + cents;
            for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++) 
				num = num.substring(0, num.length - (4 * i + 3)) + ',' + num.substring(num.length - (4 * i + 3));
            return (((sign) ? '': '-') + num + '.' + cents);
        }
    }
});
//重写toFixed 两位小数后会出现bug
//Number.prototype.toFixed  =   function ( exponent)
//{ 
    //return  parseInt( this *  Math.pow(  10 , exponent)  +   0.5 )*Math.pow(10,-exponent);
//}