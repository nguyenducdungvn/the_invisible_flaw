#!/usr/bin/env node
/* Kiểm tra tự động: node tools/check.js
 * 1) Vật lý so với giá trị tính tay  2) Dữ liệu màn chơi  3) Tiêu chí chấp nhận  4) Biên jitter  5) Hình học UT
 */
'use strict';
const path = require('path');
const P = require(path.join(__dirname, '../js/physics.js'));
const { CRITERIA } = require(path.join(__dirname, '../js/criteria.js'));
const { LEVELS, ATLAS } = require(path.join(__dirname, '../js/levels.js'));
const LM = require(path.join(__dirname, '../js/levels_more.js')); const ACADEMY_IDS = require(path.join(__dirname, '../js/academy_data.js')).ACADEMY.map(c => c.id); LEVELS.push(...LM.LEVELS_MORE); Object.assign(ATLAS, LM.ATLAS_MORE);
let fail = 0, pass = 0;
const ok = (c, m) => { if (c) pass++; else { fail++; console.log('  ✗ ' + m); } };
const near = (a, b, tol, m) => ok(Math.abs(a - b) <= tol, `${m}: ${a} ≠ ${b} ± ${tol}`);

console.log('1. Vật lý');
near(P.incidentFor(60, 2730, 3240), 46.86, 0.05, 'Góc nêm cho sóng ngang 60°');
near(P.criticalAngle(2730, 5920), 27.46, 0.05, 'Góc tới hạn I Perspex/thép');
near(P.criticalAngle(2730, 3240), 57.4, 0.1, 'Góc tới hạn II');
ok(P.snell(30, 2730, 5920) === null, 'Vượt góc tới hạn I phải trả null');
near(P.capillaryRiseSlit(0.03, 10, 900, 20e-6) * 1000, 334.6, 0.5, 'Mao dẫn khe 20 µm');
near(P.washburnTimeSlit(10e-3, 1e-3, 0.03, 1e-6, 10) / P.washburnTimeSlit(5e-3, 1e-3, 0.03, 1e-6, 10), 2, 1e-9, 'Washburn tỉ lệ thuận độ nhớt');
ok(P.capillaryRiseSlit(0.03, 100, 900, 1e-5) < 0, 'θ > 90° thì không dâng');
near(P.leakageFactor(0, 30), 0.5, 1e-9, 'Rò từ 30°'); near(P.leakageFactor(90, 0), 1, 1e-9, 'Rò từ vuông góc');
near(P.dB(40, 80), -6.02, 0.01, 'Giảm một nửa = −6 dB');
const ab = P.angleBeam(84, 60, 25); near(ab.depth, 8, 1e-9, 'Chân 2: SP 84 → sâu 8'); ok(ab.leg === 2, 'SP 84 thuộc chân 2');
near(P.angleBeam(28, 60, 25).depth, 14, 1e-9, 'Chân 1: SP 28 → sâu 14');
near(P.skipDistance(25, 60), 86.6, 0.05, 'Bước nhảy T25/60°');
near(P.decay(1000, 73.83), 500, 1e-6, 'Một chu kỳ bán rã');
const A = P.decay(1850, 90); near(A, 794.6, 0.5, 'Hoạt độ RT hôm nay');
near(P.barrierDistance(A, 7.5, 16), 29.35, 0.05, 'Bán kính rào RT (7.5 µSv/h)'); ok(P.attenuate(P.doseRate(A, 15) * 1000 / 16, 25, P.IR192.hvlSteel) <= 10 && P.doseRate(A, 15) * 1000 / 16 > 10 && P.attenuate(P.doseRate(A, 7.6) * 1000 / 16, 25, P.IR192.hvlSteel) > 10, 'RT: chỉ phương án cáp 15 m + vách 25 mm đạt ≤ 10 µSv/h');
near(P.exposureMinutes(220, 0.5, A), 4.15, 0.02, 'Thời gian chiếu RT');
near(P.filmDensity(1), 2.6, 1e-9, 'Độ đen tại phơi sáng đúng');
ok(P.filmDensity(0.5) >= 1.4 && P.filmDensity(0.5) < 2.0, 'Phơi sáng thiếu một nửa → phim mỏng dưới 2.0');
near(P.skinDepth(100e3, 3.5e7, 1) * 1000, 0.269, 0.003, 'Độ sâu thấm chuẩn nhôm ~100 kHz');

