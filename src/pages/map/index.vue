<template>
  <div class="map">
    <div class="swiper-tab">
      <div :class="['swiper-tab-list',currentTab == 0 ? 'on' : '']" data-current="0" bindtap="swichNav">高速</div>
      <div :class="['swiper-tab-list',currentTab == 1 ? 'on' : '']" data-current="1" bindtap="swichNav1">停车</div>
      <div :class="['swiper-tab-list',currentTab == 2 ? 'on' : '']" data-current="2" bindtap="swichNav2">加油</div>
    </div>
    <div class="height"></div>
    <div class="swiper-box" bindchange="bindChange">
      <div :class="[selected ? 'show' : 'hidden']">
        <div>
          <map id="map" :longitude="longitude" :latitude="latitude" scale="12" :controls="controls" bindcontroltap="controltap" :markers="markers" bindmarkertap="markertap" :polyline="polyline" bindregionchange="regionchange" show-location style="width: 100%; height: 1300rpx;"></map>
        </div>
      </div>
      <div :class="[selected1?'show':'hidden']">我是呵呵</div>
      <div :class="[selected2?'show':'hidden']">我是嘿嘿</div>
    </div>
  </div>
</template>
<script>
import mapIcon from '@/assets/common/map.png'
export default {
  name: 'map',
  data() {
    return {
      winWidth: 0,
      winHeight: 0,
      // tab切换
      currentTab: 0,
      latitude: '',
      longitude: '',
      selected: true,
      selected1: false,
      selected2: false,
      //坐标位置
      markers: [{
        id: 0,
        latitude: 43.919786,
        longitude: 125.551726,
        width: 20,
        height: 20,
        iconPath: mapIcon,
        callout: {
          padding: 5,
          content: '莲花山'
        }
      }, {
        id: 1,
        latitude: 43.969333,
        longitude: 125.656916,
        width: 20,
        height: 20,
        iconPath: mapIcon,
        callout: {
          content: '龙嘉机场',
          padding: 5,
        }
      }, {
        id: 2,
        latitude: 43.891020,
        longitude: 125.449530,
        width: 20,
        height: 20,
        iconPath: mapIcon,
        callout: {
          content: '长春东',
          padding: 5,
        }
      }]
    }
  },
  onLoad(options) {
    var that = this;
    // 获取系统信息
    wx.getSystemInfo({
      success: function(res) {
        that.winWidth = res.windowWidth;
        that.winHeight = res.windowHeight;
      }
    });
    wx.getLocation({
      type: 'wgs84',
      success: function(res) {
        var latitude = res.latitude
        var longitude = res.longitude
        var speed = res.speed
        var accuracy = res.accuracy
        that.latitude = latitude;
        that.longitude = longitude;
      }
    });
  },
  methods: {
    markertap(e) {
      var id = e.markerId
      var latitude = this.markers[id].latitude;
      var longitude = this.markers[id].longitude;
    },
    bindChange(e) {
      this.currentTab = e.detail.current;
    },
    swichNav(e) {
      this.selected = true;
      this.selected1 = true;
      this.selected2 = false;
      var that = this;
      if (this.currentTab === e.target.dataset.current) {
        return false;
      } else {
        that.currentTab = e.target.dataset.current;
      }
    }
  }
}
</script>
<style scoped>
.map {
  width: 100%;
  height: 100%;
}

.swiper-tab {
  width: 100%;
  text-align: center;
  line-height: 80rpx;
  height: 100rpx;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 99;
  background: #fff;
}

.swiper-tab-list {
  height: 70rpx;
  line-height: 70rpx;
  font-size: 30rpx;
  display: inline-block;
  width: 22%;
  color: #777;
  margin: 0 5%;
}

.on {
  color: #ea4e3d;
  border-bottom: 2rpx solid #ea4e3d;
}

.swiper-box {
  display: block;
  height: 100%;
  width: 100%;
  overflow: hidden;
}

.swiper-box view {
  height: 100%;
  text-align: center;
}

#map {
  height: 100%;
}

.top {
  margin-top: 100px;
}

.show {
  display: block;
  text-align: center;
}

.hidden {
  display: none;
  text-align: center;
}

.zdex {
  z-index: -10;
}
</style>
