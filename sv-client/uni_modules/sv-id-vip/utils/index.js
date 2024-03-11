/**
 * 创建cdkey
 * @param {number} segments 分段数 默认5
 * @param {number} segmentLength 段字长 默认5
 * @return {string} xxxxx-xxxxx-xxxxx-xxxxx-xxxxx
 */
export function createCDKey(segments = 5, segmentLength = 5) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
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
 * @param {number} segments 分段数 默认5 和createCDKey保持一致
 * @param {number} segmentLength 段字长 默认5 和createCDKey保持一致
 * @return {boolean}
 */
export function validCDKey(cdKey, segments = 5, segmentLength = 5) {
  const regexPattern = new RegExp(`^(?:[A-Za-z0-9]{${segmentLength}}-){${segments-1}}[A-Za-z0-9]{${segmentLength}}$`);
  return regexPattern.test(cdKey);
}