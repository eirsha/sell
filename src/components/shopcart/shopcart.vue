<template>
	<div>
		<div class="shopcart">
			<div class="content" @click="toggleList($event)">
				<div class="content-left">
					<div class="logo-wrapper">
						<div class="logo" :class="{highlight:totalCount>0}">
							<i class="icon-shopping_cart" :class="{highlight:totalCount>0}"></i>
						</div>
						<div class="num" v-show="totalCount>0">{{totalCount}}</div>
					</div>
					<div class="price" :class="{highlight:totalPrice>0}">￥{{totalPrice}}</div>
					<div class="desc">另需配送费￥{{deliveryPrice}}元</div>
				</div>
				<div class="content-right" @click.stop.prevent="pay">
					<div class="pay" :class="payClass">{{payDesc}}</div>
				</div>
				<div class="ball-container">
					<transition-group name="drop" tag="div"
						v-on:before-enter="beforeEnter"
						v-on:enter="dropEnter"
						v-on:after-enter="afterEnter">
						<div class="ball" v-for="(ball, index) in balls" :key="index" v-show="ball.show">
							<div class="inner inner-hook"></div>
						</div>
					</transition-group>
				</div>
				<transition name="fold">
					<div class="shopcart-list" v-show="listShow" @click.stop>
						<div class="list-header">
							<h1 class="title">购物车</h1>
							<span class="empty" @click="empty">清空</span>
						</div>
						<div class="list-content" ref="listContent">
							<ul>
								<li class="food border-1px" v-for="(food, index) in selectFoods" :key="index">
									<span class="name">{{food.name}}</span>
									<div class="price">
										￥<span>{{food.price*food.count}}</span>
									</div>
									<div class="cartcontrol-wrapper">
										<cartcontrol :food="food" v-on:cart-add="dropMove"></cartcontrol>
									</div>
								</li>
							</ul>
						</div>
					</div>
				</transition>
			</div>  
		</div>
		<transition name="fade">
			<div class="list-mask" v-show="listShow" @click="hideList"></div>
		</transition>
	</div>
</template>
<script>
	import BScroll from 'better-scroll';
	import cartcontrol from '../cartcontrol/cartcontrol'
	export default {
		name: 'Shopcart',
		props: {
			selectFoods: {
				type: Array,
				default() { 
					return [];
				}
			},
			deliveryPrice: {
				type: Number,
				default: 0
			},
			minPrice: {
				type: Number,
				default: 0
			}
		},
		components: {
			cartcontrol
		},
		data() {
			return {
				balls: [
					{
						show: false, el: null
					},
					{
						show: false, el: null
					},
					{
						show: false, el: null
					},
					{
						show: false, el: null
					},
					{
						show: false, el: null
					}
				],
				droppedBalls: [],
				fold: true
			}
		},
		computed: {
			totalPrice() {
				let total = 0;
				this.selectFoods.forEach((food) => {
					total += food.price * food.count;
				});
				return total;
			},
			totalCount() {
				let count = 0;
				this.selectFoods.forEach((food) => {
					count += food.count;
				});
				return count;
			},
			payDesc() {
				if (this.totalPrice === 0) {
					return `￥${this.minPrice}起送`;
				} else if (this.totalPrice < this.minPrice) {
					let p = this.minPrice - this.totalPrice;
					return `还差￥${p}起送`;
				} else {
					return '去结算';
				}
			},
			payClass() {
				if (this.totalPrice < this.minPrice) {
					return 'not-enough';
				} else {
					return 'enough';
				}
			},
			listShow() {
				let show = false;
				if (!this.totalCount) {
					show = false;
				}
				if (this.totalCount > 0 && !this.fold) {
					show = true;
				}
				return show;
			}
		},
		watch: {
			totalCount() {
				if (this.totalCount === 0) {
					this.fold = true;
				}
			},
			fold() {
				this.$nextTick(() => {
					if (!this.scroll) {
                        this.scroll = new BScroll(this.$refs.listContent, {
                            click: true
                        });
                    } else {
                    	this.scroll.refresh();
                    }
				})
			}
		},
		methods: {
			dropMove(el) {
		      for (var i = 0; i < this.balls.length; i++) {
		        let b = this.balls[i];
		        if (!b.show) {
		          b.show = true;
		          b.el = el;
		          this.droppedBalls.push(b);
		          return;
		        }
		      }
		    },
		    beforeEnter (el, done) {
		      let count = this.balls.length;
		      while (count--) {
		        let ball = this.balls[count];
		        if (ball.show) {
		          let rect = ball.el.getBoundingClientRect();
		          let x = rect.left - 32;
		          let y = -(window.innerHeight - rect.top - 22);
		          el.style.display = '';
		          el.style.transform = `translate3d(0,${y}px,0`;
		          el.style.webkitTransform = `translate3d(0,${y}px,0`;
		          let inner = el.getElementsByClassName('inner-hook')[0];
		          inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
		          inner.style.transform = `translate3d(${x}px,0,0)`;
		          // console.log(el);
		        }
		      }
		    },
		    dropEnter (el, done) {
		      /* eslint-disable no-unused-vars */
		      /* 触发浏览器重绘; */
		      let rf = el.offsetHeight;
		      this.$nextTick(() => {
		        el.style.webkitTransform = 'translate3d(0, 0, 0)';
		        el.style.transform = 'translate3d(0, 0, 0)';
		        let inner = el.getElementsByClassName('inner-hook')[0];
		        inner.style.webkitTransform = 'translate3d(0, 0, 0)';
		        inner.style.transform = 'translate3d(0, 0, 0)';
		        el.addEventListener('transitionend', done);
		        // done();
		      });
		      // console.log(el);
		      // done();
		    },
		    afterEnter (el) {
		      el.style.display = 'none';
		      let ball = this.droppedBalls.shift();
		      ball.show = false;
		      ball.el = null;
		    },
		    toggleList(event) {
		    	event.stopPropagation();
		    	if (!this.totalCount) {
		    		return;
		    	}
		    	this.fold = !this.fold;
		    },
		    empty() {
		    	this.selectFoods.forEach((food) => {
		    		food.count = 0;
		    	})
		    },
		    hideList() {
		    	this.fold = true;
		    },
		    pay() {
		    	if (this.totalPrice < this.minPrice) {
		    		return;
		    	}
		    	alert(`去支付${this.totalPrice}元`);
		    }
		}
	}
