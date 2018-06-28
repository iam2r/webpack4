import 'babel-polyfill';
import axios from 'axios';
import { Storage, isSessionExpired } from "./tools/utils";
import config from "./config";
import * as PIXI from 'pixi.js';

axios.defaults.baseURL = config.apiUrl;
// The application will create a renderer using WebGL, if possible,
// with a fallback to a canvas render. It will also setup the ticker
// and the root stage PIXI.Container
const app = new PIXI.Application({
  width: 256,         // default: 800
  height: 256,        // default: 600
  antialias: true,    // default: false
  transparent: false, // default: false
  resolution: 1,     // default: 1
  backgroundColor: 0x1099bb,
});

//颜色覆盖
// app.renderer.backgroundColor = 	0x228B22;

console.log(app.renderer.view.width);
console.log(app.renderer.view.height);
// app.renderer.autoResize = true;
app.renderer.resize(512, 512);

app.renderer.view.style = {
  position: "absolute",
  display: "block"
}
app.renderer.autoResize = true;
app.renderer.resize(window.innerWidth, window.innerHeight);


// The application will create a canvas element for you that you
// can then insert into the DOM
const App = document.getElementById('app');
App.appendChild(app.view);

// PIXI.loader
//   .add('fighter', 'static/assets/basics/fighter.json')
//   .add('cat', 'static/assets/basics/cat.png')
//   .add('tiling', 'static/assets/p2.jpeg')
//   .on("progress", (loader, resource) => {
//     //Display the file `url` currently being loaded
//     console.log("loading: " + resource.url);

//     //Display the percentage of files currently loaded
//     console.log("progress: " + loader.progress + "%");

//     //If you gave your files names as the first argument
//     //of the `add` method, you can access them like this
//     //console.log("loading: " + resource.name);
//   })
//   .load((loader, resources) => {
//     console.log("All files loaded");
//     console.log(resources)
//     // for (let key in resources) {
//     //   if(resources[key].texture){
//     //     continue
//     //   }else{
//     //     resources[key].texture = PIXI.Texture.fromVideo(resources[key].url)
//     //   }
//     // }






//     //===============================================Basics
//     // const cat = new PIXI.Sprite(resources.cat.texture);
//     // cat.x = app.screen.width / 2;
//     // cat.y = app.screen.height / 2;
//     // // cat.anchor.set(0.5)
//     // cat.anchor.x = 0.5;
//     // cat.anchor.y = 0.5;
//     // app.stage.addChild(cat);
//     // app.ticker.add((delta) => {
//     //   cat.rotation += 0.1 * delta;
//     // });




















//     //===============================================Container

//     //   const container = new PIXI.Container();
//     //   app.stage.addChild(container);
//     //   const texture = PIXI.Texture.fromImage(catpng);
//     //   for (let i = 0; i < 25; i++) {
//     //     const cat = new PIXI.Sprite(texture);
//     //     cat.anchor.set(0.5);
//     //     cat.x = (i % 5) * 80;
//     //     cat.y = Math.floor(i / 5) * 80;
//     //     container.addChild(cat);
//     //     // app.ticker.add((delta) => {
//     //     //   cat.rotation += 0.1 * delta;
//     //     // });

//     //   }
//     // //设置位置
//     //   container.position.set((app.renderer.width - container.width) / 2,(app.renderer.height - container.height) / 2)
//     // //设置容器旋转中心
//     //   container.pivot.x = container.width / 2;
//     //   container.pivot.y = container.height / 2;

//     //   app.ticker.add((delta) => {
//     //     container.rotation -= 0.01 * delta;
//     //   });


















//     //SpriteSheet Animation===============================================
//     // // create an array of textures from an image path
//     // var frames = [];

//     // for (var i = 0; i < 30; i++) {
//     //   var val = i < 10 ? '0' + i : i;

//     //   // magically works since the spritesheet was loaded with the pixi loader

//     //   // frames.push(PIXI.Texture.fromFrame('rollSequence00' + val + '.png'));
//     //   frames.push(resources.fighter.textures[`rollSequence00${val}.png`])
//     // }
//     // console.log(frames);
//     // //纹理对象数组

//     // // create an AnimatedSprite (brings back memories from the days of Flash, right ?)
//     // var anim = new PIXI.extras.AnimatedSprite(frames);

//     // /*
//     //  * An AnimatedSprite inherits all the properties of a PIXI sprite
//     //  * so you can change its position, its anchor, mask it, etc
//     //  */
//     // anim.x = app.screen.width / 2;
//     // anim.y = app.screen.height / 2;
//     // anim.anchor.set(0.5);
//     // anim.animationSpeed = 0.5;
//     // anim.play();

//     // app.stage.addChild(anim);

//     // // Animate the rotation
//     // app.ticker.add(function () {
//     //   anim.rotation += 0.01;
//     // });