console.log('2. Dữ liệu màn chơi');
Object.assign(CRITERIA, LM.CRITERIA_MORE);
const LABS = ['capillary', 'magnet', 'snell', 'radiation', 'visual', 'eddy', 'aeloc', 'thermal', 'microwave'];
for (const l of LEVELS) {
  ok(l.methods.filter(m => m.ok).length === 1, `${l.id}: phải có đúng 1 phương pháp đúng`);
  ok(l.methods.filter(m => !m.ok).every(m => m.why), `${l.id}: phương án sai phải có giải thích`);
  ok(l.methods.some(m => !m.ok && m.lure), `${l.id}: cần ít nhất một phương án sai “hấp dẫn”`);
  const okM = l.methods.find(m => m.ok); ok(l.methods.some(m => !m.ok && (m.cost <= okM.cost || m.time <= okM.time)), `${l.id}: phải có phương án sai rẻ hơn hoặc nhanh hơn phương án đúng`);
  ok(LABS.includes(l.lab), `${l.id}: phòng thí nghiệm ${l.lab} không tồn tại`);
  ok(!!CRITERIA[l.criteria], `${l.id}: tiêu chí ${l.criteria}`);
  ok(['correctReject', 'wrongAccept', 'wrongReject', 'correctAccept'].every(k => l.after[k]), `${l.id}: thiếu văn bản “6 tháng sau”`);
  for (const i of (l.indications || []).concat(l.reflectors || [])) ok(!!ATLAS[i.atlas], `${l.id}/${i.id}: atlas ${i.atlas}`);
  for (const s of [l.briefing, l.title, l.part]) ok(s === s.normalize('NFC'), `${l.id}: chuỗi phải ở dạng NFC`);
}
ok(new Set(LEVELS.map(l => l.order)).size === LEVELS.length, 'Thứ tự màn không trùng');

console.log('3. Tiêu chí chấp nhận');
const S8 = CRITERIA['ASME8-App8'].evaluate;
ok(S8([{ label: 'a', type: 'linear', len: 1.4, x: 0 }]).accept, 'Đường 1.4 mm không liên quan → đạt');
ok(!S8([{ label: 'a', type: 'linear', len: 2, x: 0 }]).accept, 'Đường 2 mm → loại');
ok(S8([{ label: 'a', type: 'rounded', len: 4.5, x: 0 }]).accept, 'Tròn 4.5 mm → đạt');
ok(!S8([{ label: 'a', type: 'rounded', len: 5.5, x: 0 }]).accept, 'Tròn 5.5 mm → loại');
ok(!S8([0, 1, 2, 3].map(k => ({ label: 'r' + k, type: 'rounded', len: 2, x: k * 3 }))).accept, '4 tròn thẳng hàng cách 1 mm → loại');
ok(S8([0, 1, 2, 3].map(k => ({ label: 'r' + k, type: 'rounded', len: 2, x: k * 6 }))).accept, '4 tròn cách 4 mm → đạt');
const U12 = CRITERIA['ASME8-App12'].evaluate;
ok(U12([{ label: 's', type: 'slag', len: 6, overDAC: true }], 25).accept, 'Xỉ 6 mm trên DAC, t = 25 → đạt (giới hạn 8.3)');
ok(!U12([{ label: 's', type: 'slag', len: 9, overDAC: true }], 25).accept, 'Xỉ 9 mm trên DAC, t = 25 → loại');
ok(U12([{ label: 's', type: 'slag', len: 30, overDAC: false }], 25).accept, 'Dưới DAC → đạt bất kể dài');
ok(!U12([{ label: 'l', type: 'lof', len: 2, overDAC: false }], 25).accept, 'Không ngấu → loại bất kể');
near(U12([], 12).limit, 6, 1e-9, 't ≤ 19 → 6 mm'); near(U12([], 70).limit, 19, 1e-9, 't > 57 → 19 mm');
const W51 = CRITERIA['ASME8-UW51'].evaluate;
ok(W51([{ label: 's', type: 'slag', len: 4.5 }, { label: 'p', type: 'pore', len: 1.6 }], 12).accept, 'RT: xỉ 4.5 + rỗ 1.6 ở t = 12 → đạt');
ok(!W51([{ label: 'c', type: 'crack', len: 1 }], 12).accept, 'RT: nứt → loại');

