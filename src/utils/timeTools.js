/**
 * 获取当前时间
 * @returns {Object} 时间对象
 */
export const getCurrentTime = () => {
  const time = new Date();
  // 格式化
  const formatTime = (value) => (value < 10 ? "0" + value : value);
  // 处理时间
  const year = time.getFullYear();
  const month = time.getMonth() + 1;
  const day = formatTime(time.getDate());
  const hour = formatTime(time.getHours());
  const minute = formatTime(time.getMinutes());
  const second = formatTime(time.getSeconds());
  const weekdayArr = ["日", "一", "二", "三", "四", "五", "六"];
  const weekday = "周" + weekdayArr[time.getDay()];
  // 返回时间
  const currentTime = {
    year,
    month,
    day,
    hour,
    minute,
    second,
    weekday,
  };
  return currentTime;
};

/**
 * 根据实时时间返回不同的问候语
 * @returns {string} 问候语
 */
export const getGreeting = () => {
  const currentTime = new Date();
  const currentHour = currentTime.getHours();
  let greeting = "";
  if (currentHour >= 5 && currentHour < 9) {
    greeting = "早上好";
  } else if (currentHour >= 9 && currentHour < 12) {
    greeting = "上午好";
  } else if (currentHour >= 12 && currentHour < 18) {
    greeting = "下午好";
  } else if (currentHour >= 18 && currentHour < 24) {
    greeting = "晚上好";
  } else if (currentHour >= 0 && currentHour < 5) {
    greeting = "凌晨好";
  } else {
    greeting = "夜深了";
  }
  return greeting;
};
