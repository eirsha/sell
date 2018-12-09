<template>
	<transition name="slide">
		<div class="food" v-show="showFlag" ref="foodDetail">
			<div class="food-content">
				<div class="img-header">
					<img :src="food.image">
					<div class="back" @click="hide">
						<i class="icon-arrow_lift"></i>
					</div>
				</div>
				<div class="content">
					<h1 class="title"> {{food.name}} </h1>
					<div class="detail">
						<span class="sellCount">月售{{food.sellCount}}份</span>
						<span class="rating">好评率{{food.rating}}%</span>
					</div>
					<div class="price">
						<p class="new">￥<span>{{food.price}}</span></p><p class="old" v-show="food.oldPrice">￥<span>{{food.oldPrice}}</span></p>
					</div>
					<transition name="fade">
						<div class="buy" v-show="!food.count || food.count===0" @click.stop.prevent="addFirst">加入购物车</div>
					</transition>
					<div class="cartcontrol-wrapper">
						<cartcontrol :food="food" v-on:cart-add="_drop"></cartcontrol>
					</div>
				</div>
				<split v-show="food.info"></split>
				<div class="info" v-show="food.info">
					<h1 class="title">商品介绍</h1>
					<div class="text">{{food.info}}</div>
				</div>
				<split></split>
				<div class="rating">
					<h1 class="title">商品评价</h1>
					<ratingselect :select-type="selectType" :only-content="onlyContent" :desc="desc" :ratings="food.ratings" v-on:this_select_type="this_select_type" v-on:this_only_content="this_only_content"></ratingselect>
					<div class="rating-wrapper">
						<ul v-show="food.ratings && food.ratings.length">
							<li class="rating-item border-1px" v-for="(rating, index) in food.ratings" :key="index" v-show="needShow(rating.rateType, rating.text)">
								<div class="user">
									<span class="name">{{rating.username}}</span>
									<img class="avatar" width="12" height="12" :src="rating.avatar">
								</div>
								<div class="time">{{rating.rateTime | formatDate}}</div>
								<p class="text">
									<span :class="{'icon-thumb_up':rating.rateType===0,'icon-thumb_down':rating.rateType===1}"></span>{{rating.text}}
								</p>
							</li>
						</ul>
						<div class="no-rating" v-show="!food.ratings || !food.ratings.length">暂无评价</div>
					</div>
				</div>
			</div>
		</div>
	</transition>
</template>
<script>
	import Vue from 'vue';
	import BScroll from 'better-scroll';
	import { formatDate } from '../../common/js/date';
	import cartcontrol from '../cartcontrol/cartcontrol';
	import { mapState, mapActions } from 'vuex';
	import split from '../split/split';
	import ratingselect from '../ratingselect/ratingselect';
	// const POSITIVE = 0;
	// const NEGATIVE = 1;
	const ALL = 2;
	export default {
		name: 'Food',
		props: {
			food: {
				type: Object
			}
		},
		components: {
			cartcontrol,
			ratingselect,
			split
		},
		computed: {
			...mapState({
				show1: state => state.show1,
				ayy: state => state.ayy,
				json: state => state.json
			})
		},
		data() {
			return {
				showFlag: false,
				selectType: ALL,
				onlyContent: true,
				desc: {
					all: '全部',
					positive: '推荐',
					negative: '吐槽'
				}
			}
		},
		methods: {
			show() {
				this.showFlag = true;
				this.$nextTick(() => {
					if (!this.scroll) {
						this.scroll = new BScroll(this.$refs.foodDetail, {
							click: true
						})
					} else {
						this.scroll.refresh();
					}
				})
			},
			hide() {
				this.showFlag = false;
			},
			addFirst() {
				Vue.set(this.food, 'count', 1);
				this._drop(event.currentTarget);
			},
			_drop(data) {
				this.$emit('shop-cart', data);
			},
			needShow(type, text) {
				if (this.onlyContent && !text) {
					return false;
				}
				if (this.selectType === ALL) {
					return true;
				} else {
					return type === this.selectType;
				}
			},
			this_select_type(type) {
				this.selectType = type;
			},
			this_only_content(onlyContent) {
				this.onlyContent = onlyContent;
			},
			...mapActions(['GET_BALL_ELE'])
		},
		filters: {
			formatDate(time) {
				let date = new Date(time);
				return formatDate(date, 'yyyy-MM-dd hh:mm');
			}
		}
	}
</script>
<style lang="stylus" scoped>
	@import '../../common/stylus/mixin.styl';
	.food
		position fixed
		width 100%
		top 0px
		left 0px
		bottom 48px
		background #fff
		z-index 30
		&.slide-enter-active, &.slide-leave-active
			transition all 0.2s linear
			transform translate3d(0, 0, 0)
		&.slide-enter, &.slide-leave-to
			transform translate3d(100%, 0, 0)
		.food-content
			.img-header
				position relative
				height 0
				padding-top 100%
				img
					position absolute
					top 0px
					left 0px
					width 100%
					height 100%
				.back
					position absolute
					top 10px
					left 0px
					.icon-arrow_lift
						padding 10px
						font-size 20px
						color #fff
			.content
				position relative
				padding 18px
				.title
					font-size 14px
					font-weight 700
					color rgb(7, 17, 27)
					line-height 14px
					margin-bottom 8px
				.detail
					font-size 0
					color rgb(147, 153, 159)
					line-height 10px
					margin-bottom 18px
					.sellCount, .rating
						font-size 10px
					.sellCount
						margin-right 12px
				.price
					.new
						display inline-block
						color: rgb(240, 20, 20)
						font-size: 10px
						margin-right: 8px
						span
							font-weight: 700
							font-size: 14px
					.old
						display inline-block
						color: rgb(147, 153, 159)
						font-size: 10px
						text-decoration: line-through
						span
							font-weight: 700
				.cartcontrol-wrapper
					position absolute
					right 12px
					bottom 12px
				.buy
					position absolute
					right 18px
					bottom 18px
					z-index 10
					font-size 10px
					line-height 12px
					color #fff
					padding 6px 12px
					background rgb(0, 160, 220)
					border-radius 12px
					opacity 1
					&.fade-enter-active, &.fade-leave-active
						transition all 0.4s
						opacity 1
					&.fade-enter, &.fade-leave-to
						opacity 0
			.info
				padding 18px
				.title
					font-size 14px
					color rgb(7, 17, 27)
					margin-bottom 6px
				.text
					padding 0 8px
					line-height 24px
					font-size 12px
					color rgb(77, 85, 93)
			.rating
				padding-top 18px
				.title
					margin-left 18px
					font-size 14px
					color rgb(7, 17, 27)
				.rating-wrapper
					padding 0 18px
					.rating-item
						position relative
						padding 16px 0
						border-1px(rgba(7, 17, 27, 0.1))
						.user
							position absolute
							right 0px
							top 16px
							font-size 0
							.name
								display inline-block
								margin-right 6px
								vertical-align top
								font-size 10px
								color rgb(147, 153, 159)
								line-height 12px
							.avatar
								border-radius 50%
						.time
							margin-bottom 6px
							font-size 10px
							line-height 12px
							color rgb(147, 153, 159)
						.text
							line-height 16px
							font-size 12px
							color rgb(7, 17, 27)
							.icon-thumb_up, .icon-thumb_down
								margin-right 4px
								line-height 16px
								font-size 12px
							.icon-thumb_up
								color rgb(0, 160, 220)
							.icon-thumb_down
								color rgb(147, 153, 159)
					.no-rating
						padding 18px 0
						text-align center
						font-size 12px
						color rgb(147, 153, 159)
</style>
