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

/**
 * 精确将分转为元
 * @param {Object} fen 金额(分) 100分=1元
 */
export function convertFenToYuan(fen) {
  if (!fen) return 0
  // 将分转换为元，过程中放大100倍
  let yuan = fen / 100;
  // 创建一个足够大的基数（这里是100）的幂次，用于去除不需要的小数位
  const base = 10;
  const precision = 2;
  const multiplier = base ** precision;
  // 四舍五入并转为整数，然后再除以基数的幂次，得到精确到小数点后两位的结果
  return (Math.round(yuan * multiplier) / multiplier);
}