let fs = require('fs');

let filePath = '/Users/ZWL/Sites/Node/';

fs.readdir(filePath, (err, files) => {
	if (err) throw err;

	console.log(files)
} );



const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

console.log(ctx);

// 列表
var _img = new Image();
_img.src = 'img/mac.png';

_img.onload = function() {

	ctx.drawImage(_img, 0, 0, 986, 725);

	
	// 高亮路径
	highlightRemind({
		txt: '/Users/ZWL/Sites/Node/iPaths//Sites/Node/iPaths//Sites/Node/iPaths//Sites/Node/iPaths//Sites/Node/iPaths//Sites/Node/iPaths//Sites/Node/iPaths//Sites/Node/iPaths/canvas.html',
		x: 56,
		y: 87,
		w: 873,
		h: 22,
		canvasContext: ctx
	});

	drawFiles(ctx);

	let dataURL = canvas.toDataURL('image/png', 1.0);

	console.log(dataURL)

}


/*
	高亮提醒
	----------------------------------
	highlightRemind({
		txt: '显示内容',
		x: 0,
		y: 0,
		w: 20,
		h: 20,
		bw: [1,1,1,1],
		bs: 'solid',
		bc: '#f90',
		canvasContext: obj
	});

	@txt [string] 提醒内容
	@x [number] canvas 上 x 坐标
	@y [number] canvas 上 y 坐标
	@w [number] 宽度
	@h [number] 高度
	@bw [array] border-width, [上 右 下 左]
	@bs [string] border-style,
	@bc [string] border-color, 颜色
	@canvasContext [object] canvas.getContent('2d')对象

*/
function highlightRemind(options) {
	let txt = options.txt || '', 
		x = options.x || 0, 
		y = options.y || 0, 
		w = options.w || 100, 
		h = options.h || 20, 
		bw = options.bw,
		bs = options.bs || 'solid',
		bc = options.bc || '#f00',
		ctx = options.canvasContext;

	// txt = !txt ? txt === '' ? '' : '没有提醒内容' : txt;

	txt_X = parseInt(x + w/2);
	txt_Y = parseInt(y + (10 + h)/2);
	console.log('text x:' ,txt_X);
	console.log('text y:' ,txt_Y);

	ctx.save();
	// 背景
	ctx.fillStyle = '#FFEB3B';
	
	ctx.fillRect(x, y, w, h);

	// 绘制边框
	if(bw) {
		if (typeof bw !== 'object') {
			console.warn('bw : [上 右 下 左], 请检查格式!')
		} else {
			for (let i = 0; i < 4; i++) {
				if (bw[i] > 0) {

					let _x = x,
						_y = y,
						_ex = x,
						_ey = y;

					switch(i) {
						case 0:
							_ex = w + x;
							break;

						case 1:
							_x = _ex = w + x;
							_ey = y + h;
							break;

						case 2:
							_y = _ey = y +h;
							_ex = x + w;
							break;

						case 3:
							_ey = y + h;
					}


					ctx.beginPath();
					ctx.moveTo(_x, _y);
					ctx.lineTo(_ex, _ey);
					ctx.lineWidth = bw[i];
					ctx.strokeStyle = bc;
					ctx.stroke();
				}
			}
		}
		
	} // END BW

	ctx.fillStyle = '#c33';
	ctx.fillStyle = '#C33';
	ctx.font = '12px 黑体';
	ctx.textAlign = 'center';


	// 12px 一个中文,2个英文字母,固这里使用 12/2 =6
	// 当文字个数过长时
	console.log(getStrLen(txt) ,w)
	if (getStrLen(txt) * 6 > w) {

		txt = ( substrs( txt, 0, Math.floor(w/6) - 3 ) ) + '...';
	}

	ctx.fillText(txt, txt_X, txt_Y);

	ctx.restore()
}


// 可以过滤出中文字符长度
function getStrLen(str) {
	return str.replace(/[^\x00-\xff]/g, '__').length;
}


// 文字溢出
function textOverflow(str, len) {
	// 文字过长隐藏
	if (getStrLen(str) > len) {
		str = substrs(str, 0, len - 4) + '...';
	}
	return str;
}

/* 
	字符串截取
	----------------------------------------
	支持中文的截取

	@str 截取字符串
	@start 开始位置
	@len 截取长度
*/ 
function substrs(str, start, len) {

	let result = '';
	let strLen = getStrLen(str);

	len = len || strLen;
	start = start || 0;


	for (let i = 0; i < strLen; i++) {

		if (i >= start + len) {
			// console.log('OVER');
			break;
		}

		// 小于截取内容时
		if (i < start) {

			// 如果是中文,全角字符，在不输出时，全部格式成 __
			if ( /[^x00-\xff,?*&$\-+\s]/.test( str[i] ) ) {
				i++;
				str = str.replace(/[^\x00-\xff]/, '__');

				// i++ 之后是否已经超出了截取的限制
				// 超出则停止
				if (i > start + len) {
					console.log('add will OVER');
					break;
				}
			}
			
		} 
		// 开始截取
		else {

			// 对中文，我们加上一个字符，路过这个词
			if ( /[^x00-\xff,?*&$\-+\s]/.test( str[i] ) ) {
				str = '_' + str;
				i++;
				result += str[i]
				
			} 
			// 非中文添加
			else {
				result += str[i]
			}
			
		}

	}


	return result;
}


function drawFiles(ctx) {

	let mac = {
		icoUrl : 'img/macIcons.png',
		finder : {
			width: 968,
			height: 725,
			clientX: 167, // 文件列表输出 x
			clientY: 110, // 文件列表输出 y
			clientWidth: 204,  // 文件列表宽度
			clientHeight: 538  // 文件列表可用高度
		}

	};

	// Mac Icon
	var _icon = new Image();
	_icon.src = 'img/macIcons.png';

	// 模拟文件夹下内容
	filesPath = [ '.DS_Store',
				  '.git',
				  '.gitignore',
				  'Chat',
				  'Command',
				  'Connect',
				  'Css',
				  'Demo',
				  'Doc',
				  'GenerateTemHTML',
				  'GenneratePages',
				  'Node demo',
				  'PhoneLogin',
				  'README.md',
				  'UglifyJS',
				  'console',
				  'iMkdirs',
				  'iPaths',
				  'iTinify',
				  'nodemailer',
				  'source-map',
				  'sourceMap',
				  'vedio',
				  'zlogs' ];

				  
	// 
	_icon.onload = function() {
		console.log('sss')


		for (let i = 0; i < filesPath.length; i++) {

			if (filesPath[i] === 'README.md') {
				highlightRemind({
					x: mac.finder.clientX,
					y: mac.finder.clientY + 18 * i,
					w: mac.finder.clientWidth,
					h: 17,
					canvasContext: ctx
				});
			}


			ctx.drawImage(_icon, 2, 2, 17, 17, mac.finder.clientX + 5, mac.finder.clientY +i*18, 17, 17);
			ctx.fillStyle = '#272727';
			ctx.font = '12px STHeiti';
			ctx.fillText(filesPath[i], mac.finder.clientX + 27, mac.finder.clientY +i*18 + 15)
		}
	
	}
}