//入口
import Vue from 'vue'
import Vuex from 'vuex'

import state from './state'
import mutations from './mutations'
import * as actions from './actions'
import * as getters from './getters'

//可以查看错误日志
import createLogger from 'vuex/dist/logger'

Vue.use(Vuex)

//vuex调试工具
const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
	actions,
	getters,
	state,
	mutations,
	//严格模式(开启影响性能，开发环境开启，上线关闭)
	strict: debug,
	plugins: debug ? [createLogger()] : []
})