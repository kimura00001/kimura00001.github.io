// 機能を足すときは js/modules/ にファイルを作って、ここに 1 行追加するだけ。
import nav from './modules/nav.js';
import bind from './modules/bind.js';
import services from './modules/services.js';
import price from './modules/price.js';
import access from './modules/access.js';
import reveal from './modules/reveal.js';

export default [nav, bind, services, price, access, reveal];
