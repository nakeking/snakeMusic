import jsonp from 'common/js/jsonp'
import {commonParams, options} from './config'

//抓取歌手
export function getSingerList(){
	const url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg';

	const data = Object.assign({}, commonParams, {
		channel: 'singer',
		page: 'list',
		key: 'all_all_all',
		pagesize: 100,
		pagenum: 1,
		hostUin: 0,
		needNewCode: 0,
		platform: 'yqq'
	})

	return jsonp(url, data, options);
}

//抓取歌手歌单
export function getSingerDetail(singerId){
	const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg';

	const data = Object.assign({}, commonParams, {
		hostUin: 0,
		needNewCode: 0,
		platform: 'yqq',
		order: 'listen',
		begin:0,
		num: 30,
		songstatus: 1,
		g_tk: 244471557,
		singermid: singerId
	})

	return jsonp(url, data, options);
}