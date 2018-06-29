import * as PIXI from 'pixi.js';
import { isHit, keyboard, contain, getRadian, random } from "./tools/utils"
import {test} from './test';
test();
let Application = PIXI.Application,
	Container = PIXI.Container,
	loader = PIXI.loader,
	resources = PIXI.loader.resources,
	Graphics = PIXI.Graphics,
	TextureCache = PIXI.utils.TextureCache,
	Sprite = PIXI.Sprite,
	Text = PIXI.Text,
	TextStyle = PIXI.TextStyle;
const app = new PIXI.Application({
	width: 512,         // default: 800
	height: 512,        // default: 600
	antialias: true,    // default: false
	transparent: false, // default: false
	resolution: 1,     // default: 1
	// backgroundColor: 0x1099bb,
});
app.renderer.view.style.position = "absolute";
app.renderer.view.style.display = "block";
app.renderer.autoResize = true;
app.renderer.resize(512, 512);
document.body.appendChild(app.view);
PIXI.loader
	.add('sprite', './static/img/sprite.json')
	.add('treasureHunter', './static/images/treasureHunter.json')
	.on("progress", (loader, res) => {
		console.log("loading: " + res.url);
		console.log("progress: " + loader.progress + "%");
	})
	.load((loader, res) => {
		console.log(res);
		blobs = [];
		bullets = [];
		treasureHunter = res.treasureHunter.textures;
		sprite = res.sprite.textures;
		//创建场景,开始，游戏，结束
		createScenne();
		//创建背景
		createDungeon();
		//创建主角
		createExplorer();
		//创建怪物
		createBlobs();
		//创建血量条出口宝箱等；
		createHealthBarAndDoor();
		//得到结果
		createResult();
		//添加事件
		addKeyboardListener();
		//状态切换
		stateTo(play);
		//开始游戏循环	
		// gameLoop();
		//游戏循环中加了requestAnimationFrame(gameLoop)，可以不用自带ticker函数
		app.ticker.add(delta => gameLoop(delta));
	});

let state, explorer, treasure, blobs, chimes, dungeon,
	door, healthBar, message, gameScene, gameOverScene, treasureHunter, sprite, createBlobsTimer, bullets;
const stateTo = currentState => {
	state = currentState
}

const gameLoop = (delta) => {
	// requestAnimationFrame(gameLoop)
	state(delta);
}

const play = (delta) => {
	// explorer.x += explorer.vx;
	// explorer.y += explorer.vy;
	// contain(explorer, { x: 28, y: 20, width: 488, height: 480 });
	explorer.move();
	let explorerHit = false;
	blobs.forEach((blob, i) => {
		blob.y += blob.vy;
		blob.x += blob.vx;
		let blobHitsWall = contain(blob.getBounds(), { x: 28, y: 20, width: 488, height: 480 });
		if (blobHitsWall === "top" || blobHitsWall === "bottom") {
			blob.rotation += -2 * getRadian({ x: 0, y: 0, width: 0, height: 0 }, { x: blob.vx, y: blob.vy, width: 0, height: 0 });
			blob.vy *= -1;
		}
		if (blobHitsWall === "left" || blobHitsWall === "right") {
			blob.rotation += Math.PI - getRadian({ x: 0, y: 0, width: 0, height: 0 }, { x: blob.vx, y: blob.vy, width: 0, height: 0 }) * 2
			blob.vx *= -1;
		}
		if (isHit(explorer, blob)) {
			explorerHit = true;
		}
	});
	bullets.forEach((bullet, i) => {
		//子弹运动
		bullet.y += bullet.vy;
		bullet.x += bullet.vx;
		//子弹运动范围及触壁反弹
		let bulletHitsWall = contain(bullet.getBounds(), { x: 28, y: 20, width: 488, height: 480 });
		if (bulletHitsWall === "top" || bulletHitsWall === "bottom") {
			bullet.rotation += -2 * getRadian({ x: 0, y: 0, width: 0, height: 0 }, { x: bullet.vx, y: bullet.vy, width: 0, height: 0 });
			bullet.vy *= -1;
		}
		if (bulletHitsWall === "left" || bulletHitsWall === "right") {
			bullet.rotation += Math.PI - getRadian({ x: 0, y: 0, width: 0, height: 0 }, { x: bullet.vx, y: bullet.vy, width: 0, height: 0 }) * 2
			bullet.vx *= -1;
		}
		//检测子弹是否击中怪物
		blobs.forEach((blob, j) => {
			if (isHit(bullet, blob)) {
				healthBar.outer.width += 1;
				bullets.splice(i, 1);
				blobs.splice(j, 1);
				gameScene.removeChild(bullet);
				gameScene.removeChild(blob);
			}
		})
	});

	if (explorerHit) {
		explorer.alpha = 0.5;
		healthBar.outer.width -= 1;
	} else {
		if (healthBar.outer.width <= 0) {
			explorer.alpha = 0.5;
		} else {
			explorer.alpha = 1;
		};

	}
	//主角是否拿到宝箱，拿到后模拟推箱子
	if (isHit(explorer, treasure)) {
		if (explorer.vx > 0) {
			treasure.x = explorer.x + explorer.width;
		}

		if (explorer.vx < 0) {
			treasure.x = explorer.x - treasure.width;
		}

		if (explorer.vy > 0) {
			treasure.y = explorer.y + explorer.height;
		}

		if (explorer.vy < 0) {
			treasure.y = explorer.y - treasure.height;
		}
		contain(treasure, { x: 28, y: 10, width: 488, height: 480 });
	}
	//判断是否死亡
	if (healthBar.outer.width < 0) {
		healthBar.outer.width = 0;
		state = end;
		message.text = "You lost!";
		// stopCreateBlobs();
	}
	//
	if (isHit(treasure, door)) {
		state = end;
		message.text = "You won!";
	}
}

