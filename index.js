const gsap = require('gsap');
const { spawn } = require('child_process')

// ffmpeg -r 60 -f image2 -i seq/%04d.png -crf libx264 -crf 25 -pix_fmt yuv420p out/video.mp4

// var tl = new TimelineMax({repeat:2, repeatDelay:1});
// tl.pause();

const o = {
  value: 0.0
};
let tween = new TweenMax.to(o, 1.0, {
  value: 500.0,
  repeat: 1,
  yoyo: true,
  onComplete: function(){
  }
})

tween.paused(true);

// realtime:
// TweenMax.ticker.addEventListener("tick", render);

// non-realtime
let i = 0;
render();
function render() {
  // realtime:
  // process.stdout.write(`u_temp,${Math.trunc(o.value)}.\n`);

  const frameName = String(i).padStart(4, '0');
  const u_temp = spawn('echo', [`u_temp,${Math.trunc(o.value)}.`]);

  const glslViewer = spawn('glslViewer', [
    '07shapes04.frag',
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
    render();
  });

  i++;
}

