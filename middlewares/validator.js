module.exports.validator = (req, res, next) => {
	
	const required = {
		color : '색상을 입력하세요',
		title : '일정제목을 입력하세요',
		startDate : '시작일을 입력하세요.',
		endDate : '종료일을 입력하세요.',
	};
	try {
		for (column in required) {
			if (!req.body[column]) {
				throw new Error(required[column]);
			}
		}
	} catch (err) {
		return res.send(`<script>alert('${err.message}');</script>`);
	}
	next();
};