;(function($){
	var Tab = function(tabs,opt){
		var _this = this;
		this.tab = $(tabs).eq(0);
		this.config = {
			"triggerType":"click",
			"effect":"default",
			"invoke":1,
			"auto":3000
		};
		if($.isPlainObject(opt) && !($.isEmptyObject(opt))){
			$.extend(this.config,opt);
		}
		var _config = this.config;
		this.tabItems = this.tab.find('ul.tab-nav li');
		this.contentItems = this.tab.find('div.content-wrap div.content-item');

		if(_config.triggerType === 'click'){
			_this.tabItems.on('click',function(){
				_this.invoke($(this));
			});
		}else if(_config.triggerType === 'mouseover'){
			_this.tabItems.mouseover(function(){
				var self = $(this);
				_this.invoke(self);
				if(_this.config.auto){
					_this.stopPlay();
				}
			}).mouseout(function(){
				_this.autoPlay();
			});
		}else{
			console.error(_config.triggerType + '不是正确的事件类型，请重新输入!');
			return;
		}
		//自动切换功能
		if(_config.auto){
			this.timer = null;
			this.loop = _config.invoke-1;
			this.autoPlay();
			this.contentItems.hover(function(){
				_this.stopPlay();
			},function(){
				_this.autoPlay();
			});
		}
		this.invoke(this.tabItems.eq(_config.invoke-1));
	}
	Tab.prototype = {
		constructor:Tab,
		//自动间隔时间切换
		autoPlay:function(){
			var _this 	  = this,
				tabItems  = _this.tabItems,
				tabLength = tabItems.length,
				config    = _this.config;
			_this.timer = window.setInterval(function(){
				_this.loop++;
				if(_this.loop>=tabLength){
					_this.loop = 0;
				}
				//tabItems.eq(_this.loop).trigger(config.triggerType);
				_this.invoke(tabItems.eq(_this.loop));
			},config.auto);
		},
		stopPlay:function(){
			var _this = this;
			window.clearInterval(_this.timer);
		},
		//事件驱动函数
		invoke:function(currentTab){
			var _this = this;
			var index = currentTab.index();
			currentTab.addClass('actived').siblings().removeClass('actived');
			var effect 	 = _this.config.effect;
			var conItems = _this.contentItems;
			if(effect === 'default'){
				conItems.eq(index).addClass('current').siblings().removeClass('current');
			}else if(effect === 'fade'){
				conItems.eq(index).fadeIn().siblings().fadeOut();
			}else{
				console.error(effect + '不是正确的值，请重新输入!');
				return;
			}
			if(_this.config.auto){
				_this.loop = index;
			}
		}
	};
	Tab.init = function(tabs,opt){
		var _this = this;
		$(tabs).each(function(){
			new _this(this,opt);
		});
	}

	$.fn.extend({
		tab:function(opt){
			var _this = this;
			_this.each(function(){
				new Tab(this,opt);
			});
			return _this;
		}
	});
	window.Tab = Tab;
})(jQuery);