console.log('4. Đáp án mỗi màn & biên jitter');
const truthPT = { crack: 'linear', pore: 'rounded' };
for (const l of LEVELS) {
  const L = l.weldLen || l.length || (l.method === 'RT' ? 180 : 160);
  for (const i of (l.indications || []).filter(i => i.len != null && i.x != null)) { ok(i.x - (i.jitter || 0) - i.len / 2 >= 0 && i.x + (i.jitter || 0) + i.len / 2 <= L, `${l.id}/${i.id}: jitter vượt khỏi chiều dài ${L}`); }
  for (const r of l.reflectors || []) ok(r.x1 - r.jitter >= 0 && r.x2 + r.jitter <= l.weldLen, `${l.id}/${r.id}: jitter vượt`);
}
const exp = { pt1: false, mt1: false, ut1: false, rt1: false, vt1: false, et1: false, ae1: false, ir1: false, mw1: false };
const grp = arr => { const gs = {}; for (const i of arr) if (i.group) gs[i.group] = gs[i.group] || []; return arr; };
const ev = {
  pt1: l => S8(l.indications.filter(i => i.kind !== 'bleed' && i.len > 1.5).map(i => ({ label: i.id, type: truthPT[i.kind], len: i.len, x: i.x }))),
  mt1: l => CRITERIA['ASME8-App6'].evaluate(l.indications.filter(i => i.kind === 'crack').map(i => ({ label: i.id, type: 'linear', len: i.len, x: i.x }))),
  ut1: l => U12(l.reflectors.map(r => ({ label: r.id, type: r.type, len: r.x2 - r.x1, overDAC: r.rel > 0 })), l.T),
  rt1: l => W51(l.indications.filter(i => i.kind !== 'artifact').map(i => ({ label: i.id, type: i.kind, len: i.len })), l.t),
  vt1: l => { const full = LEVELS.find(x => x.id === 'vt1').indications; let a = l.indications; const gs = new Set(full.filter(i => i.group).map(i => i.group)); for (const g of gs) if (!full.filter(i => i.group === g).every(f => a.some(i => i.id === f.id))) a = a.filter(i => i.group !== g);
    return CRITERIA['AWS-D11-VT'].evaluate(a.filter(i => i.kind !== 'spatter').map(i => ({ label: i.id, type: i.kind, len: i.len, depth: i.depth, x: i.x }))); },
  et1: l => CRITERIA['ET-AL-SURF'].evaluate(l.indications.filter(i => i.kind === 'crack').map(i => ({ label: i.id, type: 'crack', depth: i.depth }))),
  ae1: l => CRITERIA['AE-VESSEL'].evaluate(l.indications.map(i => ({ label: i.id, type: i.kind }))),
  ir1: l => CRITERIA['IR-CFRP'].evaluate(l.indications.filter(i => i.kind === 'delam').map(i => ({ label: i.id, type: 'delam', len: i.len }))),
  mw1: l => CRITERIA['MW-HDPE'].evaluate(l.indications.filter(i => i.kind !== 'metal').map(i => ({ label: i.id, type: i.kind, len: i.len })))
};
for (const l of LEVELS) { const r = ev[l.id](l); ok(r.accept === exp[l.id], `${l.id}: đáp án ${r.accept}`); console.log(`  ${l.id}: ${r.accept ? 'ĐẠT' : 'LOẠI'} – ${r.why.join(' | ')}`); }
for (const l of LEVELS) { const c = JSON.parse(JSON.stringify(l)); if (c.indications) c.indications = c.indications.filter(i => !i.optional); if (c.reflectors) c.reflectors = c.reflectors.filter(i => !i.optional); ok(ev[l.id](c).accept, `${l.id}: khi vắng mọi khuyết tật optional, đáp án phải là ĐẠT`); ok((l.indications || l.reflectors).some(i => i.optional), `${l.id}: cần ít nhất một khuyết tật optional`); }
// Bài học “trên DAC chưa chắc loại”: xỉ trong ut1 phải tự nó đạt
const ut = LEVELS.find(l => l.id === 'ut1'); ok(U12(ut.reflectors.filter(r => r.type === 'slag').map(r => ({ label: 'B', type: 'slag', len: r.x2 - r.x1, overDAC: true })), 25).accept, 'ut1: xỉ một mình phải đạt (dạy “trên DAC ≠ loại”)');

