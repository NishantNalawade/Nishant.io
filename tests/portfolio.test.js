const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const { test } = require('node:test');
const { runInNewContext } = require('node:vm');

const source = readFileSync(join(__dirname, '..', 'js', 'portfolio.js'), 'utf8');

function setup({ reduced = false, supported = true } = {}) {
	const state = { observed: [], unobserved: [], animations: [], disconnected: false };
	const preference = {
		matches: reduced,
		addEventListener(type, callback) {
			assert.equal(type, 'change');
			state.changePreference = callback;
		}
	};
	function Element() {}
	Element.prototype.animate = function (frames, options) {
		const animation = { frames, options, cancel() { this.cancelled = true; } };
		state.animations.push(animation);
		return animation;
	};
	class IntersectionObserver {
		constructor(callback) { state.intersect = callback; }
		observe(element) { state.observed.push(element); }
		unobserve(element) { state.unobserved.push(element); }
		disconnect() { state.disconnected = true; }
	}
	const elements = [new Element(), new Element()];
	const window = { matchMedia: () => preference };
	if (supported) window.IntersectionObserver = IntersectionObserver;
	runInNewContext(source, {
		window, Element, IntersectionObserver, Set,
		document: { querySelectorAll: (selector) => {
			assert.equal(selector, '[data-reveal]');
			return elements;
		} }
	});
	return state;
}

test('animates intersecting content once without hiding offscreen content', () => {
	const state = setup();
	assert.equal(state.observed.length, 2);
	assert.equal(state.animations.length, 0);
	state.intersect([{ target: state.observed[0], isIntersecting: false }]);
	assert.equal(state.animations.length, 0);
	state.intersect([{ target: state.observed[0], isIntersecting: true }]);
	assert.equal(state.animations.length, 1);
	assert.equal(state.unobserved[0], state.observed[0]);
	assert.equal(state.animations[0].frames[1].opacity, 1);
	assert.equal(state.animations[0].options.duration, 650);
});

test('skips animations for reduced motion or missing browser support', () => {
	for (const options of [{ reduced: true }, { supported: false }]) {
		const state = setup(options);
		assert.equal(state.observed.length, 0);
		assert.equal(state.animations.length, 0);
	}
});

test('cancels active effects when reduced motion is enabled', () => {
	const state = setup();
	state.intersect([{ target: state.observed[0], isIntersecting: true }]);
	state.changePreference({ matches: true });
	assert.equal(state.disconnected, true);
	assert.equal(state.animations[0].cancelled, true);
});
