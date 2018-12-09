import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		show1: false,
		ballEle: null,
		ayy: [1, 2, 3, 5],
		json: {name: '里斯', age: 29, sex: 1},
		msg: 'hello wrold'
	},
    getters: {
        not_show(state) {
            return !state.show;
        }
    },
    mutations: {
        switch(state) {
            state.show = state.show ? state.show = false : state.show = true;
        },
        get_ball_ele(state, obj) {
        	state.ballEle = obj;
        	console.log(obj);
        }
    },
    actions: {
        switch_dialog(context) {
            context.commit('switch');
        },
        GET_BALL_ELE(context, obj) {
        	context.commit('get_ball_ele', obj);
        }
    }
})
