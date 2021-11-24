Languages = {
	ENGLISH: {
		DIGITS: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
		TITLES: ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"],
		OPERATIONS: ["MemoryClear", "MemoryRecall", "MemorySubtraction", "MemoryAddition", "MemoryStore", "Memory", "Percent", "Fraction", "Square", "SquareRoot", "Division", "Multipltication", "Subtraction", "Addition", "Clear", "ClearEntry", "Toggle negative/positive", "Decimal point", "Result", "Backspace"]
	},
	PERSIAN: {
		DIGITS: ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"],
		TITLES: ["صفر", "یک", "دو", "سه", "چهار", "پنج", "شش", "هفت", "هشت", "نه"],
		OPERATIONS: ["پاک حافظه", "یادآوری حافظه", "تفریق حافظه", "افزودنی حافظه", "حافظه", "حافظه","درصد", "کسر", "مربع", "ریشه دوم", "بخش", "ضرب", "منها کردن", "علاوه بر این", "پاک کردن", "ورود پاک کنید", "منفی / مثبت را تغییر دهید", "نقطه اعشار", "نتیجه", "فضای پشتی"]
	},
	ARABIC: {
		DIGITS: ["۰", "۱", "۲", "٣", "٤", "٥", "٦", "۷", "۸", "۹"],
		TITLES: ["صفر", "یک", "دو", "سه", "چهار", "پنج", "شش", "هفت", "هشت", "نه"],
		OPERATIONS: ["مسح الذاكرة", "استدعاء الذاكرة", "طرح الذاكرة", "إضافة الذاكرة", "مخزن الذاكرة", "الذاكرة","درصد", "کسر", "مربع", "ریشه دوم", "بخش", "ضرب", "منها کردن", "علاوه بر این", "پاک کردن", "ورود پاک کنید", "منفی / مثبت را تغییر دهید", "نقطه اعشار", "نتیجه", "فضای پشتی"]
	},
	CHINESE: {
		DIGITS: ["〇", "一", "二", "三", "四", "五", "六", "七", "八", "九"],
		TITLES: ["零", "壹", "贰", "参", "肆", "伍", "陆", "柒", "捌", "玖"],
		OPERATIONS: ["存储器清除", "存储器调用", "存储器减法", "存储器添加", "存储器存储", "存储器", "百分", "分数", "广场", "平方根", "师", "乘法", "减法", "加成", "明确", "清除输入", "切换负/正", "小数点", "结果", "退格键"]
	},

	changeLanguage: (number, toLang, fromLang = Languages.ENGLISH) => {
		function propName(propName){
			for(let prop in Languages) {
				if (Languages[prop] == propName) {					
					return prop;
				}
			}
			
			return undefined;
		}

		fromLang = propName(fromLang);
		toLang = propName(toLang);

		if (undefined === number || number === String.POINT || undefined === toLang) {			
			return number;
		}

		let translatedValue = String.EMPTY;

		number.toString().split(String.EMPTY).forEach(digit => {
			if (digit == String.EMPTY || digit == String.POINT || digit == String.THOUSAND_SEPARATOR) {
				translatedValue += digit;
			} else {
				const digitIndexInTheAlphabet = Languages[fromLang].DIGITS.indexOf(digit);
				
				translatedValue += Languages[toLang].DIGITS[digitIndexInTheAlphabet];
			}
		});

		return translatedValue;
	}
};