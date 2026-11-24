/* THE INVISIBLE FLAW · physics.js
 * Nguồn sự thật duy nhất cho mọi công thức: mô phỏng, đáp án, máy tính sổ tay và tools/check.js đều gọi vào đây.
 * Đơn vị: SI trừ khi ghi rõ (mm cho hình học mối hàn, m/s cho vận tốc, µs cho thời gian siêu âm).
 */
(function (root) {
  'use strict';
  const D2R = Math.PI / 180, R2D = 180 / Math.PI, g = 9.81;

  const MAT = {
    // Vận tốc âm tham khảo (m/s). Nguồn: bảng vận tốc trong giáo trình UT phổ thông (NDE-Ed.org, Material Properties Tables).
    perspex: { vL: 2730, vS: 1430, name: 'Perspex (nêm đầu dò)' },
    steel:   { vL: 5920, vS: 3240, name: 'Thép cacbon' },
    water:   { vL: 1480, vS: 0,    name: 'Nước' },
    alu:     { vL: 6320, vS: 3130, name: 'Nhôm' }
  };

  /* ---------- PT: mao dẫn ---------- */
  // Chiều cao dâng mao dẫn trong khe hẹp hai mặt phẳng song song (khe rộng w): h = 2γcosθ / (ρ g w)
  function capillaryRiseSlit(gamma, thetaDeg, rho, w) { return 2 * gamma * Math.cos(thetaDeg * D2R) / (rho * g * w); }
  // Thời gian thấm đến độ sâu L (Washburn cho khe): t = 3ηL² / (γ w cosθ). Độ nhớt chỉ đổi TỐC ĐỘ, không đổi chiều cao cân bằng.
  function washburnTimeSlit(eta, L, gamma, w, thetaDeg) {
    const c = Math.cos(thetaDeg * D2R); if (c <= 0) return Infinity; return 3 * eta * L * L / (gamma * w * c);
  }
  const wets = thetaDeg => thetaDeg < 90;

  /* ---------- MT: rò từ thông ---------- */
  // Tỉ lệ từ thông rò theo góc giữa đường sức và vết nứt (mô hình bậc nhất): |sin Δ|. Phát hiện tốt khi Δ ≥ 45°.
  function leakageFactor(fieldDeg, crackDeg) { return Math.abs(Math.sin((fieldDeg - crackDeg) * D2R)); }
  const MT_DETECT = Math.sin(45 * D2R); // 0,707

  /* ---------- ET: độ sâu thấm chuẩn ---------- */
  // δ = 1 / sqrt(π f μ σ), μ = μr·μ0
  function skinDepth(f, sigma, mur) { return 1 / Math.sqrt(Math.PI * f * mur * 4e-7 * Math.PI * sigma); }

  /* ---------- UT ---------- */
  // Định luật Snell: sinθ1 / v1 = sinθ2 / v2. Trả về null khi vượt góc tới hạn.
  function snell(theta1Deg, v1, v2) {
    const s = Math.sin(theta1Deg * D2R) * v2 / v1; return Math.abs(s) > 1 ? null : Math.asin(s) * R2D;
  }
  function criticalAngle(v1, v2) { return v2 <= v1 ? null : Math.asin(v1 / v2) * R2D; }
  function incidentFor(theta2Deg, v1, v2) { return Math.asin(Math.sin(theta2Deg * D2R) * v1 / v2) * R2D; }
  // Hình học đầu dò góc trên tấm dày T. sp = đường truyền âm (mm)
  function angleBeam(sp, thetaDeg, T) {
    const c = Math.cos(thetaDeg * D2R), s = Math.sin(thetaDeg * D2R);
    const vd = sp * c;                       // độ sâu "duỗi thẳng"
    const leg = Math.floor(vd / T) + 1;      // chân sóng thứ mấy
    const r = vd % (2 * T);
    const depth = r <= T ? r : 2 * T - r;    // gấp theo mặt đáy/mặt trên
    return { depth, surf: sp * s, leg };
  }
  const skipDistance = (T, thetaDeg) => 2 * T * Math.tan(thetaDeg * D2R);
  const spToDepth = (depth, thetaDeg, leg = 1, T = 0) =>
    (leg === 1 ? depth : 2 * T - depth) / Math.cos(thetaDeg * D2R);
  const dB = (a2, a1) => 20 * Math.log10(a2 / a1);
  const ampFromDb = (a1, db) => a1 * Math.pow(10, db / 20);
  const nearField = (Dmm, fMHz, v) => (Dmm / 1000) ** 2 * fMHz * 1e6 / (4 * v) * 1000; // mm
  const acousticImpedance = (rho, v) => rho * v;
  const reflectionCoef = (Z1, Z2) => ((Z2 - Z1) / (Z2 + Z1)) ** 2;

  /* ---------- RT ---------- */
  const IR192 = {
    halfLifeDays: 73.83,           // chu kỳ bán rã Ir-192
    gamma: 0.13,                   // mSv·m²/(h·GBq) — hằng số suất liều tham khảo [CẦN KIỂM CHỨNG theo chứng chỉ nguồn]
    hvlLead: 4.8, hvlSteel: 12.7   // mm [CẦN KIỂM CHỨNG]
  };
  const decay = (A0, days, half = IR192.halfLifeDays) => A0 * Math.pow(0.5, days / half);
  const doseRate = (A_GBq, d_m, gammaK = IR192.gamma) => gammaK * A_GBq / (d_m * d_m); // mSv/h
  const attenuate = (I0, x, hvl) => I0 * Math.pow(0.5, x / hvl);
  const inverseSquare = (I1, d1, d2) => I1 * (d1 / d2) ** 2;
  // Khoảng cách tối thiểu để suất liều ≤ giới hạn (µSv/h), có hệ số giảm của ống chuẩn trực
  function barrierDistance(A_GBq, limit_uSvh, shieldFactor = 1, gammaK = IR192.gamma) {
    return Math.sqrt(gammaK * 1000 * A_GBq / (shieldFactor * limit_uSvh));
  }
  // Thời gian chiếu (phút) từ lượng phơi sáng yêu cầu E (GBq·h quy về SFD 1 m), theo luật nghịch đảo bình phương
  const exposureMinutes = (E_GBqh_1m, sfd_m, A_GBq) => E_GBqh_1m * sfd_m * sfd_m / A_GBq * 60;
  // Độ đen phim theo tỉ lệ phơi sáng thực/yêu cầu: D = D0 + G·log10(ratio)   (G: gradient trung bình của phim)
  const filmDensity = (ratio, D0 = 2.6, G = 3.5) => Math.max(0.2, D0 + G * Math.log10(Math.max(ratio, 1e-3)));
  const geomUnsharpness = (F, d, D) => F * d / D;

  /* ---------- Học viện: bổ sung ---------- */
  const IACS = 5.8e7;                                   // 100 % IACS = 5,8·10⁷ S/m
  const ohmI = (V, R) => V / R;
  const resistance = (rho, L, A) => rho * L / A;
  const inductiveReactance = (f, L) => 2 * Math.PI * f * L;
  const impedanceZ = (R, XL) => Math.hypot(R, XL);
  const phaseDeg = (R, XL) => Math.atan2(XL, R) * R2D;
  const currentDensityAt = (x, delta) => Math.exp(-x / delta);      // J/J0
  const phaseLagDeg = (x, delta) => x / delta * R2D;                  // β = x/δ (rad)
  const wavelength = (v, f) => v / f;                                 // m
  const transmissionCoef = (Z1, Z2) => 1 - reflectionCoef(Z1, Z2);
  const linearAtten = (I0, mu, x) => I0 * Math.exp(-mu * x);
  const hvlFromMu = mu => Math.LN2 / mu;
  const hooke = (E, eps) => E * eps;
  const beamSpreadHalfDeg = (v, f, Dm) => Math.asin(Math.min(1, 1.2 * v / (f * Dm))) * R2D; // tới điểm không (null)
  const aeLocate = (D, v, dt) => (D + v * dt) / 2;                    // vị trí tính từ cảm biến 1; dt = t1 − t2
  const thermalTime = (z, alpha) => z * z / alpha;                   // thời điểm đặc trưng khuyết tật ở độ sâu z hiện lên (mô hình bậc nhất)
  const thermalDepth = (t, alpha) => Math.sqrt(alpha * t);
  const mwGamma = eps => (1 - Math.sqrt(eps)) / (1 + Math.sqrt(eps)); // hệ số phản xạ biên độ, tới vuông góc từ không khí
  const filmDensityFromT = T => -Math.log10(T);                      // D = log10(I0/It)

  const api = { MAT, D2R, R2D, g,
    IACS, ohmI, resistance, inductiveReactance, impedanceZ, phaseDeg, currentDensityAt, phaseLagDeg, wavelength, transmissionCoef,
    linearAtten, hvlFromMu, hooke, beamSpreadHalfDeg, aeLocate, thermalTime, thermalDepth, mwGamma, filmDensityFromT,
    capillaryRiseSlit, washburnTimeSlit, wets,
    leakageFactor, MT_DETECT, skinDepth,
    snell, criticalAngle, incidentFor, angleBeam, skipDistance, spToDepth, dB, ampFromDb, nearField,
    acousticImpedance, reflectionCoef,
    IR192, decay, doseRate, attenuate, inverseSquare, barrierDistance, exposureMinutes, filmDensity, geomUnsharpness };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.Physics = api;
})(this);
