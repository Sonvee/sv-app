import config from '../config.js'

/**
 * 创建cdkey
 * @return {String} cdkey
 */
export function createCDKey() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const {
    segments,
    segmentLength
  } = config.cdkey

  const cdKey = Array(segments)
    .fill(null)
    .flatMap(() => [
      [...Array(segmentLength)].map(() => chars[Math.floor(Math.random() * chars.length)]).join(''),
      '-'
    ])
    .slice(0, -1); // 去掉最后一个破折号
  return cdKey.join('');
}

/**
 * cdkey校验
 * @param {string} cdKey 要校验的cdkey
 * @return {boolean} 是否校验成功
 */
export function validCDKey(cdKey) {
  const {
    segments,
    segmentLength
  } = config.cdkey

  const regexPattern = new RegExp(`^(?:[A-Za-z0-9]{${segmentLength}}-){${segments-1}}[A-Za-z0-9]{${segmentLength}}$`);
  return regexPattern.test(cdKey);
}