const scheduler = require('../models/scheduler');
const express = require('express');
const logger = require('../lib/logger');
const { validator } = require('../middlewares/validator');
const router = express.Router();

router.get('/', async (req, res, next) => {
	const data = scheduler.getCalendar(req.query.year, req.query.month);
	console.log(data);
	res.render('main', data);
});

router.route('/schedule')
		// 스케줄 조회
		.get((req, res, next) => {
			const stamp = req.query.stamp;
			if (!stamp) {
				return res.send("<script>alert('잘못된 접근입니다.');yh.layer.close();</script>");
			}
			
			const data = {
				stamp,
				colors : scheduler.getColors(),
			};
			res.render("form", data);
		})
		// 스케줄 등록
		.post(validator, async (req, res, next) => {
			const result = scheduler.add(req.body);
			
			return res.json({ success : result });
		})
		// 스케줄 수정
		.patch((req, res, next) => {
			
		})
		// 스케줄 사제
		.delete((req, res, next) => {
			
		});
		
module.exports = router;