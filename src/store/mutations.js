const mutations = {
	setSinger(state, singer){
		state.singer = singer
	},
	setPlayState(state, flag){
		state.playing = flag
	},
	setFullScreen(state, flag){
		state.fullScreen = flag
	},
	setPlayList(state, list){
		state.playlist = list
	},
	setSequenceList(state, list){
		state.sequenceList = list
	},
	setPlayMode(state, mode){
		state.mode = mode
	},
	setCurrentIndex(state, index){
		state.currentIndex = index
	},
	setDisc(state, disc){
		state.disc = disc
	},
	setTopList(state, toplist){
		state.topList = toplist
	}
}

export default mutations