//     //Click======================================================================
//     // //根据纹理创精灵
//     // const cat = new PIXI.Sprite(resources.cat.texture);
//     // // Set the initial position

//     // cat.anchor.set(0.5);
//     // cat.x = app.screen.width / 2;
//     // cat.y = app.screen.height / 2;

//     // // Opt-in to interactivity
//     // cat.interactive = true;

//     // // Shows hand cursor
//     // cat.buttonMode = true;

//     // // Pointers normalize touch and mouse
//     // cat.on('pointerdown', () => {
//     //   cat.scale.set(1.25,1.25);
//     // });

//     // // Alternatively, use the mouse & touch events:
//     // // cat.on('click', onClick); // mouse-only
//     // // cat.on('tap', onClick); // touch-only

//     // app.stage.addChild(cat);



//     //Tiling Sprite=============================================================
//     // //资源纹理化
//     // const tilingtexture = resources.tiling.texture;
//     // //根据纹理创对应的精灵，这里是tilingSprite
//     // const tilingSprite = new PIXI.extras.TilingSprite(
//     //   tilingtexture,
//     //   app.screen.width,
//     //   app.screen.height
//     // );
//     // //让精灵上舞台
//     // app.stage.addChild(tilingSprite);
//     // //给精灵指令让它动起来
//     // let count = 0;

//     // app.ticker.add(() => {
//     //   count += 0.005;
//     //   tilingSprite.tileScale.set(2 + Math.sin(count), 2 + Math.cos(count))
//     //   tilingSprite.tilePosition.x += 1;
//     //   tilingSprite.tilePosition.y += 1;
//     // });




//     //Text ====================================================================
//     //   var richText = new PIXI.Text('Rich text with a lot of options and across multiple lines', new PIXI.TextStyle({
//     //     fontFamily: 'Arial',
//     //     fontSize: 36,
//     //     fontStyle: 'italic',
//     //     fontWeight: 'bold',
//     //     fill: ['#ffffff', '#00ff99'], // gradient
//     //     stroke: '#4a1850',
//     //     strokeThickness: 5,
//     //     dropShadow: true,
//     //     dropShadowColor: '#000000',
//     //     dropShadowBlur: 4,
//     //     dropShadowAngle: Math.PI / 6,
//     //     dropShadowDistance: 6,
//     //     wordWrap: true,
//     //     wordWrapWidth: 440
//     //   }));
//     //   richText.x = 30;
//     //   richText.y = 180;
//     //   app.stage.addChild(richText);





//     //Graphics============================================================
//     // const graphics = new PIXI.Graphics();
//     // // set a fill and line style


//     // //选笔
//     // graphics.lineStyle(4, 0xffd900, 1);
//     // //填充开始
//     // graphics.beginFill(0xFF3300);
//     // // draw a shape
//     // //落笔
//     // graphics.moveTo(50, 50);
//     // //移动
//     // graphics.lineTo(250, 50);
//     // graphics.lineTo(100, 100);
//     // graphics.lineTo(50, 50);
//     // //填充结束
//     // graphics.endFill();

//     // // set a fill and a line style again and draw a rectangle
//     // graphics.lineStyle(2, 0x0000FF, 1);
//     // graphics.beginFill(0xFF700B, 1);
//     // graphics.drawRect(50, 250, 120, 120);


//     // // draw a circle, set the lineStyle to zero so the circle doesn't have an outline
//     // graphics.lineStyle(0);
//     // graphics.beginFill(0xFFFF0B, 0.5);
//     // graphics.drawCircle(470, 310, 60);
//     // graphics.endFill();


//     // app.stage.addChild(graphics);



//     //Video=================================================
//     // // Create play button that can be used to trigger the video
//     // var button = new PIXI.Graphics()
//     //   .beginFill(0x0, 0.5)
//     //   .drawRoundedRect(0, 0, 100, 100, 10)
//     //   .endFill()
//     //   .beginFill(0xffffff)
//     //   .moveTo(36, 30)
//     //   .lineTo(36, 70)
//     //   .lineTo(70, 50);

//     // // Position the button
//     // button.x = (app.screen.width - button.width) / 2;
//     // button.y = (app.screen.height - button.height) / 2;

//     // // Enable interactivity on the button
//     // button.interactive = true;
//     // button.buttonMode = true;

//     // // Add to the stage
//     // app.stage.addChild(button);

//     // // Listen for a click/tap event to start playing the video
//     // // this is useful for some mobile platforms. For example:
//     // // ios9 and under cannot render videos in PIXI without a
//     // // polyfill - https://github.com/bfred-it/iphone-inline-video
//     // // ios10 and above require a click/tap event to render videos
//     // // that contain audio in PIXI. Videos with no audio track do
//     // // not have this requirement
//     // button.on('pointertap', () => {

