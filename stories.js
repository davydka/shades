const gsap = require('gsap');
const { spawn } = require('child_process')

let realtime = true;
process.argv.map(item => {
  if(item == '--headlessRender'){
    realtime = false;
  }
});

// ffmpeg -r 60 -y -f image2 -i seq/%04d.png -crf libx264 -crf 25 -pix_fmt yuv420p out/video.mp4
// node stories.js | glslViewer stories.frag -w 1920 -h 1080 -l storiesAssets/emoji-1.lowres.png > /dev/null 2>&1


var tl = new TimelineMax({});
tl.pause();

const holder = {val: 0.0};
tl.to(holder, 10.0, {
  value: 100.0,
  onComplete: function(){
    console.log('************************ DONE!');
    process.exit();
  }
});

const circle1 = {pos: -2000.0};
tl.to(circle1, 1.0, {pos: 540.0}, 0);

const tex0 = {
  x: 480.0,
  y: 300.0,
  scale: 0.0
};
tl.to(tex0, 0.5, {
  x: 480.0,
  y:300.0,
  scale: 50.0
}, 0.5);

setTimeout(() => {
  tl.play();
}, 500);

TweenMax.ticker.addEventListener("tick", render);

process.stdout.write(`u_circle1,${Math.trunc(circle1.pos)}.\n`);

process.stdout.write(`u_tex0posx,${Math.trunc(tex0.x)}.\n`);
process.stdout.write(`u_tex0posy,${Math.trunc(tex0.y)}.\n`);
process.stdout.write(`u_tex0scale,${Math.trunc(tex0.scale)}.\n`);

process.stdout.write(`u_alpha,1.\n`);
function render() {
  process.stdout.write(`u_circle1,${Math.trunc(circle1.pos)}.\n`);

  process.stdout.write(`u_tex0posx,${Math.trunc(tex0.x)}.\n`);
  process.stdout.write(`u_tex0posy,${Math.trunc(tex0.y)}.\n`);
  process.stdout.write(`u_tex0scale,${Math.trunc(tex0.scale)}.\n`);
}