{ const V = CRITERIA['AWS-D11-VT'].evaluate, u = (len, depth, x = 0) => ({ label: 'u', type: 'undercut', len, depth, x });
  ok(V([u(40, 1.4)]).accept, 'VT: cháy cạnh 1.4 mm dài 40 mm → đạt (ngoại lệ ≤ 50 mm/300 mm)');
  ok(!V([u(40, 1.4), u(25, 1.2, 150)]).accept, 'VT: tổng 65 mm sâu > 1 mm → loại'); ok(!V([u(5, 2.2)]).accept, 'VT: cháy cạnh 2.2 mm → loại'); ok(V([u(200, 0.9)]).accept, 'VT: cháy cạnh 0.9 mm bất kể dài → đạt');
  const pr = (x, d) => ({ label: 'p', type: 'pore', len: d, x }); ok(!V([pr(0, 3), pr(7, 3.5), pr(15, 4)]).accept, 'VT: rỗ 10.5 mm trong 25 mm → loại'); ok(V([pr(0, 3), pr(30, 3.5), pr(60, 4)]).accept, 'VT: rỗ rải rác 10.5 mm/300 mm → đạt');
  ok(!V([pr(0, 4), pr(40, 4), pr(80, 4), pr(120, 4), pr(160, 4)]).accept, 'VT: tổng rỗ 20 mm > 19 mm trong 300 mm → loại'); ok(!V([{ label: 'c', type: 'crack', len: 1, x: 0 }]).accept, 'VT: nứt → loại');
  ok(CRITERIA['IR-CFRP'].evaluate([{ label: 'd', type: 'delam', len: 10 }]).accept, 'IR: tách lớp 10 mm → ghi nhận'); ok(CRITERIA['MW-HDPE'].evaluate([{ label: 'v', type: 'void', len: 2.5 }]).accept, 'MW: lỗ rỗng 2.5 mm → ghi nhận');
  const tau = z => P.thermalTime(z * 1e-3, 4e-7); near(tau(2.5), 15.625, 1e-6, 'IR: tách lớp 2.5 mm hiện ở ≈ 15.6 s (cần ghi ≥ 20 s)');
  near(P.aeLocate(4, 3050, -0.656e-3), 1.0, 0.01, 'AE: bẻ ruột chì ở 1.0 m cho Δt = −0.656 ms với v = 3050 m/s');
  near(P.skinDepth(2e5, 0.3 * P.IACS, 1) * 1000, 0.27, 0.01, 'ET: δ nhôm 30 % IACS ở 200 kHz ≈ 0.27 mm');
  near(300 / 24 / Math.sqrt(2.3), 8.24, 0.01, 'MW: λ trong HDPE ở 24 GHz ≈ 8.2 mm');
  for (const k of Object.keys(LM.PREREQ_MORE)) ok(LM.PREREQ_MORE[k].every(c => ACADEMY_IDS.includes(c)), `PREREQ ${k}`); }
{ const L3 = require(path.join(__dirname, '../js/level3.js'));
  ok(L3.CASES.length === 5, 'Bậc III: 5 tài liệu soát xét');
  for (const c of L3.CASES) { ok(c.lines.length >= 7, `${c.id}: ≥ 7 dòng`);
    for (const [i, l] of c.lines.entries()) { ok(l.ok && l.bad && l.ok !== l.bad, `${c.id}#${i + 1}: có bản đúng và bản sai khác nhau`); ok(l.fix.length === 3 && new Set(l.fix).size === 3, `${c.id}#${i + 1}: 3 cách sửa khác nhau`); ok(l.why && l.ref, `${c.id}#${i + 1}: có giải thích và căn cứ`); } }
  let r = () => 0.37; const b = L3.pickBad(9, Math.random); ok(b.size >= 3 && b.size <= 5, 'Bậc III: 3–5 dòng lỗi mỗi lượt');
  const c = L3.CASES[0], bad = new Set([0, 3, 4]);
  near(L3.score(c, bad, { 0: { fix: 0 }, 3: { fix: 0 }, 4: { fix: 0 } }).pct, 1, 1e-9, 'Bậc III: tìm và sửa đúng cả 3 → 100 %');
  near(L3.score(c, bad, { 0: { fix: 0 }, 3: { fix: 0 }, 4: { fix: 2 } }).pct, 5 / 6, 1e-9, 'Bậc III: một dòng sửa sai → 83 %');
  near(L3.score(c, bad, { 0: { fix: 0 }, 3: { fix: 0 }, 4: { fix: 0 }, 1: { fix: 0 } }).pct, 5 / 6, 1e-9, 'Bậc III: đánh dấu nhầm một dòng đúng bị trừ');
  near(L3.score(c, bad, Object.fromEntries(c.lines.map((_, i) => [i, { fix: 0 }]))).pct, 0, 1e-9, 'Bậc III: đánh dấu tất cả không có lợi');
  near(20 / 3, 6.67, 0.01, 'Bậc III UT: t/3 với t = 20 mm'); near(3 * 25 / 100, 0.75, 1e-9, 'Bậc III RT: Ug = 3·25/100'); near(3 * 25 / 300, 0.25, 1e-9, 'Bậc III RT: Ug = 3·25/300'); }
{ const bad = []; const FS = require('fs'); for (const f of FS.readdirSync(path.join(__dirname, '../js')).filter(f => f.endsWith('.js'))) FS.readFileSync(path.join(__dirname, '../js', f), 'utf8').split('\n').forEach((ln, k) => { if (/\d,\d/.test(ln) && !/rgba|NUM_RULE|1,000|'255,255,255'/.test(ln)) bad.push(`${f}:${k + 1}`); });
  ok(bad.length === 0, 'Số thập phân dùng dấu chấm (không còn dấu phẩy thập phân)' + (bad.length ? ': ' + bad.slice(0, 5).join(', ') : '')); }
