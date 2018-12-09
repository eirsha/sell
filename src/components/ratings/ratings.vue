<template>
  <div class="ratings" ref="ratingsWrapper">
  	<div class="content">
  		<div class="overview">
  			<div class="overview-left">
  				<h1 class="score">{{seller.score}}</h1>
  				<div class="title">综合评分</div>
  				<div class="rank">高于周边商家{{seller.rankRate}}%</div>
  			</div>
  			<div class="overview-right">
  				<div class="wrapper">
  					<span class="title">服务态度</span>
  					<star :size="36" :score="seller.serviceScore"></star>
  					<span class="score">{{seller.serviceScore}}</span>
  				</div>
  				<div class="wrapper">
  					<span class="title">商品评分</span>
  					<star :size="36" :score="seller.foodScore"></star>
  					<span class="score">{{seller.foodScore}}</span>
  				</div>
  				<div class="delivery-wrapper">
  					<span class="title">送达时间</span>
  					<span class="time">{{seller.deliveryTime}}分钟</span>
  				</div>
  			</div>
  		</div>
  		<split></split>
  		<ratingselect :select-type="selectType" :only-content="onlyContent" :desc="desc" :ratings="ratings" v-on:this_select_type="this_select_type" v-on:this_only_content="this_only_content"></ratingselect>
  		<div class="ratings-wrapper">
  			<ul>
  				<li class="ratings-item border-1px" v-for="(rating, index) in ratings" :key="index" v-show="needShow(rating.rateType, rating.text)">
  					<div class="avatar">
  						<img :src="rating.avatar" width="28" height="28">
  					</div>
  					<div class="content">
  						<h1 class="username">{{rating.username}}</h1>
  						<div class="star-warpper">
  							<star :size="24" :score="rating.score"></star>
  							<span class="deliveryTime" v-show="rating.deliveryTime">{{rating.deliveryTime}}分钟送达</span>
  						</div>
  						<span class="time">{{rating.rateTime | formatDate}}</span>
	  					<div class="text">{{rating.text}}</div>
	  					<div class="recommend" v-show="rating.recommend && rating.recommend.length">
	  						<i class="icon-thumb_up"></i>
	  						<span class="recommend-item" v-for="(item, index) in rating.recommend" :key="index">{{item}}</span>
	  					</div>
  					</div>
  				</li>
  			</ul>
  		</div>
  	</div>
  </div>
</template>

<script>
	import star from '../star/star';
	import split from '../split/split';
	import BScroll from 'better-scroll';
	import { formatDate } from '../../common/js/date';
	import ratingselect from '../ratingselect/ratingselect';

	const ALL = 2;
	const ERR_OK = 0;

	export default {
	  name: 'Ratings',
	  props: {
	  	seller: {
	  		type: Object
	  	}
	  },
	  components: {
	  	star,
	  	split,
	  	ratingselect
	  },
	  data () {
	    return {
	    	ratings: [],
	      	selectType: ALL,
			onlyContent: true,
			desc: {
				all: '全部',
				positive: '满意',
				negative: '不满意'
			}
	    }
	  },
	  created() {
	  	this.$http.get('/api/ratings').then((response) => {
	  		response = response.body;
	  		if (response.errno === ERR_OK) {
	  			this.ratings = response.data;
	  			console.log(this.ratings);
	  			this.$nextTick(() => {
		  			this.scroll = new BScroll(this.$refs.ratingsWrapper, {
		  				click: true
		  			})
	  			})
	  		}
	  	})
	  },
	  methods: {
	  	this_select_type(type) {
			this.selectType = type;
		},
		this_only_content(onlyContent) {
			this.onlyContent = onlyContent;
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
		}
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
	.ratings
		position absolute
		top 174px
		bottom 0px
		left 0px
		width 100%
		overflow hidden
		.overview
			display flex
			padding 18px 0
			.overview-left
				flex 0 0 137px
				padding 6px 0
				width 137px
				border-right 1px solid rgba(7, 17, 27, .1)
				text-align center
				@media only screen and (max-width:320px)
					flex 0 0 120px
					width 120px
				.score
					margin-bottom 6px
					line-height 28px
					font-size 24px
					color rgb(255, 153, 0)
				.title
					margin-bottom 8px
					line-height 12px
					font-size 12px
					color rgb(7, 17, 27)
				.rank
					line-height 10px
					font-size 10px
					color rgb(147, 153, 159)
			.overview-right
				flex 1
				padding 6px 0 6px 24px
				@media only screen and (max-width:320px)
					padding-left 6px
				.wrapper
					font-size 0
					margin-bottom 8px
					.title
						display inline-block
						vertical-align top
						line-height 18px
						font-size 12px
						color rgb(7, 17, 27)
					.star
						display inline-block
						margin 0 12px
					.score
						display inline-block
						vertical-align top
						line-height 18px
						font-size 12px
						color rgb(255, 153, 0)
				.delivery-wrapper
					font-size 0
					.title
						display inline-block
						vertical-align top
						line-height 18px
						font-size 12px
						color rgb(7, 17, 27)
						margin-right 12px
					.time
						line-height 18px
						font-size 12px
						color rgb(147, 153, 159)
		.ratings-wrapper
			padding 0 18px
			.ratings-item
				display flex
				padding 18px 0
				border-1px(rgba(7, 17, 27, 0.1))
				.avatar
					margin-right 12px
					flex 0 0 28px
					width 28px
					img
						border-radius 50%
				.content
					flex 1
					position relative
					.username
						margin-bottom 4px
						line-height 12px
						font-size 10px
						color rgb(7, 17, 27)
					.star-warpper
						margin-bottom 6px
						font-size 0
						.star
							display inline-block
							vertical-align top
							margin-right 6px
						.deliveryTime
							display inline-block
							vertical-align top
							font-size 10px
							line-height 12px
							color rgb(147, 153, 159)
					.time
						position absolute
						top 0px
						right 0
						font-size 10px
						line-height 12px
						color rgb(147, 153, 159)
					.text
						margin-bottom 8px
						line-height 18px
						font-size 12px
						color rgb(7, 17, 27)
					.recommend
						font-size 0
						.icon-thumb_up, .recommend-item
							display inline-block
							vertical-align top
							margin-right 8px
							line-height 16px
						.icon-thumb_up
							color rgb(0, 160, 220)
							font-size 12px
						.recommend-item
							padding 0 6px
							margin-bottom 4px
							font-size 9px
							color rgb(147, 153, 159)
							border 1px solid rgba(7, 17, 27, 0.1)
							
</style>
