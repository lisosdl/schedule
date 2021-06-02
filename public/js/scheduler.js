$(function() {
	$(".scheduler .day").click(function() {
		const stamp = $(this).data('stamp');
		const url = "/schedule?stamp=" + stamp;
		yh.layer.popup(url, 400, 500);
	});
	
	$('body').on('click', '#frmSchedule .save', function() {
		try {
			if (!frmSchedule.title.value) {
				throw new Error("일정 제목을 입력하세요.");
			}
			
			if (!frmSchedule.startDate.value) {
				throw new Error("시작일을 입력하세여.");
			}
			
			if (!frmSchedule.endDate.value) {
				throw new Error("종료일을 입력하세요.");
			}
		} catch (err) {
			alert(err.message);
			return;
		}
		
		const qs = $("#frmSchedule").seialize();
		
		axios.post('/schedule', qs)
				.then(function(response) {
					if (res.data.success) {
						location.reload();
					} else {
						alert('스케줄 등록 실패');
					}
				})
				catch(function(err) {
					console.error(err);
				});
	});
});