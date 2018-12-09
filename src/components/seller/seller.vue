<template>
  <div class="seller" ref="sellerWrapper">
  	<div class="content">
	    <div class="overview1">
	    	<h1 class="title">{{seller.name}}</h1>
	    	<div class="desc border-1px">
	    		<star :size="36" :score="seller.score"></star>
	    		<span class="text">({{seller.ratingCount}})</span>
	    		<span class="text">月售{{seller.sellCount}}单</span>
	    	</div>
	    	<div class="favorite">
	    		<i class="icon-favorite" :class="{'active': favorite}" @click="toggleFavorite"></i>
	    		<span class="text" :class="{'active': favorite}">{{favoriteText}}</span>
	    	</div>
	    	<ul class="remark">
	    		<li class="item">
	    			<h2>起送价</h2>
	    			<div class="content">
	    				<span class="strong">{{seller.minPrice}}</span>元
	    			</div>
	    		</li>
	    		<li class="item">
	    			<h2>商家配送</h2>
	    			<div class="content">
	    				<span class="strong">{{seller.deliveryPrice}}</span>元
	    			</div>
	    		</li>
	    		<li class="item">
	    			<h2>平均配送时间</h2>
	    			<div class="content">
	    				<span class="strong">{{seller.deliveryTime}}</span>分钟
	    			</div>
	    		</li>
	    	</ul>
	    </div>
	    <split></split>
	    <div class="bulletin">
	    	<h1 class="title">公告与活动</h1>
	    	<p class="text">{{seller.bulletin}}</p>
	    </div>
	    <ul class="supports" v-if="seller.supports">
	    	<div class="line border-1px"></div>
			<li class="supports-item border-1px" v-for="(item, index) in seller.supports" :key="(item.id,index.id)">
				<span class="icon" :class="classMap[seller.supports[index].type]"></span>
				<span class="text">{{item.description}}</span>
			</li>
		</ul>
		<split></split>
		<div class="pics" v-show="seller.pics && seller.pics.length">
			<h1 class="title">商家实景</h1>
			<div class="pics-wrapper" ref="picsWrapper">
				<ul class="pics-list" ref="picsList">
					<li class="pics-item" v-for="(item, index) in seller.pics" :key="index">
						<img :src="item" width="120" height="90"/>
					</li>
				</ul>
			</div>
		</div>
		<split></split>
		<div class="info">
			<h1 class="title">商家信息</h1>
			<ul>
				<div class="line border-1px"></div>
				<li class="info-item border-1px" v-for="(info, index) in seller.infos" :key="index">
					{{info}}
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
	import { saveToLocal, loadFromLocal } from '../../common/js/store';

	export default {
	  props: {
	  	seller: {
	  		type: Object
	  	}
	  },
	  components: {
	  	star,
	  	split
	  },
	  data() {
	  	return {
	  		favorite: loadFromLocal(this.seller.id, 'favorite')
	  	}
	  },
	  computed: {
	  	favoriteText() {
	  		return this.favorite ? '已收藏' : '收藏';
	  	}
	  },
	  created() {
	  	this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
	  },
	  watch: {
	  	seller() {
	  		this._initScroll();
	  		this._initPicScroll();
	  	}
	  },
	  methods: {
	  	_initScroll() {
	  		if (!this.scroll) {
	  			this.$nextTick(() => {
				  	this.scroll = new BScroll(this.$refs.sellerWrapper, {
				  		click: true
				  	})
	  			})
	  		} else {
	  			this.scroll.refresh();
	  		}
	  	},
	  	_initPicScroll() {
	  		if (this.seller.pics) {
	  			let imgWidth = 120;
	  			let margin = 6;
	  			let width = (imgWidth + margin) * this.seller.pics.length - margin;
	  			this.$refs.picsList.style.width = width + 'px';
	  		}
	  		if (!this.picScroll) {
			  	this.picScroll = new BScroll(this.$refs.picsWrapper, {
			  		scrollX: true
			  		// eventPassthrough: 'vertical'
			  	})
	  		} else {
	  			this.picScroll.refresh();
	  		}
	  	},
	  	toggleFavorite() {
	  		this.favorite = !this.favorite;
	  		saveToLocal(this.seller.id, 'favorite', this.favorite);
	  	}
	  },
	  mounted() {
	  	this.$nextTick(() => {
	  		this._initScroll();
	  		this._initPicScroll();
	  	})
	  }
	}