</script>
<style lang="stylus" scoped>
	@import '../../common/stylus/mixin.styl';
	.shopcart
		position: fixed
		width: 100%
		height: 48px
		left: 0
		bottom: 0
		z-index: 50
		.content
			display: flex
			font-size: 0
			width: 100%
			background: #141d27
			height: 48px
			color: rgba(255, 255, 255, 0.4)
			font-size: 0
			.content-left
				flex: 1
				font-size: 0
				.logo-wrapper
					display: inline-block
					position: relative
					vertical-align: top
					margin: -10px 12px 2px
					padding: 6px
					width: 56px
					height: 56px
					box-sizing: border-box
					border-radius: 50%
					background: #141d27
					.logo
						width: 100%
						height: 100%
						border-radius: 50%
						background: #2B343C
						text-align: center
						&.highlight
							background: rgb(0, 160, 220)
						.icon-shopping_cart
							font-size: 24px
							line-height: 44px
							&.highlight
								color: #fff
					.num
						position: absolute
						top: 0
						right: 0
						width: 24px
						height: 16px
						border-radius: 16px
						background: rgb(240, 20, 20)
						font-size: 9px
						font-weight: 700
						line-height: 16px
						color: #fff
						text-align: center
						box-shadow 0 4px 8px 0 rgba(0, 0, 0, 0.4);
				.price
					display: inline-block
					vertical-align: top
					height: 24px
					margin-top: 12px
					padding-right: 12px
					box-sizing: border-box
					border-right 1px solid rgba(255, 255, 255, 0.1)
					font-size: 16px
					font-weight: 700
					line-height: 24px
					&.highlight
						color: #fff
				.desc
					display: inline-block
					margin: 12px 0 0 12px
					line-height: 24px
					font-size: 16px
			.content-right
				flex: 0 0 105px
				width: 105px
				.pay
					width: 100%
					height: 100%
					font-size: 16px
					font-weight: 700
					line-height: 48px
					text-align: center
					&.not-enough
						background: #2B333B
					&.enough
						background: #00b43c
						color: #fff
		.ball-container
			.ball
				position: fixed
				left: 32px
				bottom: 22px
				z-index: 200
				.inner
					width: 15px
					height 15px
					border-radius 50%
					background-color #00a0dc
					transition all .5s linear
				&.drop-enter-active
					transition all .5s cubic-bezier(0.49, -0.29, 0.75, 0.41)
				&.drop-enter
					transform translate3d(0, -400px, 0)
					.inner
						transform translate3d(300px, 0, 0)
				&.drop-enter-to
					transform translate3d(0, 0, 0)
					.inner
						transform translate3d(0, 0, 0)
		.shopcart-list
			position absolute
			left 0px
			top 0
			z-index -1
			width 100%
			transform translate3d(0, -100%, 0)
			&.fold-enter-active, &.fold-leave-active
				transition: all 0.5s linear
				transform translate3d(0, -100%, 0)
			&.fold-enter, &.fold-leave-to
				transform translate3d(0, 0, 0)
			.list-header
				width 100%
				height 40px
				padding 0 18px
				box-sizing border-box
				background: #f3f5f7
				border-bottom 1px solid rgba(7, 17, 27, 0.1)
				line-height 40px
				.title
					float left
					font-size 14px
					color rgb(7, 17, 27)
				.empty
					float right
					font-size 12px
					color rgb(0, 160, 220)
			.list-content
				background #fff
				max-height 207px
				padding 0 18px
				overflow hidden
				.food
					position relative
					padding 12px 0
					border-1px(rgba(7, 17, 27, 0.1))
					.name
						line-height 24px
						font-size 14px
						color rgb(7, 17, 27)
					.price
						position absolute
						bottom 12px
						right 85px
						font-size 12px
						color rgb(240, 20, 20)
						span
							font-size 14px
							font-weight 700
							line-height 24px
					.cartcontrol-wrapper
						position absolute
						bottom 6px
						right 0
	.list-mask
		position fixed
		width 100%
		height 100%
		top 0px
		left 0px
		z-index 40
		backdrop-filter blur(10px)
		background rgba(7, 17, 27, 0.6)
		&.fade-leave-active, &.fade-enter-active
			transition: all .5s
			opacity 1
			background rgba(7, 17, 27, 0.6)
		&.fade-enter, &.fade-leave-to
			opacity 0
			background rgba(7, 17, 27, 0)
</style>
