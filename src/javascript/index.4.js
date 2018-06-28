import * as PIXI from 'pixi.js';
import 'pixi-sound';
import util from "./util";
import { resolve } from 'url';
const app = new PIXI.Application({
	width: window.innerWidth,         // default: 800
	height: window.innerHeight,        // default: 600
	antialias: true,    // default: false
	transparent: false, // default: false
	resolution: 1,     // default: 1
	backgroundColor: 0x1099bb,
});
// 渲染器占满整个屏幕
app.renderer.view.style = {
	position: "absolute",
	display: "block"
}
app.renderer.autoResize = true;
app.renderer.resize(window.innerWidth, window.innerHeight);
document.body.appendChild(app.view);
// 读取静态资源，并注册一个回调函数
let bgStartTexture,
	bgTexture,
	hornImgTexture,
	hornNoImgTexture,
	bgMusic,
	bgShotMusic,
	myPlanTexture,
	myPlanBoomTexture,
	myBulletTexture,
	smallPlanTexture,
	smallPlanBoomTexture,
	middlePlanTexture,
	middlePlanBoomTexture,
	bigPlanTexture,
	bigPlanBoomTexture,
	deltime = 0,//死亡计数
	isDead = false,//是否死亡
	speedUp = 1, //设置敌机默认下降倍数
	bullerSpeed = 1,//设置子弹发射速度倍速
	scoreNow = 0,
	bullets = [],
	enemys = [],
	producingEnemyTimer,
	producingBulletTimer,
	first = true

