<template>
  <!-- 天气时钟 -->
  <div
    :class="[
      'weather-time',
      status.siteStatus,
      status.mainBoxBig &&
      status.siteStatus !== 'normal' &&
      status.siteStatus !== 'focus'
        ? 'hidden'
        : null,
    ]"
    @click.stop
  >
    <div
      :class="['time', set.timeStyle]"
      @click.stop="
        status.setSiteStatus(
          status.siteStatus !== 'normal' && status.siteStatus !== 'focus'
            ? 'normal'
            : 'box'
        )
      "
    >
      <span class="hour">{{ timeData.hour ?? "00" }}</span>
      <span class="separator" :key="set.showSeconds">:</span>
      <span class="minute">{{ timeData.minute ?? "00" }}</span>
      <template v-if="set.showSeconds">
        <span class="separator">:</span>
        <span class="second">{{ timeData.second ?? "00" }}</span>
      </template>
    </div>
    <div class="date">
      <span class="month">{{ timeData.month ?? "0" }}</span>
      <span class="day">{{ timeData.day ?? "0" }}</span>
      <span class="weekday">{{ timeData.weekday ?? "星期八" }}</span>
    </div>
    <div v-if="weatherShow" class="weather">
      <span class="status">{{ weatherData.condition ?? "N/A" }}</span>
      <span class="temperature">{{ weatherData.temp ?? "N/A" }} ℃</span>
      <span class="wind">{{ weatherData.windDir ?? "N/A" }}</span>
      <span v-if="weatherData.windLevel" class="wind-level">
        {{ weatherData.windLevel }} 级
      </span>
    </div>
  </div>
</template>

<script setup>
import { getCurrentTime } from "@/utils/timeTools";
import { ref, onMounted, onBeforeUnmount } from "vue";
import { statusStore, setStore } from "@/stores";
import { getWeather } from "@/api";

const set = setStore();
const status = statusStore();

// 时间数据
const timeData = ref({});
const timeInterval = ref(null);

// 天气数据
const weatherShow = ref(true);
const weatherData = ref({});

// 更新时间
const updateTimeData = () => {
  timeData.value = getCurrentTime();
};

// 获取天气数据
const getWeatherData = () => {
  // 当前时间戳
  const currentTime = Date.now();
  // 上次获取天气数据的数据
  let lastWeatherData = JSON.parse(localStorage.getItem("lastWeatherData")) || {
    data: {},
    lastFetchTime: 0,
  };
  // 上次获取天气数据的时间戳与当前时间的时间差（毫秒）
  const timeDifference = currentTime - lastWeatherData.lastFetchTime;
  // 是否超出 2 分钟
  if (timeDifference >= 2 * 60 * 1000) {
    getWeather()
      .then((res) => {
        console.log(res);
        weatherData.value = res.result.condition;
        lastWeatherData = {
          data: res.result.condition,
          lastFetchTime: currentTime,
        };
        // 将新的天气数据和时间戳存储到 localStorage 中
        localStorage.setItem(
          "lastWeatherData",
          JSON.stringify(lastWeatherData)
        );
      })
      .catch((error) => {
        console.error("天气获取失败：" + error);
        $message.warning("天气获取失败", {
          duration: 1500,
        });
        weatherShow.value = false;
      });
  } else {
    console.log("从缓存中读取天气数据");
    weatherData.value = lastWeatherData.data;
  }
};

onMounted(() => {
  // 时间
  updateTimeData();
  timeInterval.value = setInterval(updateTimeData, 1000);
  // 天气
  getWeatherData();
});

onBeforeUnmount(() => {
  clearInterval(timeInterval.value);
});
</script>

<style lang="scss" scoped>
.weather-time {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
  transform: translateY(-140px);
  color: var(--main-text-color);
  animation: fade-time-in 0.6s cubic-bezier(0.21, 0.78, 0.36, 1);
  transition: transform 0.3s, opacity 0.5s;
  z-index: 1;
  &.focus {
    transform: translateY(-180px);
  }
  &.box,
  &.set {
    transform: translateY(-220px);
  }
  &.hidden {
    transform: translateY(-180px);
    opacity: 0;
  }
  .time {
    cursor: pointer;
    font-size: 3rem;
    margin: 6px 0px;
    text-shadow: var(--main-text-shadow);
    transition: transform 0.3s;
    .separator {
      opacity: 0.8;
      font-size: 2.8rem;
      display: inline-block;
      margin: 0 5px;
      transform: translateY(-4px);
      animation: separator-breathe 0.7s infinite alternate;
    }
    &:hover {
      transform: scale(1.08);
    }
    &:active {
      transform: scale(1);
    }
  }
  .date {
    font-size: 1.15rem;
    opacity: 0.8;
    margin: 4px 0px;
    text-shadow: var(--main-text-shadow);
    .month {
      &::after {
        margin: 0 4px;
        content: "月";
      }
    }
    .day {
      &::after {
        margin: 0 8px 0 4px;
        content: "日";
      }
    }
  }
  .weather {
    opacity: 0.7;
    font-size: 1rem;
    text-shadow: var(--main-text-shadow);
    .temperature {
      margin: 0 6px;
    }
    .wind-level {
      margin-left: 6px;
    }
  }
}
</style>