</script>
<style lang="stylus" scoped>
	@import '../../common/stylus/mixin.styl';
	.seller
		position absolute
		top 174px
		bottom 0px
		left 0px
		width 100%
		overflow hidden
		.overview1
			position relative
			padding 0 18px
			overflow hidden
			.title
				margin 18px 0 8px
				line-height 14px
				font-size 14px
				color rgb(7, 17, 27)
			.desc
				padding-bottom 18px
				font-size 0
				border-1px(rgba(7, 17, 27, .1))
				.star
					display inline-block
					vertical-align top
					margin-right 8px
				.text
					margin-right 12px
					line-height 18px
					font-size 10px
					color rgb(77, 85, 93)
			.favorite
				position absolute
				top 18px
				right 14px
				width 40px
				text-align center
				font-size 0
				.icon-favorite
					display block
					margin-bottom 4px
					line-height 24px
					font-size 24px
					color rgb(147, 153, 159)
					&.active
						color rgb(240, 20, 20)
				.text
					line-height 10px
					font-size 10px
					color rgb(147, 153, 159)
					&.active
						color rgb(77, 85, 93)
			.remark
				display flex
				padding 18px 0
				.item
					flex 1
					text-align center
					border-right 1px solid rgba(7, 17, 27, .1)
					&:last-child
						border none
					h2
						margin-bottom 4px
						line-height 10px
						font-size 10px
						color rgb(147, 153, 159)
					.content
						line-height 24px
						font-size 10px
						color rgb(7, 17, 27)
						.strong
							font-size 24px
		.bulletin
			padding 18px 18px 0
			.title
				font-size 14px
				font-weight 700
				color rgb(7, 17, 27)
				line-height 14px
				margin-bottom 8px
			.text
				padding 0 12px
				line-height 24px
				font-size 12px
				color rgb(240, 20, 20)
		.supports
			padding 0 18px
			margin-top 16px
			text-align: left
			.line
				border-1px(rgba(7, 17, 27, .1))
			.supports-item
				padding: 16px 12px
				font-size: 0
				border-1px(rgba(7, 17, 27, .1))
				&:last-child
					border-none()
				.icon
					display: inline-block
					width: 16px
					height: 16px
					vertical-align: top
					margin-right: 6px
					background-size: 16px 16px
					background-repeat: no-repeat
					&.decrease
						bg-image('decrease_4')
					&.discount
						bg-image('discount_4')
					&.guarantee
						bg-image('guarantee_4')
					&.invoice
						bg-image('invoice_4')
					&.special
						bg-image('special_4')
				.text
					display: inline-block
					font-size: 12px
					color rgb(7, 17, 27)
					line-height: 16px
		.pics
			padding 18px
			.title
				margin-bottom 12px
				line-height 14px
				font-size 14px
				color rgb(7, 17, 27)
			.pics-wrapper
				width 100%
				overflow hidden
				.pics-list
					white-space nowrap
					.pics-item
						display inline-block
						margin-right 6px
						&:last-child
							margin-right 0
		.info
			padding 18px 18px 0
			.title
				margin-bottom 12px
				line-height 14px
				font-size 14px
				color rgb(7, 17, 27)
			.line
				border-1px(rgba(7, 17, 27, .1))
			.info-item
				padding 16px 12px
				border-1px(rgba(7, 17, 27, .1))
				line-height 16px
				font-size 12px
				color rgb(7, 17, 27)
				&:last-child
					border-none()
</style>
