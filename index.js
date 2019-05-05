const gsap = require('gsap');
const { spawn } = require('child_process')

let realtime = true;
process.argv.map(item => {
  if(item == '--headlessRender'){
    realtime = false;
  }
});

// ffmpeg -r 60 -f image2 -i seq/%04d.png -crf libx264 -crf 25 -pix_fmt yuv420p out/video.mp4
// node index.js | glslViewer 07shapes05.frag -w 500 -h 500 -l assets/test2.png > /dev/null 2>&1


// var tl = new TimelineMax({repeat:2, repeatDelay:1});
// tl.pause();

const o = {
  value: 0.0
};
let tween = new TweenMax.to(o, 1.0, {
  value: 500.0,
  repeat: 0,
  yoyo: true,
  onComplete: function(){
    process.exit();
  }
})

if(!realtime) {
  tween.paused(true);
  stepRender();
}

if(realtime) {
  TweenMax.ticker.addEventListener("tick", render);
}

function render() {
  process.stdout.write(`u_temp,${Math.trunc(o.value)}.\n`);
}

let i = 0;
function stepRender() {
  const frameName = String(i).padStart(4, '0');
  const u_temp = spawn('echo', [`u_temp,${Math.trunc(o.value)}.`]);

  const glslViewer = spawn('glslViewer', [
    '07shapes05.frag',
    '-w',
    '1920',
    '-h',
    '1080',
    '--headless',
    '-s',
    '1',
    '-o',
    `seq/${frameName}.png`
  ]);

  u_temp.stdout.pipe(glslViewer.stdin);
  glslViewer.on('exit', code => {
    console.log(`Exit code is: ${code}`);
    tween.seek(i/60.0);
    stepRender();
  });

  i++;
}

