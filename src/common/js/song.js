import {getSongLyric} from 'api/song'
import {ERR_OK} from 'api/config'
import {Base64} from 'js-base64'

export default class Song{
	constructor({id, mid, singer, name, album, duration, image,url}){
		this.id = id;
		this.mid = mid;
		this.singer = singer;
		this.name = name;
		this.album = album;
		this.duration = duration;
		this.image = image;
		this.url = url;
	}
	getLyric(){
		if(this.lyric){
			return Promise.resolve(this.lyric)
		}
		return new Promise((resolve, reject) => {
			getSongLyric(this.mid).then((res) => {
				if(res.retcode === ERR_OK){
					this.lyric = Base64.decode(res.lyric)
					resolve(this.lyric);
				}else{
					reject('no lyric');
				}
			})
		})
		
	}
}

export function createSong(musicData) {
	return new Song({
		id: musicData.songid,
		mid: musicData.songmid,
		singer: fillterSinger(musicData.singer),
		name: musicData.songname,
		album: musicData.albumname,
		duration: musicData.interval,
		image: `//y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
		url: `http://dl.stream.qqmusic.qq.com/C400${musicData.songmid}.m4a?guid=7585725512&vkey=D3F2715CD7438B339938C308697D1702722D70B9117D8BB5FFE827EF03766202AF04FA3948D2B8186EA5E43E7C90EC2AD0F493D0082CB0F5&uin=0&fromtag=38`
	})
}

function fillterSinger(singer){
	let ret = [];
	if(!singer){
		return '';
	}
	singer.forEach((s) => {
		ret.push(s.name);
	})
	return ret.join('/');
}