export default (second) => {
  if(second === undefined || !second ) {
    return '0 mins'
  }

  const sec_num = parseInt(second, 10);
  let day = Math.floor(sec_num / 28800);
  let hours   = Math.floor((sec_num - (day * 28800)) / 3600);
  let minutes = Math.floor((sec_num - ((hours * 3600) + (day * 28800))) / 60);

  if (day <= 0) { day = '' } else { day = day + ' day ' }
  if (hours <= 0) { hours = '' } else { hours = hours + ' hours '; }
  if (minutes <= 0) { minutes = '' } else { minutes = minutes + ' mins'; }
  return day + hours + minutes;
}

export function getHour(second) {
  if(second === undefined || !second ) {
    return 0
  }
  const sec_num = parseInt(second, 10);
  return parseFloat((sec_num / 3600).toFixed(2));
}

export function getMonday(d) {
  d = new Date(d);
  var day = d.getDay(),
      diff = d.getDate() - day + (day === 0 ? -6:1);
  return new Date(d.setDate(diff));
}

export function dateFormat(date, separator) {
  if( separator === null || separator === undefined ) {
    separator = '-'
  }
  var year  = date.getFullYear();
  var month = ("0" + (date.getMonth() + 1)).slice(-2);
  var day   = ("0" + date.getDate()).slice(-2);
  return String(year) + separator + String(month) + separator + String(day);
}

const getDate = (day_later, currentDate) => {
  if( currentDate === undefined || !currentDate ) {
    currentDate = new Date();
  }
  var date = new Date(currentDate);
  date.setDate(date.getDate() + day_later);
  return dateFormat(date);
};

export function renderDateArray(currentDate, dayOfWeek) {
  if( currentDate === undefined || !currentDate ) {
    currentDate = new Date();
  }
  if( dayOfWeek === undefined || !dayOfWeek ) {
    dayOfWeek = 7;
  }
  let dateArray = [];
  for (let i = 0; i < (dayOfWeek); i++) {
    dateArray.push(getDate(i, currentDate))
  }
  dateArray.sort((a,b) => a.date > b.date)
  return dateArray;
}
