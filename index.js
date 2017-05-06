(function () {
	if (location.pathname.indexOf('~') === -1) return;
	const tc = 'textContent';
	const sel = 'ul.collaborated-packages li';
	const API = 'https://api.npmjs.org/downloads/point/last-month';
	const getCount = q => q && fetch(`${API}/${q}`).then(res => res.json());
	const getLinks = () => [].slice.call(document.querySelectorAll(`${sel} a:not(.num)`));
	const drawHTML = (el, num) => el.lastElementChild.insertAdjacentHTML('afterend', ` - <em>(${num.toLocaleString()})</em>`);
	function main() {
		const els = getLinks();
		const all = els.map(e => e[tc]);
		const query = all.filter(s => s.indexOf('@') === -1).join(',');
		const scopes = all.filter(s => s.indexOf('@') !== -1).map(q => getCount(q).then(o => ({[q]:o})));
		return Promise.all(scopes.concat(getCount(query))).then(arr => Object.assign.apply(null, arr)).then(obj => {
			els.forEach(el => (el.className += ' num') && drawHTML(el.parentNode, obj[el[tc]].downloads));
		});
	}
	setTimeout(main,1);
	const css = document.createElement('style');
	css.innerHTML = `${sel}>em{font-size:82.5%;line-height:1;opacity:0.75;vertical-align:baseline;}`;
	document.head.appendChild(css);
	const btn = document.querySelector('a.fetch-more-packages');
	if (btn !== void 0) {
		var timer, txt=btn[tc];
		btn.addEventListener('click', () => btn[tc]==='loading...' ? (timer=setInterval(() => (btn[tc]===txt) && (main(),clearInterval(timer)), 100)) : main());
	}
}());
