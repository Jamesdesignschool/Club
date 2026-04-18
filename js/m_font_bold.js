
    window.addEventListener('load', function() {
        try {
            const viewIds = window.parent.getComputedStyle(
                window.parent.document.documentElement
            ).getPropertyValue('--web-view-ids').trim();

            // viewId → elementId 매핑
            const map = {
                'index_m':        'index_m',
                'vr_hud':       'vr_hud',
                'r_d':          'r_d',
				'adv':          'adv',             
				"editorial":    'editorial',
                "brand":        'brand',
                "interior":     'interior',
                "iot":          'iot',
                "education":    'education',
				"contact":      'contact'
            };


            const targetId = map[viewIds];
            if (targetId) {
                const target = document.getElementById(targetId);
                if (target) {

                    // 기본 스타일
                    target.style.fontWeight = 'bold';
                    // target.style.fontSize = '16x';
                    // target.style.transform = 'translateY(-2px)';  // 10px 위로
					// target.style.opacity = '1';
                    target.style.color = '#001f4f';  // 빨간색
                }
            }

        } catch(e) {
            console.error('부모 페이지 접근 실패:', e);
        }
    });

    