console.log('5. Hình học UT');
const T = 25, tan = Math.tan(60 * P.D2R), fusion = d => 1 + (T - d) * Math.tan(30 * P.D2R);
const lof = ut.reflectors.find(r => r.type === 'lof'); const ypLeg2 = fusion(lof.depth) + (2 * T - lof.depth) * tan;
ok(ypLeg2 < 105 && ypLeg2 > 21.5, `Đầu dò với tới không ngấu ở chân 2 (y = ${ypLeg2.toFixed(1)})`);
const slag = ut.reflectors.find(r => r.type === 'slag'); ok(slag.depth * tan > 21.5, 'Đầu dò với tới xỉ ở chân 1');
for (const [d, x] of [[T / 4, 90], [T / 2, 130], [3 * T / 4, 170]]) for (const de of [d, 2 * T - d]) { const u = x - de * tan; ok(u >= 0 && u <= 160, `Mẫu chuẩn: lỗ sâu ${d} với tới (u = ${u.toFixed(1)})`); }

console.log('6. Học viện NDE');
const AD = require(path.join(__dirname, '../js/academy_data.js')), { ACADEMY, PREREQ } = AD;
const { DEEP, GLOSSARY } = require(path.join(__dirname, '../js/academy_deep.js'));
const MORE = require(path.join(__dirname, '../js/academy_more.js')); MORE.install({ ACADEMY, TRACKS: AD.TRACKS, PREREQ, GLOSSARY });
const fs = require('fs');
const coreSrc = fs.readFileSync(path.join(__dirname, '../js/core.js'), 'utf8'), simSrc = fs.readFileSync(path.join(__dirname, '../js/academy_sims.js'), 'utf8'), labSrc = fs.readFileSync(path.join(__dirname, '../js/labs.js'), 'utf8');
const cardIds = [...coreSrc.matchAll(/^\s{4}(\w+): \{ t: '/gm)].map(m => m[1]);
ok(ACADEMY.filter(c => c.track === 'phys').length === 8, '8 chương vật lý (theo NDE-Ed Physics)');
ok(ACADEMY.filter(c => c.track === 'tech').length === 10, '10 chương phương pháp (8 của NDE-Ed + VT + UT nâng cao)');
ok(ACADEMY.filter(c => c.track === 'safe').length === 1 && ACADEMY.findIndex(c => c.id === 'ut2') === ACADEMY.findIndex(c => c.id === 'ut') + 1, 'Chương An toàn bức xạ; UT nâng cao ngay sau UT');
ok(PREREQ.ut1.includes('ut2') && PREREQ.rt1.includes('rs'), 'PREREQ cập nhật');
for (const c of [MORE.UT2, MORE.RS]) ok(c.deep.length >= 4 && c.ex.length >= 2 && c.quiz.length >= 10, `${c.id}: đủ đào sâu, ví dụ, câu hỏi`);
{ const q = (c, i) => c.quiz[i]; const U = MORE.UT2, R = MORE.RS, rad = (A, k, lim) => Math.sqrt(P.IR192.gamma * 1000 * A / (k * lim));
  near(q(U, 2).num, -P.dB(20, 100), 0.2, 'ut2#2 20 % DAC'); near(q(U, 5).num, 2 * 20 * Math.tan(Math.PI / 3), 0.5, 'ut2#5 bước nhảy'); near(q(R, 5).num, rad(740, 10, 7.5), 0.5, 'rs#5 bán kính'); near(q(R, 6).num, Math.pow(0.5, 10 / P.IR192.hvlSteel) * 100, 1, 'rs#6 vách 10 mm');
  near(P.attenuate(P.doseRate(740, 1) * 1000, 0, 12.7), 96.2 * 1000, 1000, '20 Ci ≈ 96 mSv/h ở 1 m'); }
ok(new Set(ACADEMY.map(c => c.id)).size === ACADEMY.length, 'Mã chương không trùng');
for (const c of ACADEMY) {
  ok(c.lessons.length >= 4, `${c.id}: ≥ 4 bài`); ok(c.quiz.length >= 4, `${c.id}: ≥ 4 câu hỏi`);
  const sim = c.sim.startsWith('lab:') ? new RegExp(`\\b${c.sim.slice(4)}\\(el, done`).test(labSrc) : new RegExp(`\\b${c.sim}\\(el\\)`).test(simSrc); ok(sim, `${c.id}: mô phỏng ${c.sim} không tồn tại`);
  for (const k of c.cards || []) ok(cardIds.includes(k), `${c.id}: thẻ ${k} không có trong CARDS`);
  c.quiz.forEach((q, i) => { ok(q.e && q.q, `${c.id}#${i}: thiếu giải thích`); if (q.o) ok(q.o.length >= 4 && new Set(q.o).size === q.o.length, `${c.id}#${i}: cần ≥ 4 đáp án khác nhau`); });
  for (const s of c.lessons.flat().concat(c.quiz.map(q => q.q))) ok(s === s.normalize('NFC'), `${c.id}: chuỗi chưa NFC`);
}
for (const [lv, ids] of Object.entries(PREREQ)) for (const id of ids) ok(ACADEMY.some(c => c.id === id), `PREREQ ${lv}: ${id}`);
// Tính lại mọi đáp số bằng physics.js
const Q = (id, i) => ACADEMY.find(c => c.id === id).quiz[i];
const chk = (id, i, val) => { const q = Q(id, i); const tol = q.abs != null ? Math.max(q.abs, 1e-9) : Math.abs(val) * (q.rel || 0.05); near(q.num, val, tol, `Đáp số ${id}#${i}`); };
chk('atom', 1, 192 - 77); chk('elec', 0, P.ohmI(12, 4)); chk('elec', 1, P.impedanceZ(3, 4)); chk('elec', 3, P.currentDensityAt(1, 1) * 100);
chk('waves', 0, P.wavelength(5920, 5e6) * 1000); chk('sound', 0, 7850 * 5920 / 1e6); chk('sound', 1, P.reflectionCoef(1.48, 46.5) * 100);
chk('xray', 1, P.hvlFromMu(0.0693)); chk('xray', 2, 37); chk('xray', 3, P.geomUnsharpness(3, 12, 600)); chk('mat', 0, P.hooke(200000, 0.001));
chk('ut', 0, P.nearField(10, 5, 5920)); chk('et', 0, P.phaseLagDeg(1, 1)); chk('mw', 0, 3e8 / 10e9 * 1000); chk('rt', 0, Math.pow(10, -2) * 100); chk('rt', 3, P.inverseSquare(1, 1, 0.5));
chk('ae', 0, P.aeLocate(2, 3000, -0.4e-3)); chk('ir', 0, P.thermalDepth(10, 4e-7) * 1000); chk('ir', 2, P.thermalTime(2, 1) / P.thermalTime(1, 1));
near(P.filmDensityFromT(0.01), 2, 1e-9, 'D = 2 ↔ 1 % truyền qua');
// Phần Đào sâu
ok(ACADEMY.filter(c => !c.deep).every(c => DEEP[c.id] && DEEP[c.id].deep.length >= 3 && DEEP[c.id].ex.length >= 1 && DEEP[c.id].quiz.length >= 3), 'Mỗi chương có ≥ 3 mục đào sâu, ≥ 1 ví dụ, ≥ 3 câu nâng cao');
ok(GLOSSARY.length >= 40 && new Set(GLOSSARY.map(g => g[0])).size === GLOSSARY.length, 'Thuật ngữ ≥ 40, không trùng');
for (const [id, d] of Object.entries(DEEP)) d.quiz.forEach((q, i) => { ok(q.e, `${id} nâng cao #${i}: thiếu giải thích`); if (q.o) ok(q.o.length >= 4 && new Set(q.o).size === q.o.length, `${id} nâng cao #${i}: đáp án`); });
const D = (id, i, val) => { const q = DEEP[id].quiz[i]; const tol = q.abs != null ? Math.max(q.abs, 1e-9) : Math.abs(val) * (q.rel || 0.05); near(q.num, val, tol, `Đáp số nâng cao ${id}#${i}`); };
const fFor = (delta, iacs) => 1 / (Math.PI * 4e-7 * Math.PI * iacs / 100 * P.IACS * delta * delta);
D('atom', 1, 1850 / 37); D('elec', 0, 0.58 * 50); D('elec', 1, fFor(1e-3, 40) / 1000); near(P.skinDepth(fFor(1e-3, 40), 0.4 * P.IACS, 1), 1e-3, 1e-9, 'f tìm được cho δ = 1 mm');
D('mag', 0, 1000 / (2 * Math.PI * 0.025)); D('waves', 0, P.wavelength(0.92 * 3240, 2e6) * 1000); D('sound', 0, P.dB(80, 40) / 100);
near(DEEP.xray.ex[0].a.includes('36') ? 1 : 0, 1, 0, 'Ví dụ xray 7.5 µSv/h'); D('xray', 0, Math.log2(50) * P.IR192.hvlLead); D('xray', 1, 10 * 2 / 5); D('mat', 0, (50 / (1.12 * 200)) ** 2 / Math.PI * 1000);
D('vt', 0, P.inverseSquare(400, 1, 0.5)); D('ut', 0, P.beamSpreadHalfDeg(5920, 5e6, 0.01)); D('et', 0, fFor(1.2e-3, 25) / 1000); D('mw', 0, 300 / 10 / Math.sqrt(4)); D('rt', 0, P.geomUnsharpness(2, 15, 500)); D('ae', 0, 8 / 10); D('ir', 0, ((330 / 300) ** 4 - 1) * 100);
const numDeep = Object.values(DEEP).reduce((n, d) => n + d.quiz.filter(q => q.num != null).length, 0); ok(numDeep === 16, `Đã tính lại mọi câu số nâng cao (${numDeep})`); near(P.mwGamma(1), 0, 1e-12, 'ε = 1 không phản xạ');

console.log(`\n${pass} đạt, ${fail} lỗi`); process.exit(fail ? 1 : 0);
