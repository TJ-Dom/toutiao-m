<template>
  <div class="update-photo">
    <img class="img" :src="img" ref="img" />
    <div class="toolbar">
      <div class="cancel" @click="$emit('close')">取消</div>
      <div class="confirm" @click="onConfirm">完成</div>
    </div>
  </div>
</template>

<script>
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'
import { updateUserPhoto } from '@/api/user/login'
export default {
  name: 'UpdatePhoto',
  components: {},
  props: {
    img: {
      type: [String, Object],
      required: true
    }
  },
  data () {
    return {
      cropper: null // 获取截图结果数据
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {
    const image = this.$refs.img
    this.cropper = new Cropper(image, {
      viewMode: 1,
      dragMode: 'move',
      aspectRatio: 1,
      autoCropArea: 1,
      cropBoxMovable: false,
      cropBoxResizable: false,
      background: false,
      movable: true
    })
  },
  methods: {
    onConfirm () {
      // 加loading
      this.$toast.loading({
        message: '更新中...', // 展示提示
        forbidClick: true, // 禁用按钮
        duration: 0 // 持续时间，不限
      })
      // 获得结果的两种方式：getData() getCroppedCanvas()
      // 基于服务端的裁切使用 getData() 获取裁切参数
      // 纯客户端的裁切使用 getCroppedCanvas() 获取裁切的文件对象
      this.cropper.getCroppedCanvas().toBlob(
        async blob => {
          // 接口需要传值的Content-Type是multipart/form-data，必须传递 FormData 对象
          const formData = new FormData()
          // Pass the image file name as the third parameter if necessary.
          formData.append('photo', blob /*, 'example.png' */)
          try {
            const { data } = await updateUserPhoto(formData)
            // console.log(data)
            // 关闭弹出层
            this.$emit('close')
            // 更新视图
            this.$emti('update-photo', data.data.phone)
            // 提示
            this.$toast.success('更细成功！')
          } catch (err) {
            let message = '更新失败，请稍后再试！'
            if (err.response && err.response.status === 401) {
              message = '用户登录已超时，请重新登录！'
            }
            this.$toast.fail(message)
          }

          // Use `jQuery.ajax` method for example
          // $.ajax('/path/to/upload', {
          //   method: 'POST',
          //   data: formData,
          //   processData: false,
          //   contentType: false,
          //   success () {
          //     console.log('Upload success')
          //   },
          //   error () {
          //     console.log('Upload error')
          //   }
          // })
        } /*, 'image/png' */
      )
    }
  }
}
</script>

<style scoped lang="less">
.update-photo {
  background-color: #000;
  height: 100%;
  .toolbar {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .cancel,
    .confirm {
      width: 100px;
      height: 100px;
      font-size: 34px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
    }
  }
}
.img {
  // cropperjs的css要求
  display: block;
  max-width: 100%;
}
</style>
