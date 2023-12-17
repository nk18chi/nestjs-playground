const { performance } = require('perf_hooks');

/**
 * @return 本スクリプトを実行してからの経過秒数.
 */
const seconds = () => performance.now() / 1000;
const secondsPadded = () => seconds().toFixed(6).padStart(10, ' '); // 長さ揃える.

//////////////// 処理３つ ////////////////

/**
 * 処理 1 (非同期, 5 秒後に発火).
 */
const func1 = () => {
  console.log(`${secondsPadded()} seconds --> 処理 1 (非同期, 5 秒後に発火)`);
};

/**
 * 処理 2 (非同期, 0 秒後に発火).
 */
const func2 = () => {
  console.log(`${secondsPadded()} seconds --> 処理 2 (非同期, 0 秒後に発火)`);
};

/**
 * 処理 3 (同期. 10 秒かかる).
 */
const func3 = () => {
  while (seconds() < 10) {
    /* consuming a single cpu for 10 seconds... */
  }

  console.log(`${secondsPadded()} seconds --> 処理 3 (同期, 10 秒かかる)`);
};

//////////////// 計測開始 ////////////////

console.log(`${secondsPadded()} seconds --> index.js START`);

// [非同期] 即時実行.
setTimeout(func2);

// [非同期] 5 秒後に実行.
setTimeout(func1, 5000);

// 同期実行.
func3();

console.log(`${secondsPadded()} seconds --> index.js END`);
