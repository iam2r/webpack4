import 'babel-polyfill';
import axios from 'axios';
import { Storage, isSessionExpired, inheritPrototype } from "./tools/utils";
import config from "./config";
import util from "./util";
import * as PIXI from 'pixi.js';
// 创建一个渲染器，自动选择WebGL方式或者Canvas，WebGL优先
var renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight);
var readyStage = new PIXI.Container();// 创建一个舞台
var endStage = new PIXI.Container();// 创建一个舞台
var stage = new PIXI.Container();// 创建一个舞台
document.body.appendChild(renderer.view);// 添加到DOM树中d

// 渲染器占满整个屏幕
renderer.view.style.position = "absolute";
renderer.view.style.display = "block";
renderer.autoResize = true;
renderer.resize(window.innerWidth, window.innerHeight);

// 读取静态资源，并注册一个回调函数
PIXI.loader
	.add("start", "images/start.png")
	.add("background", "images/background_1.jpg")
	.add("end", "images/end.png")
	.add("hero", "images/hero.png")
	.add("enemy1", "images/enemy.png")
	.add("bullet1", "images/bullet.png")
	.load((loader, res) => {
		/* -----------------创建背景并设置宽高占满整个屏幕----------------- */
		background = new PIXI.Sprite(
			PIXI.loader.resources.background.texture
		);
		background.width = window.innerWidth;
		background.height = window.innerHeight;
		startIcon = new PIXI.Sprite(
			PIXI.loader.resources.start.texture
		);
		startIcon.width = 300;
		startIcon.height = 151;
		startIcon.anchor.set(0.5);
		startIcon.x = window.innerWidth / 2;
		startIcon.y = window.innerHeight / 2;
		/* -----------------创建背景结束----------------- */
		readyStage.addChild(background);
		readyStage.addChild(startIcon);
		readyStage.interactive = true;
		readyStage.buttonMode = true;
		readyStage.on('pointerdown', function () {
			this.pointerDown = true;
		});
		readyStage.on('pointerup', function () {
			if (this.pointerDown) {
				this.pointerDown = false;
				start();
			}
		});

		endIcon = new PIXI.Sprite(
			PIXI.loader.resources.end.texture
		);
		endIcon.width = 300;
		endIcon.height = 400;
		endIcon.anchor.set(0.5);
		endIcon.x = window.innerWidth / 2;
		endIcon.y = window.innerHeight / 2;
		endStage.addChild(background);
		endStage.addChild(endIcon);
		endStage.interactive = true;
		endStage.buttonMode = true;
		endStage.on('pointerdown', function () {
			this.pointerDown = true;
		});
		endStage.on('pointerup', function () {
			if (this.pointerDown) {
				this.pointerDown = false;
				start();
			}
		});
		ready();
		animate();
	});

var background, startIcon, endIcon, hero, enemys, producingEnemyTimer, producingBulletTimer, bullets, state;// 声明所有元素



function ready() {// 游戏准备状态
	enemys = [];
	bullets = [];
	stage.removeChildren();
	state = 'ready';
	hero = null;
	stopProducingEnemy();
	stopProducingBullet();

	readyStage.addChild(background);
	readyStage.addChild(startIcon);
}

function start() {// 游戏开始状态
	enemys = [];
	bullets = [];
	stage.removeChildren();
	state = 'start';
	hero = new CreateHero();
	producingEnemy();
	producingBullet();

	stage.addChild(background);
	stage.addChild(hero);
}

function end() {// 游戏开始状态
	enemys = [];
	bullets = [];
	stage.removeChildren();
	state = 'end';
	hero = null;
	stopProducingEnemy();
	stopProducingBullet();

	endStage.addChild(background);
	endStage.addChild(endIcon);
}


