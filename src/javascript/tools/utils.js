class Key {
	constructor(keyCode) {
		this.code = keyCode;
		this.isDown = false;
		this.isUp = true;
		this.press = undefined;
		this.release = undefined;
		this.addEventListener();
	}
	addEventListener() {
		window.addEventListener(
			"keydown", this.downHandler.bind(this), false
		);
		window.addEventListener(
			"keyup", this.upHandler.bind(this), false
		);
	}
	downHandler(e) {
		if (e.keyCode === this.code) {
			console.log(e.keyCode)
			if (this.isUp && this.press) this.press();
			this.isDown = true;
			this.isUp = false;
		}
		event.preventDefault();
	}
	upHandler(e) {
		if (e.keyCode === this.code) {
			if (this.isDown && this.release) this.release();
			this.isDown = false;
			this.isUp = true;
		}
		event.preventDefault();
	}
}

export const Storage = {
	setItem(name, data) {
		data = typeof data === "object" ? JSON.stringify(data) : data.toString();
		try {
			window.localStorage.setItem(name, data);
		} catch (e) { }
	},

	getItem(name, isObj) {
		try {
			var data = window.localStorage.getItem(name);
		} catch (e) {
			return;
		}
		if (!data) return null;
		if (!isObj) return data;
		try {
			return JSON.parse(data);
		} catch (e) {
			return null;
		}
	},
	removeItem(name) {
		try {
			window.localStorage.removeItem(name);
		} catch (e) { }
	}
};

export const getStyle = (element, att) => {
	if (window.getComputedStyle) {
		return window.getComputedStyle(element)[att];
	} else {
		return element.currentStyle[att];
	}
}

export const deepClone = obj => {
	var _tmp, result;
	_tmp = JSON.stringify(obj);
	result = JSON.parse(_tmp);
	return result;
}

export const lookScroll = {

	stopBodyScroll(isFixed) {
		if (isFixed) {
			this.top = window.scrollY;
			document.body.style.position = "fixed";
			document.body.style.top = -this.top + "px";
		} else {
			document.body.style.position = "";
			document.body.style.top = "";
			window.scrollTo(0, this.top);
		}
	},

}

export const type = obj => {
	return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase()
}

//setTime为创建时间毫秒，days为天
export const isSessionExpired = (setTime, days) => {
	//86400000ms  一天毫秒数
	return new Date().getTime() - setTime > 86400000 * days ? true : false
}

export const inheritPrototype = (SubType, SuperType) => {
	var prototype = Object(SuperType.prototype);//创建对象
	prototype.constructor = SubType; //增强对象
	SubType.prototype = prototype;//加强对象
}

export const random = (min, max) => {
	var Range = max - min;
	var Rand = Math.random();
	return (min + Math.round(Rand * Range));
}

export const isHit = (r1, r2) => {
	var hit, combinedHalfWidths, combinedHalfHeights, vx, vy;
	// 默认没有碰撞
	hit = false;
	// 获取两个 sprite 的中心点在x,y轴上的值
	r1.centerX = r1.x;
	r1.centerY = r1.y;
	r2.centerX = r2.x;
	r2.centerY = r2.y;
	//获取 sprite 的半宽或半高
	r1.halfWidth = r1.width / 2;
	r1.halfHeight = r1.height / 2;
	r2.halfWidth = r2.width / 2;
	r2.halfHeight = r2.height / 2;
	// 计算两个 sprite 的 x y 轴的距离
	vx = r1.centerX - r2.centerX;
	vy = r1.centerY - r2.centerY;
	// 计算两个 sprite 的半宽之和及半高之和
	combinedHalfWidths = r1.halfWidth + r2.halfWidth;
	combinedHalfHeights = r1.halfHeight + r2.halfHeight;
	// 首先判断 x 轴方面，如果 x 轴中心点距离小于两个 sprit 的半宽和，则判断 y 轴方面
	if (Math.abs(vx) < combinedHalfWidths) {
		// 如果 y 轴方面半宽和也小于 y 轴中心点的距离，则判定为碰撞
		hit = Math.abs(vy) < combinedHalfHeights;
	} else {
		// 否则没有发生碰撞
		hit = false;
	}
	return hit;
}

export const keyboard = keyCode => {
	return new Key(keyCode);
}
export const contain = (sprite, container) => {

	let collision = undefined;

	//Left
	if (sprite.x < container.x) {
		sprite.x = container.x;
		collision = "left";
	}

	//Top
	if (sprite.y < container.y) {
		sprite.y = container.y;
		collision = "top";
	}

	//Right
	if (sprite.x + sprite.width > container.width) {
		sprite.x = container.width - sprite.width;
		collision = "right";
	}

	//Bottom
	if (sprite.y + sprite.height > container.height) {
		sprite.y = container.height - sprite.height;
		collision = "bottom";
	}

	//Return the `collision` value
	return collision;
}
export const getRadian = (startSprite, endSprite) => {
	let endX = endSprite.x + endSprite.width / 2;
	let endY = endSprite.y + endSprite.height / 2;
	let startX = startSprite.x + startSprite.width / 2;
	let startY = startSprite.y + startSprite.height / 2;
	let dx = endX - startX;
	let dy = endY - startY;
	let dl = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
	let cos = dx / dl;
	let radian = dy < 0 ? 2 * Math.PI - Math.acos(cos) : Math.acos(cos);
	return radian
}
