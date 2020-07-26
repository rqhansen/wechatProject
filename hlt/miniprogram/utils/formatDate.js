/**
 * 将时间戳转换为日期格式： 2020-07-20 05:08:20
 * @param {number} timeStamp 时间戳
 */
function timeStampToString(timeStamp){
    const dt = new Date(timeStamp);
    const y = dt.getFullYear();

    let m = dt.getMonth() + 1;
    m = m >= 10 ? m : `0${m}`;

    let d = dt.getDate();
    d = d >= 10 ? d : `0${d}`;

    let h = dt.getHours();
    h = h >= 10 ? h : `0${h}`;

    let minute = dt.getMinutes();
    minute = minute >= 10 ? minute : `0${minute}`;

    let s = dt.getSeconds();
    s = s >= 10 ? s : `0${s}`;
    return `${y}-${m}-${d} ${h}:${minute}:${s}`;
  }

  export {
      timeStampToString
  }