PIXI.loader
	.add('sprite', './static/img/sprite.json')
	.add('myPlan', './static/img/myplan.png')
	.add('smallBoom', './static/img/smallboom.png')
	.add('middleBoom', './static/img/middleboom.png')
	.add('bigBoom', './static/img/bigboom.png')
	.add('bgMusic', './static/music/bgmusic.mp3')
	.add('bgShotMusic', './static/music/shot.mp3')
	.add('hornImg', './static/img/horn.png')
	.add('hornNoImg', './static/img/horn-no.png')
	.on("progress", (loader, res) => {
		console.log("loading: " + res.url);
		console.log("progress: " + loader.progress + "%");
	})
	.load((loader, res) => {
		console.log('complete');
		console.log(res);


		//开始背景
		bgStartTexture = res.sprite.textures['start.png'];
		//背景
		bgTexture = res.sprite.textures['background_1.png'];
		//开关静音
		hornImgTexture = res.hornImg.texture;
		hornNoImgTexture = res.hornNoImg.texture;
		//背景音乐
		bgMusic = res.bgMusic.sound;
		//子弹射击声音
		bgShotMusic = res.bgShotMusic.sound;
		//我的飞机
		myPlanTexture = res.myPlan.texture;
		myPlanBoomTexture = res.sprite.textures['myplanboom.gif'];
		myBulletTexture = res.sprite.textures['bullet.png'];
		//小敌军
		smallPlanTexture = res.sprite.textures['small.png'];
		smallPlanBoomTexture = res.smallBoom.texture;
		//中敌军
		middlePlanTexture = res.sprite.textures['middle.png'];
		middlePlanBoomTexture = res.middleBoom.texture;
		//大敌军
		bigPlanTexture = res.sprite.textures['big.png'];
		bigPlanBoomTexture = res.bigBoom.texture;




		console.log(middlePlanTexture)





		//开始页================
		//背景开始
		const startContainer = new PIXI.Container();
		app.stage.addChild(startContainer);
		const bgStart = new Bg(bgStartTexture, app.renderer.width, app.renderer.height, app.renderer.width / 2, app.renderer.height / 2, [0.5, 0.5]);
		startContainer.addChild(bgStart);
		//背景结束

		//按钮开始
		//按钮容器
		const buttonContainer = new PIXI.Container();

		//画开始按钮
		let startButton = new PIXI.Graphics();
		startButton.lineStyle(2, 0x000000);
		startButton.beginFill(0x000000, 0);
		startButton.drawRoundedRect(0, 0, 100, 40, 10);
		startButton.endFill();
		startButton.buttonMode = true;
		startButton.interactive = true;
		startButton.on("pointerdown", () => {
			if (buttonContainer.isend) {
				location.reload();
			}
			else {
				mainContainer.visible = true;
				scoreText.visible = true;
				hornSprite.visible = true;
				startContainer.visible = false;
				enemys = [];
				bullets = [];

				bgMusic.play();
				producingEnemys([smallPlanTexture, middlePlanTexture, bigPlanTexture], mainContainer);
			}

		});
		buttonContainer.addChild(startButton);
		let startButtonText = new PIXI.Text('开始游戏', {
			fontSize: "20px",
			fill: 0x000000
		});
		startButtonText.x = buttonContainer.width / 2;
		startButtonText.y = buttonContainer.height / 2;
		startButtonText.anchor.set(0.5);
		buttonContainer.addChild(startButtonText);


		//画调速按钮
		let speedButton = new PIXI.Graphics();
		speedButton.lineStyle(2, 0x000000);
		speedButton.beginFill(0x000000, 0);
		speedButton.drawRoundedRect(0, 50, 100, 40, 10);
		speedButton.endFill();
		speedButton.buttonMode = true;
		speedButton.interactive = true;
		buttonContainer.addChild(speedButton);
		speedButton.on("pointerdown", () => {
			if (speedUp == 1) {
				speedUp = 1.5;
				speedButtonText.text = '难度x1.5';
			}
			else if (speedUp == 1.5) {
				speedUp = 2;
				speedButtonText.text = '难度x2';
			} else {
				speedUp = 1;
				speedButtonText.text = '难度x1';
			}
		});
		let speedButtonText = new PIXI.Text('难度x1', {
			fontSize: "20px",
			fill: 0x000000
		});
		speedButtonText.anchor.set(0.5);
		speedButtonText.x = buttonContainer.width / 2;
		speedButtonText.y = 71;
		buttonContainer.addChild(speedButtonText);
		buttonContainer.x = buttonContainer.width / 2;
		buttonContainer.y = buttonContainer.height / 2;
		buttonContainer.position.set((app.renderer.width - buttonContainer.width) / 2, (app.renderer.height - buttonContainer.height) / 2);
		startContainer.addChild(buttonContainer);
		//按钮结束


		//主页

		const mainContainer = new PIXI.Container();
		// const mainBg = new Bg(bgTexture, app.renderer.width, app.renderer.height, app.renderer.width / 2, app.renderer.height / 2, [0.5, 0.5]);
		// mainContainer.addChild(mainBg);
		app.stage.addChild(mainContainer);
		//素材
		let bgTiling = new PIXI.extras.TilingSprite(
			bgTexture,
			app.renderer.width,
			app.renderer.height * 2
		);
		bgTiling.x = app.renderer.width / 2;
		bgTiling.y = app.renderer.height / 2;
		bgTiling.anchor.set(0.5);
		mainContainer.addChild(bgTiling);
		mainContainer.visible = false;

		//分数显示
		let scoreText = new PIXI.Text(`Score:${scoreNow}`, {
			fontSize: "28px",
			fill: "0x00000"
		});
		scoreText.x = scoreText.width * 0.5 + 10;
		scoreText.y = scoreText.height * 0.5 + 15;
		scoreText.anchor.set(0.5);
		mainContainer.addChild(scoreText);
		scoreText.visible = false;

		//声音开关小喇叭
		let hornSprite = new PIXI.Sprite(hornImgTexture);
		hornSprite.x = app.renderer.width - 20 - hornSprite.width * 0.5;
		hornSprite.y = 20;
		hornSprite.scale.x = 0.5;
		hornSprite.scale.y = 0.5;
		hornSprite.buttnMode = true;
		hornSprite.interactive = true;
		mainContainer.addChild(hornSprite);
		hornSprite.on("pointerdown", () => {
			if (bgMusic.paused) {
				console.log('++++++++++++')
				hornSprite.texture = hornImgTexture;
				bgMusic.play();
				bgMusic.paused = false;

			} else {
				bgMusic.stop();
				hornSprite.texture = hornNoImgTexture;
				bgMusic.paused = true;
			}

		});
		hornSprite.visible = false;



		let heroPlane = new HeroPlane(myPlanTexture);
		mainContainer.addChild(heroPlane);





		const checkHit = () => {
			for (var i = 0; i < enemys.length; i++) {
				if (enemys[i] && heroPlane && util.isHit(enemys[i], heroPlane)) {
					mainContainer.removeChild(enemys[i]);
					enemys.splice(i, 1);
					mainContainer.removeChild(heroPlane);
					mainContainer.visible = false;
					for (let i = 0; i < bullets.length; i++) {
						mainContainer.removeChild(bullets[i]);

					}

					bullets = [];
					isDead = true;
				}
				for (var j = 0; j < bullets.length; j++) {
					if (enemys[i] && bullets[j] && util.isHit(enemys[i], bullets[j])) {

						mainContainer.removeChild(bullets[j]);
						bullets.splice(j, 1);
						j--;

						enemys[i].blood -= 20
						if (enemys[i].blood <= 0) {
							enemys[i].boom().then(data => {
								mainContainer.removeChild(data);
							});
							scoreNow += enemys[i].score;
							scoreText.text = `Score:${scoreNow}`;

							enemys.splice(i, 1);
							i--;

						}


					}

				}


			}



		}


		app.ticker.add(() => {

			if (!mainContainer.visible || isDead) {
				window.clearInterval(producingEnemyTimer)
				return;
			}
			bgTiling.position.y += 2;
			if (bgTiling.position.y >= app.renderer.height) {
				bgTiling.position.y = app.renderer.height / 2;
			}

			producingBullet(myBulletTexture, heroPlane.x - myBulletTexture.width / 2, heroPlane.y - myBulletTexture.height / 2 - 30, [0, 0], mainContainer);
			checkHit()

			if (first) {

				first = false
			} else {

			}



		})



	});


