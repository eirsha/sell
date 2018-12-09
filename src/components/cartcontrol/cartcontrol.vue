<template>
	<div class="cartcontrol">
		<transition name="move">
			<div class="cart-decrease" v-show="food.count>0" @click.stop.prevent="descreaseCart()">
				<i class="inner icon-remove_circle_outline"></i>
			</div>
		</transition>
		<div class="cart-count" v-show="food.count>0">{{food.count}}</div>
		<div class="cart-add" @click.stop.prevent="addCart()">
			<i class="inner icon-add_circle"></i>
		</div>
	</div>
</template>
<script>
	import Vue from 'vue';
	import { mapActions } from 'vuex';
	export default {
		name: 'Cartcontrol',
		props: {
			food: {
				type: Object
			}
		},
		methods: {
			addCart() {
				if (!this.food.count) {
					Vue.set(this.food, 'count', 1);
				} else {
					this.food.count++;
				}
				this.$emit('cart-add', event.currentTarget); // 添加这句，提交'cart-add'事情给父组件，第二个是要传递的参数
				// this.GET_BALL_ELE(event.currentTarget);
			},
			descreaseCart() {
				this.food.count--;
			},
			...mapActions(['GET_BALL_ELE'])
		}
	}
</script>
<style lang="stylus" scoped>
	.cartcontrol
		font-size: 0
		.cart-decrease, .cart-add
			display: inline-block
			padding: 6px
			.inner
				display: inline-block
				font-size: 24px
				color: rgb(0, 160, 220)
		.cart-decrease
			&.move-enter-active, &.move-leave-active
				transition: all 0.4s linear
				opacity: 1
				transform: translate3D(0, 0, 0)
				.inner
					transition: all 0.4s linear
					transform: rotate(-180deg)
			&.move-enter, &.move-leave-to
				opacity: 0
				transform: translate3D(24px, 0, 0)
				.inner
					transform: rotate(0)
		.cart-count
			display: inline-block
			vertical-align: middle
			text-align: center
			font-size: 10px
			line-height: 24px
			color: rgb(147, 153, 159)
			margin-top: -18px
		.cart-add
			display: inline-block
</style>
