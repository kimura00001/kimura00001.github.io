// 機能を足すときは js/modules/ にファイルを作って、ここに 1 行追加するだけ。
import nav from './modules/nav.js';
import bind from './modules/bind.js';
import board from './modules/board.js';
import menu from './modules/menu.js';
import info from './modules/info.js';
import reveal from './modules/reveal.js';

export default [nav, bind, board, menu, info, reveal];