class Bg extends PIXI.Sprite {
	constructor(texture, width, height, x, y, anchor) {
		super(texture);
		this.width = width;
		this.height = height;
		this.x = x;
		this.y = y;
		this.anchor.set(anchor[0], anchor[1])
	}
}

class HeroPlane extends PIXI.extras.AnimatedSprite {
	constructor(texture) {
		let cutnum = 2;
		let mwidth = parseInt(texture.width / cutnum);
		let mheight = parseInt(texture.height);
		let frameArray = [];
		let myPlan;
		for (let i = 0; i < cutnum; i++) {
			let rectangle = new PIXI.Rectangle(i * mwidth, 0, mwidth, mheight);
			let frame = new PIXI.Texture(texture, rectangle);
			frameArray.push(frame);
		}
		super(frameArray);
		this.width = mwidth;
		this.height = mheight;
		this.animationSpeed = parseFloat((20 / 120).toFixed(2));
		this.play();
		this.buttonMode = true;
		this.interactive = true;
		this.x = app.renderer.width / 2;
		this.y = app.renderer.height - this.height - 40;
		this.anchor.set(0.5);
		this.dragging = false;
		this.on('pointerdown', this.pointerdown);
		this.on('pointermove', this.pointermove);
		this.on('pointerup', this.pointerup);

	}
	pointerdown() {
		this.dragging = true;
	}
	pointermove(e, texture) {
		if (e.currentTarget && this.dragging) {
			var position = { x: e.data.global.x, y: e.data.global.y };
			if (e.data.global.x <= this.width / 2) {// 防止英雄级出x轴边界
				position.x = this.width / 2;
			} else if (e.data.global.x + this.width / 2 >= window.innerWidth) {
				position.x = window.innerWidth - this.width / 2;
			}
			if (e.data.global.y <= this.height / 2) {// 防止英雄级出x轴边界
				position.y = this.height / 2;
			} else if (e.data.global.y + this.height / 2 >= window.innerHeight) {
				position.y = window.innerHeight - this.height / 2;
			}
			e.currentTarget.x = position.x;
			e.currentTarget.y = position.y;
		}
	}
	pointerup() {
		this.dragging = false;
	}

}

//创建子弹

class BulletFactory extends PIXI.Sprite {
	constructor(texture, x, y, anchor) {
		super(texture)
		this.anchor.set(anchor[0], anchor[1])
		this.x = x;
		this.y = y;
	}

	fly() {
		this.y -= bullerSpeed * 20;
	}
}

const producingBullet = (texture, x, y, anchor, container) => {
	var bullet = new BulletFactory(texture, x, y, anchor, container);
	bullets.push(bullet);
	container.addChild(bullet);
	for (var i = 0; i < bullets.length; i++) {
		bullets[i].fly();
		if (bullets[i].y <= -100) {
			bullets.splice(i, 1);
			container.removeChild(bullets[i]);
		}
	}
}

