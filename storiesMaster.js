const { spawn } = require('child_process')
const fs = require('fs');
const data = require('./stories.json');

let realtime = true;
process.argv.map(item => {
  if(item == '--headlessRender'){
    realtime = false;
  }
});

// ffmpeg -r 60 -y -f image2 -i seq/%04d.png -crf libx264 -crf 25 -pix_fmt yuv420p out/video.mp4
// node stories.js | glslViewer stories.frag -w 1920 -h 1080 -l assets/test2.png > /dev/null 2>&1

let files = fs.readdirSync('./storiesAssets/');
files = files.map(item => {
  if(item.includes('png')){
    return `storiesAssets/${item}`;
  }
});
files = files.join(' ');

console.log(files);

// process.exit();

// const command = `stories.frag -w 1920 -h 1080 -l assets/test2.png > /dev/null 2>&1`;
const command = `stories.frag -w 1920 -h 1080 -l ${files} > /dev/null 2>&1`;
console.log(command.split(' '));
const stories = spawn('node', [ 'stories.js']);

const glslViewer = spawn('glslViewer', command.split(' '));

stories.stdout.pipe(glslViewer.stdin);

stories.on('exit', code => {
  console.log(`stories.js exited with code: ${code}`);
  glslViewer.stdin.pause();
  glslViewer.kill();
});
