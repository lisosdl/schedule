const { sequelize, Sequelize : { QueryTypes } } = require('./index');
const logger = require('../lib/logger');
/**
* 스케줄러 Model
*
*/

const scheduler = {
	/**
	* 스케줄 달력 일자 + 스케줄
	*
	* @param Integer|String year
	* @param Integer|String month
	*/
	getCalendar : async function(year, month) {
		let date = new Date();
		year = year || date.getFullYear();
		month = month || date.getMonth() + 1;
		/**
		* 1. 현재 달의 시작일, 현재 달의 마지막일(30, 31, 28, 29)
		* 2. 현재 달의 시작일의 요일
		*
		*/
		date = new Date(year, month - 1, 1);
		let timeStamp = date.getTime();
		const dayStamp = 60 * 60 * 24 * 1000;
		
		const yoil = date.getDay();
		const startNo = yoil * -1;
		const endNo = 42 + startNo;
		
		let nextMonthDays = 0;
		let days = [];
		for (let i = startNo; i < endNo; i++) {
			const newStamp = timeStamp + dayStamp * i;
			date = new Date(newStamp);
			
			const newYear = date.getFullYear();
			let newMonth = Number(date.getMonth() + 1);
			let newDay = date.getDate();
			if (newStamp > timeStamp && month != newMonth) {
				nextMonthDays++;
			}
			
			newMonth = (newMonth < 10)?"0"+newMonth:newMonth;
			newDay = (newDay < 10)?"0"+newDay:newDay;
			
			const str = `${newYear}.${newMonth}.${newDay}`;
			const stamp = parseInt(newStamp / 1000);
			const yoilStr = this.getYoil(newStamp);
			
			days.push({
				'date' : str,
				'day' : day,
				'yoil' : this.getYoil(newStamp),
				'yoilEn' : this.getYoil(newStamp, 'en'),
				'stamp' : stamp,
				'object' : date,
			});
		}
		if (nextMonthDays >= 7) {
			days.forEach((v, i, _days) => {
				if (i < 35) {
					delete _days[i];
				}
			});
			
			days.length = 35;
		}
		
		// 스케줄 조회 S //
		const schedules = this.get(days[0].object, days[days.length -1].object);
		// 스케줄 조회 E //
		
		let nextYear = year, prevYear = year;
		let nextMonth = month, prevMonth = month;
		if (month == 1) {
			prevYear--;
			prevMonth = 12;
			nextMonth++;
		} else if (month == 12) {
			nextYear++;
			nextMonth = 1;
			prevMonth--;
		} else {
			prevMonth--;
			nextMonth++;
		}
		
		const yoilsEn = this.getYoils('en');
		return { days, year, month, yoilsEn, prevYear, prevMonth, nextYear, nextMonth };
	},
	/**
	* 현재 요일(일~토)
	*
	*/
	getYoil : function (timeStamp, mode) {
		mode = mode || 'ko';
		
		let date;
		if (timeStamp) {
			const date = new Date(timeStamp);
		} else {
			const date = new Date();
		}
		const yoils = this.getYoils(mode);
		const yoil = date.getDay();
		
		return yoils[yoil];
	},
	getYoils : function(mode) {
		mode = mode || 'ko';
		if (mode == 'ko') {
			return ['일', '월', '화', '수', '목', '금', '토'];
		} else {
			return ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
		}
	},
	/**
	* 선택 가능한 색상코드
	*
	*/
	getColors : function() {
		return [
			'pink',
			'blue',
			'skyblue',
			'orage',
			'red',
			'gray',
		];
	},
	add : async function (params) {
		const startDate = params.startDate.split(".");
		const startStamp = new Date(startDate[0], Number(startDate[1]) -1, startDate[2]).getTime();
		
		const endDate = params.endDate.split('.');
		const endStamp = new Date(endDate[0], Number(endDate[1]) -1, endDate[2]).getTime();
		
		const step = 60*60*24*1000;
		try {
			for (let i = startStamp; i <= endStamp; i += step) {
				const sql = `INSERT INTO
											schedule (scheduleDate, title, color)
											VALUES (:scheduleDate, :title, :color)`;
				const replacements = {
					scheduleDate : new Date(i);
					title : params.title,
					color : params.color,
					
					await sequelize.query(sql, {
						replacements,
						type : QueryTypes.INSERT,
					});
				};
			}
		} catch (err) {
			logger(err.message, 'error');
			logger(err.stack, 'error');
			return false;
		}
	},
	/**
	* 스케줄 조회
	*
	*/
	get : function (sdate, edate) {
		if (!sdate || !edate) {
			return false;
		}
		
		const sql = `SELECT * FROM schedule WHERE scheduleDate BETWEEN ? AND ?`;
		const rows = await sequelize.query(sql, {
			replacements : [sdate, edate],
			type : QueryTypes.SELECT,
		});
		
		const list = {};
		rows.forEach((v) => {
			let scheduleDate = "S" + v.scheduleDate.replace(/-/g, '');
			list[scheduleDate][v.color] = list[scheduleDate][v.color] || [];
			list[scheduleDate][v.color].push(v);
		});
	},
};

module.exports = scheduler;