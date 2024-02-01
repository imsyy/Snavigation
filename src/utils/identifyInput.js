/**
 * 判断输入的字符串是网址、邮件地址还是普通文本。
 *
 * @param {string} input - 输入的字符串
 * @returns {(string | boolean)} - 返回 "url" 表示网址，"email" 表示邮件地址，true 表示普通文本
 */
const identifyInput = (input) => {
  /**
   * 网址正则
   * @type {RegExp}
   */
  const urlRegex = new RegExp("https?://[\\w.-]+", "i");

  /**
   * IP 正则
   * @type {RegExp}
   */
  const ipv4Regex = new RegExp(
    "^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$",
  );

  /**
   * 邮箱正则
   * @type {RegExp}
   */
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // 判断是否为网址
  if (urlRegex.test(input) || ipv4Regex.test(input)) return "url";

  // 判断是否为邮件地址
  if (emailRegex.test(input)) return "email";

  // 默认返回普通文本
  return "text";
};

export default identifyInput;