//     //   // Don't need the button anymore
//     //   button.destroy();

//     //   // create a video texture from a path

//     //   const texture = resources.testVideo.texture
//     //   // 视频的resources.testVideo无texture属性
//     //   // var texture = PIXI.Texture.fromVideo('static/assets/testVideo.mp4');


//     //   // create a new Sprite using the video texture (yes it's that easy)
//     //   var videoSprite = new PIXI.Sprite(texture);

//     //   // Stetch the fullscreen
//     //   videoSprite.width = app.screen.width;
//     //   videoSprite.height = app.screen.height;

//     //   app.stage.addChild(videoSprite);
//     // });

//     //RenderTexture============================================================
//     //   let container = new PIXI.Container();
//     //   app.stage.addChild(container);
//     //   const texture = PIXI.Texture.fromImage('static/assets/basics/cat.png');
//     //   // let cat = new PIXI.Sprite(texture);
//     //   // container.addChild(cat);
//     //   for (let i = 0; i < 25; i++) {
//     //     let cat = new PIXI.Sprite(texture);
//     //     cat.x = i % 5 * 80;
//     //     cat.y = Math.floor(i / 5) * 80;
//     //     cat.anchor.set(0.5);
//     //     cat.rotation = Math.random() * (Math.PI * 2)
//     //     container.addChild(cat);


//     //   }


//     //   var brt = new PIXI.BaseRenderTexture(300, 300, PIXI.SCALE_MODES.LINEAR, 1);
//     //   var rt = new PIXI.RenderTexture(brt);

//     //   var sprite = new PIXI.Sprite(rt);

//     //   sprite.x = 450;
//     //   sprite.y = 60;
//     //   app.stage.addChild(sprite);
//     //   // container.pivot.set(container.width/2,container.height/2);s
//     //   container.position.set(app.renderer.width / 2 - container.width / 2, app.renderer.height / 2 - container.height / 2)
//     //   app.ticker.add(function() {
//     //     app.renderer.render(container, rt);
//     // });

//     //TexturedMesh=============================================================
//     // var count = 0;
//     // var ropeLength = 45;
//     // var points = [];
//     // for (let i = 0; i < 25; i++) {
//     //   points.push(new PIXI.Point(i * ropeLength, 0));

//     // }
//     // console.log(points)
//     // var strip = new PIXI.mesh.Rope(PIXI.Texture.fromImage('static/assets/snake.png'), points);

//     // strip.x = -40;
//     // strip.y = 300;

//     // app.stage.addChild(strip);
//     // var g = new PIXI.Graphics();
//     // g.x = strip.x;
//     // g.y = strip.y;
//     // app.stage.addChild(g);
//     // // start animating
//     // app.ticker.add(function () {

//     //   count += 0.1;

//     //   // make the snake
//     //   for (var i = 0; i < points.length; i++) {
//     //     points[i].y = Math.sin((i * 0.5) + count) * 30;
//     //     points[i].x = i * ropeLength + Math.cos((i * 0.3) + count) * 20;
//     //   }
//     //   renderPoints();
//     // });

//     // function renderPoints() {

//     //   g.clear();

//     //   g.lineStyle(2, 0xffc2c2);
//     //   g.moveTo(points[0].x, points[0].y);

//     //   for (var i = 1; i < points.length; i++) {
//     //     g.lineTo(points[i].x, points[i].y);
//     //   }

//     //   for (var i = 1; i < points.length; i++) {
//     //     g.beginFill(0xff0022);
//     //     g.drawCircle(points[i].x, points[i].y, 10);
//     //     g.endFill();
//     //   }
//     // }
//   });


//   // Create background image
// var background = PIXI.Sprite.fromImage("static/assets/bkg-grass.jpg");
// background.width = app.screen.width;
// background.height = app.screen.height;
// app.stage.addChild(background);

// // Stop application wait for load to finish
// app.stop();

// PIXI.loader.add('shader', 'static/assets/basics/shader.frag')
//     .load(onLoaded);

// var filter;

// // Handle the load completed
// function onLoaded (loader,res) {

//     // Create the new filter, arguments: (vertexShader, framentSource)
//     filter = new PIXI.Filter(null, res.shader.data);

//     // Add the filter
//     background.filters = [filter];

//     // Resume application update
//     app.start();
// }

// // Animate the filter
// app.ticker.add(function(delta) {
//     filter.uniforms.customUniform += 0.04 * delta;
// });






// app.stop();

// PIXI.loader
//     .add('spritesheet', 'required/assets/mc.json')
//     .load(onAssetsLoaded);

// function onAssetsLoaded() {

//     // create an array to store the textures
//     var explosionTextures = [],
//         i;

//     for (i = 0; i < 26; i++) {
//          var texture = PIXI.Texture.fromFrame('Explosion_Sequence_A ' + (i+1) + '.png');
//          explosionTextures.push(texture);
//     }

