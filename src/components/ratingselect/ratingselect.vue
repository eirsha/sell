<template>
	<div class="ratingselect">
		<div class="rating-type border-1px">
			<span @click="select(2)" class="block positive" :class="{'active':this_selectType===2}">{{desc.all}}<span class="count">{{ratings.length}}</span></span>
			<span @click="select(0)" class="block positive" :class="{'active':this_selectType===0}">{{desc.positive}}<span class="count">{{positives.length}}</span></span>
			<span @click="select(1)" class="block negative" :class="{'active':this_selectType===1}">{{desc.negative}}<span class="count">{{negatives.length}}</span></span>
		</div>
		<div class="switch" :class="{'on':this_onlyContent}" @click="toggleSwitch">
			<i class="icon-check_circle"></i>
			<span class="text">只看有内容的评价</span>
		</div>
	</div>
</template>
<script>
	const POSITIVE = 0;
	const NEGATIVE = 1;
	const ALL = 2;
	export default {
		props: {
			ratings: {
				type: Array,
				default() {
					return [];
				}
			},
			selectType: {
				type: Number,
				default: ALL
			},
			onlyContent: {
				type: Boolean,
				default: false
			},
			desc: {
				type: Object,
				default() {
					return {
						all: '全部',
						positive: '满意',
						negative: '不满意'
					}
				}
			}
		},
		data() {
			return {
				this_selectType: this.selectType,
				this_onlyContent: this.onlyContent
			}
		},
		computed: {
			positives() {
				return this.ratings.filter((rating) => {
					return rating.rateType === POSITIVE
				})
			},
			negatives() {
				return this.ratings.filter((rating) => {
					return rating.rateType === NEGATIVE
				})
			}
		},
		methods: {
			select(type) {
				this.this_selectType = type;
				this.$emit('this_select_type', type);
			},
			toggleSwitch() {
				this.this_onlyContent = !this.this_onlyContent;
				this.$emit('this_only_content', this.this_onlyContent);
			}
		}
	}
</script>
<style lang="stylus">
	@import '../../common/stylus/mixin.styl';
	.ratingselect
		.rating-type
			padding 18px 0
			margin 0 18px
			border-1px(rgba(7, 17, 27, 0.1))
			font-size 0
			.block
				display inline-block
				line-height 16px
				font-size 12px
				padding 8px 12px
				border-radius 1px
				margin-right 8px
				color rgb(77, 85, 93)
				.count
					font-size 8px
					margin-left 2px
				&.positive
					background rgba(0, 160, 220, 0.2)
					&.active
						background rgb(0, 160, 220)
						color #fff
				&.negative
					background rgba(77, 85, 93, 0.2)
					&.active
						background rgb(77, 85, 93)
						color #fff
		.switch
			padding 12px 18px
			border-bottom 1px solid rgba(7, 17, 27, 0.1)
			color rgb(147, 153, 159)
			font-size 0
			&.on
				.icon-check_circle
					color #00c850
			.icon-check_circle
				display inline-block
				vertical-align top
				margin-right 4px
				font-size 24px
				line-height 24px
			.text
				display inline-block
				vertical-align top
				font-size 12px
				line-height 24px
</style>
