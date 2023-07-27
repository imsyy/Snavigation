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