function animate() {// 动画
	requestAnimationFrame(animate);
	if (state === 'ready') {
		renderer.render(readyStage);
	} else if (state === 'start') {
		for (var i = 0; i < enemys.length; i++) {// 将敌机遍历一边
			var enemy = enemys[i];
			enemy.fly();
			if (util.isHit(hero, enemy)) {
				//TODO 游戏结束
				end();
			}
		}
		for (var j = 0; j < bullets.length; j++) {
			var bullet = bullets[j];
			bullet.fly();
		}
		for (var i = 0; i < enemys.length; i++) {
			for (var j = 0; j < bullets.length; j++) {
				if (enemys[i] && bullets[j] && util.isHit(enemys[i], bullets[j])) {
					stage.removeChild(enemys[i]);
					enemys.splice(i, 1);
					stage.removeChild(bullets[j]);
					bullets.splice(j, 1);
					i--;
					j--;
				}
			}
		}
		renderer.render(stage);
	} else if (state === 'end') {
		// TODO 渲染结束界面
		renderer.render(endStage);
	}
}

function stopProducingEnemy() {
	window.clearInterval(producingEnemyTimer);
}

function producingEnemy() {
	producingEnemyTimer = setInterval(function () {
		var enemy = new EnemyFactory();
		enemys.push(enemy);
		stage.addChild(enemy);
	}, 200);// 每秒添加2个敌机进数组
}

function EnemyFactory() {
	PIXI.Sprite.call(this, PIXI.loader.resources.enemy1.texture);
	this.width = 30;
	this.height = 30;
	var position = {
		x: util.random(this.width / 2, window.innerWidth - this.width / 2),// 随机一个 （-敌机宽度~屏幕宽度）的X轴坐标
		y: -this.height
	};
	this.anchor.set(0.5);
	this.x = position.x;// 如果随机的X轴超出了屏幕范围则设置成0
	this.y = position.y;
	var random = util.random(5, 10);
	this.speed = random >= 9.5 ? 30 : random;// 随机一个下落速度
	this.type = 'enemy';
	this.fly = function () {
		this.y += this.speed / 4;
	}

}

inheritPrototype(EnemyFactory, PIXI.Sprite);



function BulletFactory() {
	PIXI.Sprite.call(this, PIXI.loader.resources.bullet1.texture);
	this.anchor.set(0.5);
	this.width = 10;
	this.height = 20;
	this.x = hero.x;
	this.y = hero.y - hero.height / 2;
	this.speed = 10;
	this.type = 'bullet';
	this.fly = function () {
		this.y -= this.speed;
	}
}
inheritPrototype(BulletFactory, PIXI.Sprite);



function producingBullet() {
	producingBulletTimer = setInterval(function () {
		var bullet = new BulletFactory();
		bullets.push(bullet);
		stage.addChild(bullet);
	}, 200);// 每秒添加2个子弹进数组
}

function stopProducingBullet() {
	window.clearInterval(producingBulletTimer);
}

function CreateHero() {// 英雄机生产方法
	PIXI.Sprite.call(this, PIXI.loader.resources.hero.texture)
	this.anchor.set(0.5);
	this.width = 60;
	this.height = 66;
	this.x = window.innerWidth / 2;
	this.y = window.innerHeight - this.height;
	this.interactive = true; // 开启事件
	this.dragging = false;
	this.on('pointerdown', function () {
		this.dragging = true;
	});
	this.on('pointermove', function (event) {
		if (event.currentTarget && this.dragging) {
			var position = { x: event.data.global.x, y: event.data.global.y };
			if (event.data.global.x <= this.width / 2) {// 防止英雄级出x轴边界
				position.x = this.width / 2;
			} else if (event.data.global.x + this.width / 2 >= window.innerWidth) {
				position.x = window.innerWidth - this.width / 2;
			}
			if (event.data.global.y <= this.height / 2) {// 防止英雄级出x轴边界
				position.y = this.height / 2;
			} else if (event.data.global.y + this.height / 2 >= window.innerHeight) {
				position.y = window.innerHeight - this.height / 2;
			}
			event.currentTarget.x = position.x;
			event.currentTarget.y = position.y;
		}
	});
	this.on('pointerup', function () {
		this.dragging = false;
	});
}
inheritPrototype(CreateHero, PIXI.Sprite);