const producingEnemys = (textures, container) => {

	window.clearInterval(producingEnemyTimer)

	producingEnemyTimer = setInterval(() => {

		if (scoreNow <= 2000) {

			var a = [textures[0]];
		} else if (scoreNow > 2000 && scoreNow <= 6000) {
			var a = [
				textures[0], textures[0], textures[0], textures[0], textures[0], textures[0],
				textures[1], textures[1], textures[1]];
		} else if (scoreNow >= 10000) {

			var a = [textures[2]]//大boss 可移动

		} else {
			var a = [
				textures[0], textures[0], textures[0], textures[0], textures[0], textures[0],
				textures[1], textures[1], textures[1],
				textures[2]];
		}

		var len = a.length;
		for (var i = 0; i < len - 1; i++) {
			var index = parseInt(Math.random() * (len - i));
			var temp = a[index];
			a[index] = a[len - i - 1];
			a[len - i - 1] = temp;
		}
		console.log(a);

		if (scoreNow >= 10000) {

			var enemy = new EnemyFactory(textures[2], util.random(textures[2].width / 2, window.innerWidth - textures[2].width / 2), -textures[2].height, [0.5, 0.5], {
				speed: 3,
				type: 3,
				blood: 10000,
				score: 1000
			}, container);
		} else {
			if (a[0].textureCacheIds[0] == 'small.png') {
				var enemy = new EnemyFactory(textures[0], util.random(textures[0].width / 2, window.innerWidth - textures[0].width / 2), -textures[0].height, [0.5, 0.5], {
					speed: 3,
					type: 0,
					blood: 100,
					score: 100
				}, container);
			}
			if (a[0].textureCacheIds[0] == 'middle.png') {
				var enemy = new EnemyFactory(textures[1], util.random(textures[1].width / 2, window.innerWidth - textures[1].width / 2), -textures[1].height, [0.5, 0.5], {
					speed: 2,
					type: 1,
					blood: 300,
					score: 300
				}, container);
			}
			if (a[0].textureCacheIds[0] == 'big.png') {
				var enemy = new EnemyFactory(textures[2], util.random(textures[2].width / 2, window.innerWidth - textures[2].width / 2), -textures[2].height, [0.5, 0.5], {
					speed: 1,
					type: 2,
					blood: 600,
					score: 600
				}, container);
			}
		}


		console.log(enemy);
		var hasBoos = false;
		enemys.map(it => {
			if (it.type == 3) {
				hasBoos = true
			}
		})

		if (!hasBoos) {

			enemys.push(enemy);
			container.addChild(enemy);
		}

		else if (enemys.length < 2) {
			window.clearInterval(producingEnemyTimer)
		}



		for (var i = 0; i < enemys.length; i++) {
			if (enemys[i].type == 3) {
				enemys[i].flx();

			} else {
				enemys[i].fly();

			}

			if (enemys[i].y >= window.innerHeight) {
				enemys.splice(i, 1);
				container.removeChild(enemys[i]);
			}
		}
	}, 80)
	console.log('++++++++++')

}

class EnemyFactory extends PIXI.Sprite {
	constructor(texture, x, y, anchor, option, container) {
		super(texture)
		this.anchor.set(anchor[0], anchor[1])
		this.x = x;
		this.y = y;
		this.cutnum = [4, 4, 6, 6];
		this.moviespeed = [0.5, 0.5, 0.5, 0.5];
		this.container = container;
		this.boomTextures = [smallPlanBoomTexture,
			middlePlanBoomTexture,
			bigPlanBoomTexture, bigPlanBoomTexture]
		console.log(option)
		for (let k in option) {
			this[k] = option[k]
		}

	}

	fly() {
		this.y += this.speed * speedUp;
	}
	flx() {
		this.x += this.speed * speedUp;
		this.y = this.height / 1.2;
		if (this.x + this.width / 2 >= window.innerWidth || this.x <= this.width / 2) {
			this.speed = -this.speed;
		}
	}
	async boom() {
	
		var x = this.x;
		var y = this.y;
		var type = this.type;
		var width = this.texture.width;
		var height = this.texture.height;
		var frameArray = [];
		for (var z = 0; z < this.cutnum[type]; z++) {
			var rectangle = new PIXI.Rectangle((z * width), 0, width, height);
			var frame = new PIXI.Texture(this.boomTextures[type], rectangle);
			frameArray.push(frame);
		}

		//播放动画

		var movieClip = new PIXI.extras.AnimatedSprite(frameArray);

		movieClip.animationSpeed = parseFloat(this.cutnum[type] * 10 / 120).toFixed(2);
		movieClip.speed = this.moviespeed[type];
		movieClip.isboom = true;
		movieClip.x = x;
		movieClip.y = y;
		movieClip.anchor.set(0.5);
		movieClip.animationSpeed = parseFloat((20 / 120).toFixed(2));
		console.log(movieClip.onComplete);
		this.container.removeChild(this);
		this.container.addChild(movieClip);
		movieClip.play();
		movieClip.onComplete=()=>{
			console.log('++++++++++++')
			this.container.removeChild(movieClip);
		}
		// setTimeout(() => {
			
		// }, 500)



	}
}




