export function getTimeAgo(date: string) {
  const ONE_MINUTE = 60 * 1000; // 1分钟的毫秒数
  const ONE_HOUR = 60 * ONE_MINUTE; // 1小时的毫秒数
  const ONE_DAY = 24 * ONE_HOUR; // 1天的毫秒数
  const ONE_WEEK = 7 * ONE_DAY; // 1周的毫秒数
  const ONE_MONTH = 30 * ONE_DAY; // 1个月的毫秒数

  const now = new Date().getTime();
  const inputDate = new Date(date).getTime();
  const timeDiff = now - inputDate;

  if (timeDiff < ONE_HOUR) {
    const minutes = Math.floor(timeDiff / ONE_MINUTE);
    return `${minutes}分钟前`;
  } else if (timeDiff < ONE_DAY) {
    const hours = Math.floor(timeDiff / ONE_HOUR);
    return `${hours}小时前`;
  } else if (timeDiff < ONE_WEEK) {
    const days = Math.floor(timeDiff / ONE_DAY);
    return `${days}天前`;
  } else if (timeDiff < ONE_MONTH) {
    const weeks = Math.floor(timeDiff / ONE_WEEK);
    return `${weeks}周前`;
  } else {
    const months = Math.floor(timeDiff / ONE_MONTH);
    return `${months}月前`;
  }
}

export function formatDate(dateString: string) {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = months[date.getMonth()];
  const day = date.getDate();
  return `${month} ${day}, ${year}`;
}
