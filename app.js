'use strict';
// ファイルを読み込む
const fs = require('fs');
const readline = require('readline');
const rs = fs.ReadStream('./popu-pref.csv');
const rl = readline.createInterface({'input': rs, 'output': {}});
const prefectureDataMap = new Map();  // key: 都道府県 value: 集計データのオブジェクト
rl.on('line', (lineString) => {
  const columns = lineString.split(',');
  const year = parseInt(columns[0]);
  const prefecture = columns[2];
  const popu = parseInt(columns[7]);
  if(year == 2010 || year == 2015){
    let value = prefectureDataMap.get(prefecture);
    if(!value){
      value = {
        popu10: 0,
        popu15: 0,
        change: null
      };
    }
    if(year == 2010){
      value.popu10 += popu;
    }
    if(year == 2015){
      value.popu15 += popu;
    }
    prefectureDataMap.set(prefecture, value);
  }
});
// 全ての行が読み込み終わったときに呼び出される
rl.on('close', () => {
  for(let [key, value] of prefectureDataMap){
    value.change = value.popu15 / value.popu10;
  }
  // 変化率の降順になるように整列させる
  const rankingArray = Array.from(prefectureDataMap).sort((pair1, pair2) => {
    return pair2[1].change - pair1[1].change;
  });
  // 出力のフォーマットを整える
  const rankingStrings = rankingArray.map(([key, value]) => {
    return key + ': ' + value.popu10 + '=>' + value.popu15 + ' 変化率:' + value.change;
  });
  console.log(rankingStrings);
});