<template>
  <div class="goods">
	<div class="menu-wrapper" ref="menuWrapper">
		<ul class="menu">
			<li class="menu-item border-1px" v-for="(item, index) in goods" :key="index" :class="{'current':currentIndex===index}" @click="selectMenu(index)">
				<p class="text-wrapper">
					<span class="icon" v-show="goods[index].type>0" :class="classMap[goods[index].type]"></span><span class="text">{{item.name}}</span>
				</p>
			</li>
		</ul>
	</div>
	<div class="foods-wrapper" ref="foodsWrapper">
		<ul class="goods-list">
			<li class="goods-item food-item-hook" v-for="(item, index) in goods" :key="index">
				<h1 class="title">{{item.name}}</h1>
				<ul class="foods-list">
					<li class="food-item border-1px" v-for="(food, ind) in item.foods" :key="ind"  @click="clickFood(food)">
						<div class="icon">
							<img width="57" height="57" :src="food.icon">
						</div>
						<div class="content">
							<h2 class="name">{{food.name}}</h2>
							<p class="desc">{{food.description}}</p>
							<div class="extra">
								<span>月售{{food.sellCount}}份</span><span>好评率{{food.rating}}%</span>
							</div>
							<div class="price">
								<p class="new">￥<span>{{food.price}}</span></p>
								<p class="old" v-show="food.oldPrice">￥<span>{{food.oldPrice}}</span></p>
							</div>
							<div class="cartcontrol-wrapper">
								<cartcontrol :food="food" v-on:cart-add="_drop"></cartcontrol>
							</div>
						</div>
					</li>
				</ul>
			</li>
		</ul>
	</div>
	<food :food="selectedFood" ref="foodDetail" v-on:shop-cart="_drop"></food>
	<shopcart ref="shopcart" :select-foods="selectFoods" :deliveryPrice="seller.deliveryPrice" :minPrice="seller.minPrice"></shopcart>
  </div>
</template>

<script>
import BScroll from 'better-scroll';
import shopcart from '../shopcart/shopcart'
import cartcontrol from '../cartcontrol/cartcontrol'
import food from '../food/food'
const ERR_OK = 0;
export default {
  name: 'Goods',
  props: {
	seller: {
		type: Object
	}
  },
  components: {
	shopcart,
	cartcontrol,
	food
  },
  data () {
	return {
	  goods: [],
	  foodsListHeight: [],
	  scrollY: 0,
	  selectedFood: {}
	}
  },
  created() {
	this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
	this.$http.get('/api/goods').then((response) => {
		response = response.body;
		if (response.errno === ERR_OK) {
			this.goods = response.data;
			console.log(this.goods);
			this.$nextTick(() => {
				this._initScroll();
				this._caculateHeight();
			})
		}
	})
  },
  computed: {
	currentIndex() {
		for (let i = 0; i < this.foodsListHeight.length; i++) {
			let height1 = this.foodsListHeight[i];
			let height2 = this.foodsListHeight[i + 1];
			if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
				return i;
			}
		}
		return 0;
	},
	selectFoods() {
		let foods = [];
		this.goods.forEach((good) => {
			good.foods.forEach((food) => {
				if (food.count) {
					foods.push(food);
				}
			});
		});
		return foods;
	}
  },
  methods: {
	_initScroll() {
		this.menuScroll = new BScroll(this.$refs.menuWrapper, {click: true});
		this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
			click: true,
			probeType: 3
		});
		this.foodsScroll.on('scroll', (pos) => {
			this.scrollY = Math.abs(Math.round(pos.y));
		})
	},
	_caculateHeight() {
		let foodsList = this.$refs.foodsWrapper.getElementsByClassName('food-item-hook');
		let height = 0;
		this.foodsListHeight.push(height);
		for (let i = 0; i < foodsList.length; i++) {
			height += foodsList[i].clientHeight;
			this.foodsListHeight.push(height);
		}
	},
	selectMenu(index) {
		let foodsList = this.$refs.foodsWrapper.getElementsByClassName('food-item-hook');
		let el = foodsList[index];
		this.foodsScroll.scrollToElement(el, 300);
	},
	_drop(data) {
		// 优化两个动画同时执行卡顿的问题
		this.$nextTick(() => {
			this.$refs.shopcart.dropMove(data);
		})
	},
	clickFood(food) {
		this.selectedFood = food;
	  	this.$refs.foodDetail.show();
	}
  }
}
</script>
<style lang="stylus" scoped>
	@import '../../common/stylus/mixin.styl'
	.goods
		display: flex
		position: absolute
		top: 174px
		bottom: 48px
		width: 100%
		overflow: hidden
		.menu-wrapper
			flex: 0 0 80px
			background: #f3f5f7
			.menu-item
				display: table
				width: 56px
				height: 54px
				border-1px(rgba(7, 17, 27, 0.1))
				line-height: 14px
				padding: 0 12px
				&.current
					background: #fff
					font-weight: 700
					margin-top: -1px
					border-none()
					z-index: 10
				.icon
					display: inline-block
					width: 12px
					height: 12px
					margin-right: 2px
					background-size: 12px 12px
					background-repeat: no-repeat
					vertical-align: top
					&.decrease
						bg-image('decrease_3')
					&.discount
						bg-image('discount_3')
					&.guarantee
						bg-image('guarantee_3')
					&.invoice
						bg-image('invoice_3')
					&.special
						bg-image('special_3')
				.text-wrapper
					font-size: 0
					display: table-cell
					vertical-align: middle
					.text
						font-size: 12px
		.foods-wrapper
			flex: 1
			.goods-item
				.title
					height: 26px
					width: 100%
					padding-left: 14px
					font-size: 12px
					line-height: 26px
					color: rgb(147, 153, 159)
					border-left 2px solid #d9dde1
					background: #f3f5f7
				.food-item
					display: flex
					margin: 18px
					padding-bottom: 18px
					border-1px(rgba(7, 17, 27, 0.1))
					&:last-child
						padding-bottom: 0
						border-none()
					.icon
						flex: 0 0 57px
						margin-right: 10px
					.content
						position: relative
						flex: 1
						.name
							margin 2px 0 8px
							font-size: 14px
							line-height: 14px
							color: rgb(7, 17, 27)
						.desc, .extra
							font-size: 10px
							line-height: 14px
							color: rgb(147, 153, 159)
							margin-bottom: 8px
						.extra
							font-size: 0
							line-height: unset
							span
								font-size: 10px
								&:first-child
									margin-right: 12px
						.price
							.new
								display: inline-block
								color: rgb(240, 20, 20)
								font-size: 10px
								margin-right: 8px
								span
									font-weight: 700
									font-size: 14px
							.old
								display: inline-block
								color: rgb(147, 153, 159)
								font-size: 10px
								text-decoration: line-through
								span
									font-weight: 700
						.cartcontrol-wrapper
							position: absolute
							right: -12px
							bottom: -12px
</style>
