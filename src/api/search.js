import jsonp from 'common/js/jsonp'
import {commonParams, options} from './config'
import axios from 'axios'

export function getHotKey(){
	const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'

	const data = Object.assign({}, commonParams, {
		platform: 'h5',
		needNewCode: 1
	})

	return jsonp(url, data, options)
}

export function search(query,page,zhida,perpage){
	const url = '/api/search'

	const data= Object.assign({}, commonParams, {
		g_tk: 5381,
		inCharset: 'utf-8',
		outCharset: 'utf-8',
		notice: 0,
		format: 'json',
		w: query,
		p: page,
		catZhida: zhida,
		uin: 0,
		platform: 'h5',
		needNewCode: 1,
		zhidaqu: 1,
		t: 0,
		flag: 1,
		ie: 'utf-8',
		sem: 1,
		aggr: 0,
		perpage: perpage,
		n: perpage,
		remoteplace: 'txt.mqq.all'
	})

	return axios.get(url,{
		params: data
	}).then((res) => {
		return Promise.resolve(res.data)
	})
}