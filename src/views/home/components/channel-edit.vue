<template>
  <div class="channel-edit">
    <div>
      <!-- 我的频道 -->
      <van-cell class="title-text" title="我的频道" :border="false">
        <van-button
          class="edit-btn"
          slot="right-icon"
          round
          plain
          type="danger"
          size="mini"
          @click="isEdit = !isEdit"
          >{{ isEdit ? '完成' : '编辑' }}
        </van-button>
      </van-cell>
      <van-grid :gutter="10" class="my-grid">
        <van-grid-item
          class="grid-item"
          v-for="(channel, index) in myChannels"
          :key="index"
          @click="onMyChannelClick(channel, index)"
        >
          <van-icon
            slot="icon"
            name="close"
            v-show="isEdit && !fiexdChannels.includes(channel.id)"
          ></van-icon>
          <span slot="text" class="text" :class="{ active: index === active }">
            {{ channel.name }}
          </span>
        </van-grid-item>
      </van-grid>
    </div>
    <!-- /我的频道 -->
    <!-- 推荐频道 -->
    <div>
      <van-cell class="title-text" title="频道推荐" :border="false"></van-cell>
      <van-grid :gutter="10" direction="horizontal" class="recommend-grid">
        <van-grid-item
          class="grid-item"
          v-for="(channel, index) in recommendChannels"
          :key="index"
          icon="plus"
          :text="channel.name"
          @click="onAddChannel(channel)"
        />
      </van-grid>
    </div>
    <!-- 推荐频道 -->
  </div>
</template>

<script>
import {
  getAllChannels,
  addUserChannel,
  deleteUserChannel
} from '@/api/channel'
import { mapState } from 'vuex'
import { setItem } from '@/utils/storage.js'
export default {
  name: 'ChannelEdit',
  components: {},
  props: {
    myChannels: {
      type: Array,
      required: true
    },
    active: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      allChannels: [],
      isEdit: false, // 控制编辑状态的显示
      fiexdChannels: [0] // 固定频道，不允许删除
    }
  },
  computed: {
    ...mapState(['user']),
    recommendChannels () {
      return this.allChannels.filter(channel => {
        return !this.myChannels.find(myChannel => {
          return myChannel.id === channel.id
        })
      })
    }
    // recommendChannels () {//简写⬆️
    //   const channels = []
    //   this.allChannels.forEach(channel => {
    //     // find 遍历数组，找到满足条件的元素项
    //     const ret = this.myChannels.find(myChannel => {
    //       return myChannel.id === channel.id
    //     })
    //     // 如果我的频道中不包括该频道项，则收集到推荐频道中
    //     if (!ret) {
    //       channels.push(channel)
    //     }
    //   })
    //   // 把计算结果返回
    //   return channels
    // }
  },
  watch: {},
  created () {
    this.loadAllChannels()
  },
  mounted () {},
  methods: {
    async loadAllChannels () {
      try {
        const { data } = await getAllChannels()
        this.allChannels = data.data.channels
      } catch (err) {
        console.log(err)
        this.$toast('全部频道获取失败！')
      }
    },
    // async onAddChannel (channel) {
    //   // return console.log(channel)
    //   this.myChannels.push(channel)
    //   // 数据持久化处理
    //   if (this.user) {
    //     // 已登录，把数据请求接口放到线上
    //     try {
    //       await addUserChannel({
    //         id: channel.id, // 频道ID
    //         seq: this.myChannels.length // 顺序序号
    //       })
    //     } catch (err) {
    //       this.$toast('保存失败，请稍后再试')
    //     }
    //   } else {
    //     // 未登录，把数据存储到本地
    //     setItem('TOUTIAO_CHANNELS', this.myChannels)
    //   }
    // },
    async onAddChannel (channel) {
      try {
        this.myChannels.push(channel)
        if (this.user) {
          // 已登录，数据存储到线上
          await addUserChannel([
            {
              id: channel.id, // 频道 id
              seq: this.myChannels.length // 频道的 序号
            }
          ])
        } else {
          // 未登录，数据存储到本地
          setItem('TOUTIAO_CHANNELS', this.myChannels)
        }
      } catch (err) {
        console.log(err)
        this.$toast('添加频道失败')
      }
    },
    onMyChannelClick (channel, index) {
      if (this.isEdit) {
        // 编辑状态下，删除频道
        // console.log('删除频道')
        // 1.如果是固定频道，则不删除
        if (this.fiexdChannels.includes(channel.id)) {
          return
        }
        // 2.删除频道项
        this.myChannels.splice(index, 1)
        // 参数1:要删除的元素的开始索引
        // 参数2:删除的个数，不指定，就从参数1开始删除到最后
        // 3.如果删除的激活频道之前的频道，则更新激活的频道项
        if (index <= this.active) {
          // 让激活频道的索引 -1
          this.$emit('updata-active', this.active - 1, true)
        }

        // 4.处理频道数据持久化
        this.deleteChannel(channel)
      } else {
        // 非编辑状态，切换频道
        this.$emit('updata-active', index, false)
      }
    },
    async deleteChannel (channel) {
      try {
        if (this.user) {
          // 已登录，把数据请求接口放到线上
          await deleteUserChannel(channel.id)
        } else {
          // 未登录，把数据存储到本地
          setItem('TOUTIAO_CHANNELS', this.myChannels)
        }
      } catch (error) {
        this.$toast('处理数据持久化失败，稍后再试')
      }
    }
  }
}
</script>

<style scoped lang="less">
.channel-edit {
  padding: 85px 0;
  .title-text {
    font-size: 32px;
    color: #333333;
  }
  .edit-btn {
    width: 104px;
    height: 48px;
    font-size: 26px;
  }
  .grid-item {
    width: 160px;
    height: 86px;
    z-index: 10;
  }

  /deep/.van-grid-item__content {
    background-color: #f4f5f6;
    border-radius: 10%;
    z-index: 10;
  }
  /deep/[class*='van-hairline']::after {
    border: none;
  }
  .text {
    font-size: 28px;
    color: #222;
  }
  .active {
    color: red;
  }
  /deep/i.van-icon.van-icon-close {
    font-size: 15px;
    position: absolute;
    top: -10px;
    right: -10px;
    color: red;
    z-index: 3;
  }
  /deep/.van-grid-item__icon-wrapper {
    position: unset; //取消组件的固定设置
  }
  //  推荐
  /deep/.recommend-grid {
    .van-icon-plus {
      font-size: 24px;
    }
    .van-grid-item__text {
      font-size: 28px;
      color: #222222;
      margin-left: 7px;
      white-space: nowrap; //文字内容不换行
    }
  }
}
</style>