//     for (i = 0; i < 50; i++) {
//         // create an explosion AnimatedSprite
//         var explosion = new PIXI.extras.AnimatedSprite(explosionTextures);

//         explosion.x = Math.random() * app.screen.width;
//         explosion.y = Math.random() * app.screen.height;
//         explosion.anchor.set(0.5);
//         explosion.rotation = Math.random() * Math.PI;
//         explosion.scale.set(0.75 + Math.random() * 0.5);
//         explosion.gotoAndPlay(Math.random() * 27);
//         app.stage.addChild(explosion);
//     }

//     // start animating
//     app.start();
// }


// app.stop();

// PIXI.loader
//     .add('spritesheet', 'required/assets/0123456789.json')
//     .load(onAssetsLoaded);

// function onAssetsLoaded(loader, resources) {

//     // create an array to store the textures
//     var textures = [],
//         i;

//     for (i = 0; i < 10; i++) {
//          var framekey = '0123456789 ' + i + '.ase';
//          var texture = PIXI.Texture.fromFrame(framekey);
//          var time = resources.spritesheet.data.frames[framekey].duration;
//          textures.push({ texture, time });
//     }

//     var scaling = 4;

//     // create a slow AnimatedSprite
//     var slow = new PIXI.extras.AnimatedSprite(textures);
//     slow.anchor.set(0.5);
//     slow.scale.set(scaling);
//     slow.animationSpeed = 0.5;
//     slow.x = (app.screen.width - slow.width) / 2;
//     slow.y = app.screen.height / 2;
//     slow.play();
//     app.stage.addChild(slow);

//     // create a fast AnimatedSprite
//     var fast = new PIXI.extras.AnimatedSprite(textures);
//     fast.anchor.set(0.5);
//     fast.scale.set(scaling);
//     fast.x = (app.screen.width + fast.width) / 2;
//     fast.y = app.screen.height / 2;
//     fast.play();
//     app.stage.addChild(fast);

//     // start animating
//     app.start();
// }


//Get the texture for rope.
var trailTexture = PIXI.Texture.fromImage('required/assets/trail.png')
var historyX = [];
var historyY = [];
//historySize determines how long the trail will be.
var historySize = 20;
//ropeSize determines how smooth the trail will be.
var ropeSize = 100;
var points = [];

//Create history array.
for( var i = 0; i < historySize; i++)
{
	historyX.push(0);
	historyY.push(0);
}
//Create rope points.
for(var i = 0; i < ropeSize; i++)
{
	points.push(new PIXI.Point(0,0));
}

//Create the rope
var rope = new PIXI.mesh.Rope(trailTexture, points);

//Set the blendmode
rope.blendmode = PIXI.BLEND_MODES.ADD;

app.stage.addChild(rope);

// Listen for animate update
app.ticker.add(function(delta) {
	//Read mouse points, this could be done also in mousemove/touchmove update. For simplicity it is done here for now.
	//When implemeting this properly, make sure to implement touchmove as interaction plugins mouse might not update on certain devices.
	var mouseposition = app.renderer.plugins.interaction.mouse.global;
	
	//Update the mouse values to history
	historyX.pop();
	historyX.unshift(mouseposition.x);
	historyY.pop();
	historyY.unshift(mouseposition.y);
	//Update the points to correspond with history.
	for( var i = 0; i < ropeSize; i++)
	{
		var p = points[i];
		
		//Smooth the curve with cubic interpolation to prevent sharp edges.
		var ix = cubicInterpolation( historyX, i / ropeSize * historySize);
		var iy = cubicInterpolation( historyY, i / ropeSize * historySize);
		
		p.x = ix;
		p.y = iy;
		
	}
});

/**
 * Cubic interpolation based on https://github.com/osuushi/Smooth.js
 * @param	k
 * @return
 */
function clipInput(k, arr)
{
	if (k < 0)
		k = 0;
	if (k > arr.length - 1)
		k = arr.length - 1;
	return arr[k];
}

function getTangent(k, factor, array)
{
	return factor * (clipInput(k + 1, array) - clipInput(k - 1,array)) / 2;
}

function cubicInterpolation(array, t, tangentFactor)
{
	if (tangentFactor == null) tangentFactor = 1;
	
	var k = Math.floor(t);
	var m = [getTangent(k, tangentFactor, array), getTangent(k + 1, tangentFactor, array)];
	var p = [clipInput(k,array), clipInput(k+1,array)];
	t -= k;
	var t2 = t * t;
	var t3 = t * t2;
	return (2 * t3 - 3 * t2 + 1) * p[0] + (t3 - 2 * t2 + t) * m[0] + ( -2 * t3 + 3 * t2) * p[1] + (t3 - t2) * m[1];
}