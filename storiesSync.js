const data = require('./stories.json');
const fs = require('fs');
const url = require('url');
const path = require('path');
const download = require('download');

const LOCAL_ASSETS_PATH = path.join(process.cwd(), 'assets');
let assetLedger = [];

data.payload.files.map(item => {
  if(
    (
      item.asset_path.includes('emoji')
      ||
      item.asset_path.includes('sticker')
    )
    &&
    item.asset_path.includes('lowres')
  ){
    // console.log(path.basename(item.asset_path));
    assetLedger.push(item);
  }
});

console.log('assetLedger.length:');
console.log(assetLedger.length);

assetLedger.map((asset, index) => {
  download(asset.download_url).then(data => {
    const filepath = path.join(LOCAL_ASSETS_PATH, path.basename(asset.asset_path));
    fs.writeFileSync(filepath, data);
    assetLedger.splice(index, 1);
    console.log("number assets remaining: ", assetLedger.length);

    if (assetLedger.length - 1 === 0) {
      console.log('~~~~~~~~ DONE!');
    }
  });
});