const end = () => {
	gameScene.visible = false;
	gameOverScene.visible = true;
}

const createScenne = () => {
	//创建Loading场景


	//创建游戏场景
	gameScene = new Container();
	app.stage.addChild(gameScene);

	//创建结束场景,默认隐藏
	gameOverScene = new Container();
	app.stage.addChild(gameOverScene);
	gameOverScene.visible = false;
}

const createDungeon = () => {
	dungeon = new Sprite(treasureHunter['dungeon.png']);
	dungeon.buttonMode = true;
	dungeon.interactive = true;
	gameScene.addChild(dungeon);
	dungeon.on("pointerdown", (e) => {
		let point = {
			...e.data.global,
			width: 0,
			height: 0
		};
		createBullets(point)
	});
}

const createHealthBarAndDoor = () => {
	//Create the health bar
	healthBar = new Container();
	healthBar.position.set(app.stage.width - 170, 4)
	gameScene.addChild(healthBar);

	//Create the black background rectangle
	let innerBar = new Graphics();
	innerBar.beginFill(0x000000);
	innerBar.drawRect(0, 0, 128, 8);
	innerBar.endFill();
	healthBar.addChild(innerBar);

	//Create the front red rectangle
	let outerBar = new Graphics();
	outerBar.beginFill(0xFF3300);
	outerBar.drawRect(0, 0, 128, 8);
	outerBar.endFill();
	healthBar.addChild(outerBar);
	healthBar.outer = outerBar;

	door = new Sprite(treasureHunter["door.png"]);
	door.position.set(32, 0);
	gameScene.addChild(door);

	//Treasure
	treasure = new Sprite(treasureHunter["treasure.png"]);
	treasure.x = gameScene.width - treasure.width - 48;
	treasure.y = gameScene.height / 2 - treasure.height / 2;
	gameScene.addChild(treasure);
}

const createExplorer = () => {
	let textures = treasureHunter["explorer.png"];
	let options = {
		x: 68,
		y: gameScene.height / 2 - textures.height / 2,
		vx: 0,
		vy: 0
	}
	explorer = new Explorer(textures, options);
	gameScene.addChild(explorer);
}

class Explorer extends Sprite {
	public vx: number
	public vy: number
	constructor(textures, options) {
		super(textures);
		if (options) {
			for (let k in options) {
				this[k] = options[k]
			}
		}
	}
	move() {
		this.x += this.vx;
		this.y += this.vy;
		contain(this, { x: 28, y: 20, width: 488, height: 480 });
	}
}

const createBlobs = () => {
	createBlobsTimer = setInterval(() => {
		if (blobs.length >= 20) {
			return
		} else {
			let numberOfBlobs = 1,
				spacing = 48,
				xOffset = 150,
				speed = 2,
				direction = 1;
			for (let i = 0; i < numberOfBlobs; i++) {

				let blob = new Sprite(treasureHunter["blob.png"]);
				let x = spacing * i + xOffset;
				let y = random(0, app.stage.height - blob.height);
				blob.x = x;
				blob.y = y;
				(blob as any).vy = speed * direction;
				(blob as any).vx = speed * direction / 2;
				direction *= -1;
				blobs.push(blob);
				gameScene.addChild(blob);
			}
		}
	}, 200)
}

const stopCreateBlobs = () => {
	window.clearInterval(createBlobsTimer);
}

const createBullets = (point) => {
	let bullet = new Sprite(treasureHunter["explorer.png"]);;
	bullet.anchor.set(0.5);
	let pointRadian = getRadian(explorer, point);
	bullet.rotation = pointRadian - Math.PI * 3 / 2;
	bullet.x = explorer.x + explorer.width / 2;
	bullet.y = explorer.y + explorer.height / 2;
	(bullet as any).vx = 5 * Math.cos(pointRadian);
	(bullet as any).vy = 5 * Math.sin(pointRadian);
	bullets.push(bullet);
	gameScene.addChild(bullet);
}

const createResult = () => {
	let style = new TextStyle({
		fontFamily: "Futura",
		fontSize: 64,
		fill: "white"
	});
	message = new Text("The End!", style);
	message.anchor.set(0.5);
	message.x = app.stage.width / 2;
	message.y = app.stage.height / 2;
	gameOverScene.addChild(message);
}

const addKeyboardListener = () => {
	let left = keyboard(37),
		up = keyboard(38),
		right = keyboard(39),
		down = keyboard(40),
		a = keyboard(65),
		w = keyboard(87),
		d = keyboard(68),
		s = keyboard(83);
	a.press = left.press = () => {
		explorer.vx = -5;
	};
	a.release = left.release = () => {
		explorer.vx = 0;
	};

	w.press = up.press = () => {
		explorer.vy = -5;
	};
	w.release = up.release = () => {
		explorer.vy = 0;
	};

	d.press = right.press = () => {
		explorer.vx = 5;
	};
	d.release = right.release = () => {
		explorer.vx = 0;
	};
	s.press = down.press = () => {
		explorer.vy = 5;
	};
	s.release = down.release = () => {
		explorer.vy = 0;
	};
}
