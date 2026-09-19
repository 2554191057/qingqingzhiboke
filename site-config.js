/* =============================================
   全站公共配置 · 出生日期相关
   改生日只改这一处，全站（index.html / birthday.html）自动同步
   月份用 1-12 的真实数字（内部自动转 0-based）
   ============================================= */
(function () {
  'use strict';

  // 我的生日（公历）
  const BIRTHDAY = { year: 2007, month: 8, day: 6 };

  // 十二星座（按公历月日区间）
  const ZODIAC = [
    { name: '摩羯座', icon: '♑', from: [12, 22], to: [1, 19] },
    { name: '水瓶座', icon: '♒', from: [1, 20], to: [2, 18] },
    { name: '双鱼座', icon: '♓', from: [2, 19], to: [3, 20] },
    { name: '白羊座', icon: '♈', from: [3, 21], to: [4, 19] },
    { name: '金牛座', icon: '♉', from: [4, 20], to: [5, 20] },
    { name: '双子座', icon: '♊', from: [5, 21], to: [6, 21] },
    { name: '巨蟹座', icon: '♋', from: [6, 22], to: [7, 22] },
    { name: '狮子座', icon: '♌', from: [7, 23], to: [8, 22] },
    { name: '处女座', icon: '♍', from: [8, 23], to: [9, 22] },
    { name: '天秤座', icon: '♎', from: [9, 23], to: [10, 23] },
    { name: '天蝎座', icon: '♏', from: [10, 24], to: [11, 22] },
    { name: '射手座', icon: '♐', from: [11, 23], to: [12, 21] }
  ];

  function getZodiac(month, day) {
    for (let i = 0; i < ZODIAC.length; i++) {
      const z = ZODIAC[i];
      const fm = z.from[0], fd = z.from[1], tm = z.to[0], td = z.to[1];
      if (fm === tm) {
        if (month === fm && day >= fd && day <= td) return z;
      } else {
        // 跨年星座（摩羯 12 月 - 1 月）
        if ((month === fm && day >= fd) || (month === tm && day <= td)) return z;
      }
    }
    return ZODIAC[0];
  }

  // 当前年龄（生日已过则长一岁）
  function getAge() {
    const now = new Date();
    let age = now.getFullYear() - BIRTHDAY.year;
    const mDiff = now.getMonth() - (BIRTHDAY.month - 1);
    if (mDiff < 0 || (mDiff === 0 && now.getDate() < BIRTHDAY.day)) age--;
    return age;
  }

  // 下一个生日 0 点（今年已过取明年）
  function nextBirthday() {
    const now = new Date();
    const y = now.getFullYear();
    let b = new Date(y, BIRTHDAY.month - 1, BIRTHDAY.day, 0, 0, 0, 0);
    if (b.getTime() <= now.getTime()) b = new Date(y + 1, BIRTHDAY.month - 1, BIRTHDAY.day, 0, 0, 0, 0);
    return b;
  }

  // 今天是否为生日
  function isBirthdayToday() {
    const now = new Date();
    return now.getMonth() === (BIRTHDAY.month - 1) && now.getDate() === BIRTHDAY.day;
  }

  // 格式化出生日期文本，如 "2007 年 8 月 6 日"
  function formatBirthDate() {
    return BIRTHDAY.year + ' 年 ' + BIRTHDAY.month + ' 月 ' + BIRTHDAY.day + ' 日';
  }

  function getZodiacInfo() {
    return getZodiac(BIRTHDAY.month, BIRTHDAY.day);
  }

  window.SITE_BIRTH = {
    BIRTHDAY: BIRTHDAY,
    getAge: getAge,
    nextBirthday: nextBirthday,
    isBirthdayToday: isBirthdayToday,
    formatBirthDate: formatBirthDate,
    getZodiacInfo: getZodiacInfo
  };
})();
