//异步操作
import mutations from './mutations'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'

function findIndex(list, song){
	return list.findIndex((item) => {
		return item.id = song.id
	})
}

export const selectPlay = function({commit, state}, {list, index}){
	commit(`setSequenceList`, list);
	if(state.mode === playMode.random){
		let randomList = shuffle(list);
		commit(`setPlayList`, randomList);
		let index = findIndex(randomList, list[index])
	}else{
		commit(`setPlayList`, list);
	}
	commit(`setCurrentIndex`, index);
	commit(`setFullScreen`, true);
	commit(`setPlayState`, true);
}

export const randomPlay = function({commit},{list}){
	commit(`setPlayMode`, playMode.random);
	commit(`setSequenceList`, list);
	let randomList = shuffle(list);
	commit(`setPlayList`, randomList);
	commit(`setCurrentIndex`, 0);
	commit(`setFullScreen`, true);
	commit(`setPlayState`, true);
}

export const inserSong = function({commit, state}, song){
	//state.playlist直接修改mutation会报错.
	let playlist = state.playlist.slice(0)
	let sequenceList = state.sequenceList.slice(0)
	let currentIndex = state.currentIndex
	//记录当前歌曲
	let currentSong = playlist[currentIndex]
	//当前列表中是否有待插入的歌曲并返回索引
	let fpIndex = findIndex(playlist,song)
	//插入歌曲，索引加一
	currentIndex++
	//插入这是歌到当前索引位置
	playlist.splice(currentIndex, 0, song)
	//如果已经包含了这首歌
	if(fpIndex > -1){
		//如果当前插入的序号大于列表中的序号
		if(currentIndex > fpIndex){
			playlist.splice(fpIndex, 1)
			currentIndex--
		}else{
			playlist.splice(fpIndex+1, 1)
		}
	}


	let currentSIndex = findIndex(sequenceList, currentSong) + 1
	let fsIndex = findIndex(sequenceList, song)

	sequenceList.splice(currentSIndex, 0, song)

	if(fsIndex > -1){
		if(currentSIndex > fsIndex){
			sequenceList.splice(fsIndex, 1)
		}else{
			sequenceList.splice(fsIndex + 1, 1)
		}
	}

	commit(`setPlayList`, playlist)
	commit(`setSequenceList`, sequenceList)
	commit(`setCurrentIndex`, currentIndex)
	commit(`setFullScreen`, true)
	commit(`setPlayState`, true)
}

//查找当前歌曲列表里有没有这首歌曲
function findIndex(list, song){
	return list.findIndex((item) => {
		return item.id === song.id
	})
}