#!/usr/bin/env node
/* Kiểm tra tự động: node tools/check.js
 * 1) Vật lý so với giá trị tính tay  2) Dữ liệu màn chơi  3) Tiêu chí chấp nhận  4) Biên jitter  5) Hình học UT
 */
'use strict';
const path = require('path');
const P = require(path.join(__dirname, '../js/physics.js'));
const { CRITERIA } = require(path.join(__dirname, '../js/criteria.js'));
const { LEVELS, ATLAS } = require(path.join(__dirname, '../js/levels.js'));
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
near(P.barrierDistance(A, 20, 16), 17.97, 0.05, 'Bán kính rào RT');
near(P.exposureMinutes(220, 0.5, A), 4.15, 0.02, 'Thời gian chiếu RT');
near(P.filmDensity(1), 2.6, 1e-9, 'Độ đen tại phơi sáng đúng');
ok(P.filmDensity(0.5) >= 1.4 && P.filmDensity(0.5) < 2.0, 'Phơi sáng thiếu một nửa → phim mỏng dưới 2,0');
near(P.skinDepth(100e3, 3.5e7, 1) * 1000, 0.269, 0.003, 'Độ sâu thấm chuẩn nhôm ~100 kHz');

console.log('2. Dữ liệu màn chơi');
const LABS = ['capillary', 'magnet', 'snell', 'radiation'];
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
ok(S8([{ label: 'a', type: 'linear', len: 1.4, x: 0 }]).accept, 'Đường 1,4 mm không liên quan → đạt');
ok(!S8([{ label: 'a', type: 'linear', len: 2, x: 0 }]).accept, 'Đường 2 mm → loại');
ok(S8([{ label: 'a', type: 'rounded', len: 4.5, x: 0 }]).accept, 'Tròn 4,5 mm → đạt');
ok(!S8([{ label: 'a', type: 'rounded', len: 5.5, x: 0 }]).accept, 'Tròn 5,5 mm → loại');
ok(!S8([0, 1, 2, 3].map(k => ({ label: 'r' + k, type: 'rounded', len: 2, x: k * 3 }))).accept, '4 tròn thẳng hàng cách 1 mm → loại');
ok(S8([0, 1, 2, 3].map(k => ({ label: 'r' + k, type: 'rounded', len: 2, x: k * 6 }))).accept, '4 tròn cách 4 mm → đạt');
const U12 = CRITERIA['ASME8-App12'].evaluate;
ok(U12([{ label: 's', type: 'slag', len: 6, overDAC: true }], 25).accept, 'Xỉ 6 mm trên DAC, t = 25 → đạt (giới hạn 8,3)');
ok(!U12([{ label: 's', type: 'slag', len: 9, overDAC: true }], 25).accept, 'Xỉ 9 mm trên DAC, t = 25 → loại');
ok(U12([{ label: 's', type: 'slag', len: 30, overDAC: false }], 25).accept, 'Dưới DAC → đạt bất kể dài');
ok(!U12([{ label: 'l', type: 'lof', len: 2, overDAC: false }], 25).accept, 'Không ngấu → loại bất kể');
near(U12([], 12).limit, 6, 1e-9, 't ≤ 19 → 6 mm'); near(U12([], 70).limit, 19, 1e-9, 't > 57 → 19 mm');
const W51 = CRITERIA['ASME8-UW51'].evaluate;
ok(W51([{ label: 's', type: 'slag', len: 4.5 }, { label: 'p', type: 'pore', len: 1.6 }], 12).accept, 'RT: xỉ 4,5 + rỗ 1,6 ở t = 12 → đạt');
ok(!W51([{ label: 'c', type: 'crack', len: 1 }], 12).accept, 'RT: nứt → loại');

console.log('4. Đáp án mỗi màn & biên jitter');
const truthPT = { crack: 'linear', pore: 'rounded' };
for (const l of LEVELS) {
  const L = l.weldLen || (l.method === 'RT' ? 180 : 160);
  for (const i of l.indications || []) { ok(i.x - (i.jitter || 0) - i.len / 2 >= 0 && i.x + (i.jitter || 0) + i.len / 2 <= L, `${l.id}/${i.id}: jitter vượt khỏi chiều dài ${L}`); }
  for (const r of l.reflectors || []) ok(r.x1 - r.jitter >= 0 && r.x2 + r.jitter <= l.weldLen, `${l.id}/${r.id}: jitter vượt`);
}
const exp = { pt1: false, mt1: false, ut1: false, rt1: false };
const ev = {
  pt1: l => S8(l.indications.filter(i => i.kind !== 'bleed' && i.len > 1.5).map(i => ({ label: i.id, type: truthPT[i.kind], len: i.len, x: i.x }))),
  mt1: l => CRITERIA['ASME8-App6'].evaluate(l.indications.filter(i => i.kind === 'crack').map(i => ({ label: i.id, type: 'linear', len: i.len, x: i.x }))),
  ut1: l => U12(l.reflectors.map(r => ({ label: r.id, type: r.type, len: r.x2 - r.x1, overDAC: r.rel > 0 })), l.T),
  rt1: l => W51(l.indications.filter(i => i.kind !== 'artifact').map(i => ({ label: i.id, type: i.kind, len: i.len })), l.t)
};
for (const l of LEVELS) { const r = ev[l.id](l); ok(r.accept === exp[l.id], `${l.id}: đáp án ${r.accept}`); console.log(`  ${l.id}: ${r.accept ? 'ĐẠT' : 'LOẠI'} – ${r.why.join(' | ')}`); }
for (const l of LEVELS) { const c = JSON.parse(JSON.stringify(l)); if (c.indications) c.indications = c.indications.filter(i => !i.optional); if (c.reflectors) c.reflectors = c.reflectors.filter(i => !i.optional); ok(ev[l.id](c).accept, `${l.id}: khi vắng mọi khuyết tật optional, đáp án phải là ĐẠT`); ok((l.indications || l.reflectors).some(i => i.optional), `${l.id}: cần ít nhất một khuyết tật optional`); }
// Bài học “trên DAC chưa chắc loại”: xỉ trong ut1 phải tự nó đạt
const ut = LEVELS.find(l => l.id === 'ut1'); ok(U12(ut.reflectors.filter(r => r.type === 'slag').map(r => ({ label: 'B', type: 'slag', len: r.x2 - r.x1, overDAC: true })), 25).accept, 'ut1: xỉ một mình phải đạt (dạy “trên DAC ≠ loại”)');

console.log('5. Hình học UT');
const T = 25, tan = Math.tan(60 * P.D2R), fusion = d => 1 + (T - d) * Math.tan(30 * P.D2R);
const lof = ut.reflectors.find(r => r.type === 'lof'); const ypLeg2 = fusion(lof.depth) + (2 * T - lof.depth) * tan;
ok(ypLeg2 < 105 && ypLeg2 > 21.5, `Đầu dò với tới không ngấu ở chân 2 (y = ${ypLeg2.toFixed(1)})`);
const slag = ut.reflectors.find(r => r.type === 'slag'); ok(slag.depth * tan > 21.5, 'Đầu dò với tới xỉ ở chân 1');
for (const [d, x] of [[T / 4, 90], [T / 2, 130], [3 * T / 4, 170]]) for (const de of [d, 2 * T - d]) { const u = x - de * tan; ok(u >= 0 && u <= 160, `Mẫu chuẩn: lỗ sâu ${d} với tới (u = ${u.toFixed(1)})`); }

console.log(`\n${pass} đạt, ${fail} lỗi`); process.exit(fail ? 1 : 0);
