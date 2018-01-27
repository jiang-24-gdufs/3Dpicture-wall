//思路
/*动态操作DOM, 动态生成li插入图片
 点击交互 小 -> 大 (恢复默认的状态) 大 -> 小
 * */

//在原型链上写
function Index(row, col){
	this.num = {
		totalW : $('.wrap-ul').width(),
		totalH : $('.wrap-ul').height(),
		rows	:	row,
		cols	:	col
	}
	//动态创建dom
	this.createDom()
}

Index.prototype.createDom =  function (){
	//并不直接使用参数而使用对象配置参数中的属性值
	//	this指向实例对象
	var r = this.num.rows,
		c = this.num.cols,
		//平均 宽高
		w = this.num.totalW / c
		h = this.num.totalH / r
		
	//图片的宽高存到index实例中(也可以成为全局)
	this.num.width = w
	this.num.height = h
	
//		console.log(this)	// 实例对象啊
		console.log(w,h)	//NaN
	for (var i = 0; i < r; i++) {
		for (var j = 0; j < c; j++) {
			console.log(w * j,h * r)
			//创建li>img结构
			$('<li><div class="box"><img src=""></div></li>')
			.width(w)
			.height(h)
			//让li分开的定位
			//图片的宽高为最小单位
			.css({
				
				'left' : w * j + 'px',
				'top' :  h * i + 'px',
				//初始属性
				//角度旋转
				//水平方向的平移由 第几列 来控制
				//z-轴让图片大小不一
				'transform' : 'rotate(' + (Math.random() * 40 - 20)+ 'deg)' +
							'translateX(' + (30 * j - 60 ) + 'px)' +
							'translateY(' + (30 * i - 60 ) + 'px)' +
							'translateZ(' + (Math.random() * 5) + 'px)'
//				
			})
			.find('img').attr('src', 'img/pic' + ( i * c + j ) + '.jpg')
			.end()
			//find()选中DOM元素
//			栈  调用方法 让 $对象 回退
			.appendTo($('.wrap-ul'))
			/**/
		}
	}
	
	this.bindEvent();//点击事件
}


Index.prototype.bindEvent = function () {
	//会存在　this 指向问题　ＤＯＭ元素　与　实例
	//保存实例 
	var self = this
	
	
	
	//通过对一个图片的多个小图片的position定位来组合成一个大图
	var h = this.num.totalH,
		w = this.num.totalW,
		bgLeft = 0,		//图片的边距 距离ul
		bgTop = 0,
		
		width = this.num.width,				//执行index()后计算出的平均宽高纳入num对象中助计算
		height = this.num.height,
		flag = this.num.flag							//锁,第一次点击执行 小 ==> 大 第二次则执行 大 ==> 小
		flag = true
	
//	小-->大
	$('.wrap-ul').find('li').on('click', function(){
		console.log($('li'))
		if(flag){
			var bgImg = $(this).find('img')			//点击的元素下的img
			$('.wrap-ul li').each(function(index){
			//所有图片都替换为点击的图片
			var $this = $(this)//点击的DOM元素
			//不保留则 可能会变为 实例的this
			$this.delay( 10 * index ).animate({//延迟 过度的效果
				'opacity' : 0.5,	//透明再动画 完整性				
			},200, function (){		//透明动画后的回调
				$this.css({
					'transform' : 'translate3d(0,0,0)'	//平整图片 去掉3d的位移
				})
				$this.find('.box').css({
					'transform' : 'scale(1)'	//box去白边
				})
				$this.find('img').attr('src', bgImg.attr('src'))		//展示 的src
				.css({
					//img根据 li 定位
					'position' : 'absolute',
					'height':	h + 'px',							//变的和ul一样大
					'width'	:	w + 'px',
					
					//图片往左变移动展示不同的内容
					'left' : -bgLeft,								//根据行列和宽高拼接图片
					'top' : -bgTop,
				})
				$('ul').css({										//ul外部区域隐藏
					'overflow' : 'hidden'
				})
				
				//拼接图片的定位处理 关键步骤
				bgLeft += width			//width改变  ==== 每一个 li 操作 width会一直加
				if (bgLeft >= w) {		//左边距和上边据的改变
					bgLeft = 0			//另外一行
					bgTop += height
				}
				
				
				$this.animate({
					'opacity' : '1'		//恢复可视
				})
				
				
				flag = false
			})
//			小变大 之后 再 归0位
				bgLeft = 0;
				bgTop = 0;
			
		})
		}else{	//把图片再放回到li里面
			
			$('.wrap-ul li').each(function (index){
				
				var $this = $(this)	//每一次触发事件的dom元素
				$this.animate({
					'opacity': 0.5
				}, 200, function(){
					$this.find('img').css({
						//变小,且定位左上角
						'width' :100 + '%',
						'height': 100 + '%',
						'left':0,
						'top':0,
						'position': 'absolute'
						
					})
					
					//替换图片,根据index的值来替换
					$this.find('img').attr('src', 'img/pic' + index + '.jpg')
					//替换完图片需要对所有的li进行css操作  
					//复制上面动态createDom的操作
					//但是没 变量 i j
					//根据index来变   i 为行数 j列数
					//index/行数的 商为行索引 余数为列
					
//					console.log(this)	//li dom元素
					var j = index % self.num.cols,
						i = parseInt(index / self.num.cols)
//					console.log(i,j)	//	i,j索引
					$this.css({
						'transform' : 'rotate(' + (Math.random() * 40 - 20)+ 'deg)' +
							'translateX(' + (30 * j - 60 ) + 'px)' +
							'translateY(' + (30 * i - 60 ) + 'px)' +
							'translateZ(' + (Math.random() * 125) + 'px)',
						'width': 30 + 'px',
						'height': 30 + 'px'
						
					})
					$this.find('.box').css({'transform': 'scale(0.85)'})
					$('ul').css({
						'overflow':'visible'
						})
					$this.animate({		
						'width': self.num.width,
						'height': self.num.height,
						'opacity': 1
					},1000)

				
				})
			})	
			flag = true
			

		}
		
		
//	<div class="box" style="transform: scale(1);"><img src="img/pic16.jpg" style="position: absolute; height: 603.997px; width: 567.995px; left: 0px; top: 0px;"></div>	
//	<div class="box" style="transform: scale(1);"><img src="img/pic16.jpg" style="position: absolute; height: 603.997px; width: 567.995px; left: 0px; top: -966.395px;"></div>
//	<div class="box" style="transform: scale(0.85);"><img src="img/pic16.jpg" style="position: absolute; height: 100%; width: 100%; left: 0px; top: 0px;"></div>
	})
}
new Index(4,4)
