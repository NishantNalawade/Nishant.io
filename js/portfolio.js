'use strict';

(function () {
	var motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
	if (motionPreference.matches || !('IntersectionObserver' in window) ||
		!('animate' in Element.prototype)) {
		return;
	}

	var animations = new Set();
	var observer = new IntersectionObserver(function (entries) {
		entries.forEach(function (entry) {
			if (!entry.isIntersecting) {
				return;
			}

			observer.unobserve(entry.target);
			var animation = entry.target.animate([
				{ opacity: 0, transform: 'translateY(20px)' },
				{ opacity: 1, transform: 'translateY(0)' }
			], {
				duration: 650,
				easing: 'cubic-bezier(0.22, 1, 0.36, 1)'
			});
			animations.add(animation);
			animation.onfinish = function () {
				animations.delete(animation);
			};
		});
	}, { threshold: 0.1 });

	document.querySelectorAll(
		'[data-reveal]'
	).forEach(function (element) {
		observer.observe(element);
	});

	motionPreference.addEventListener('change', function (event) {
		if (event.matches) {
			observer.disconnect();
			animations.forEach(function (animation) {
				animation.cancel();
			});
			animations.clear();
		}
	});
})();
