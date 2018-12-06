import jsonp from 'common/js/jsonp'
import {commonParams, options} from './config'
import axios from 'axios'

export function getTopList(){
	const url = '/api/getTopList'

	const data = Object.assign({}, commonParams, {
		platform: 'h5',
		needNewCode: 1,
		g_tk: 5381,
		format: 'json'
	})

	return axios.get(url, {
		params:data
	}).then((res) => {
		return Promise.resolve(res.data)
	})
}

export function getMusicList(topid){
	const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg'

	const data = Object.assign({}, commonParams, {
		platform: 'h5',
		needNewCode: 1,
		page: 'detail',
		type: 'top',
		tpl: 3,
		topid: topid
	})

	return jsonp(url, data, options)
}