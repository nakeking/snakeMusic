import {commonParams, options} from './config'
import axios from 'axios'

export function getSongLyric(mid){
	const url = "/api/getSongLyric";

	const data = Object.assign({}, commonParams, {
		songmid: mid,
		pcachetime: new Date(),
		platform: 'yqq',
		hostUin: 0,
		needNewCode: 0,
		format: 'json',
		g_tk: 474944653
	});

	return axios.get(url,{
		params:data
	}).then((res) => {
		return Promise.resolve(res.data);
	})
}