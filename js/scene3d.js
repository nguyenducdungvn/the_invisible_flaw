/* scene3d.js — mô hình 3D tương tác (Three.js r128 tự host trong js/vendor, giấy phép MIT).
 * View3D.mount(el, id): dựng một cảnh có xoay/thu phóng, nhãn tiếng Việt và điều khiển riêng. Tự dừng và giải phóng khi rời trang.
 * Đơn vị cảnh: 1 = 10 mm. Hình học UT dùng cùng công thức với physics.js.
 */
(function (root) {
  'use strict';
  const { h, fmt, toast } = root.Game; const P = root.Physics;
  const T3 = () => root.THREE;
  const COL = { steel: 0x8f9aa3, weld: 0xb7a58a, hi: 0xffc531, cy: 0x43c6f0, bad: 0xff5d5d, ok: 0x3ddc97, dark: 0x1a1f24, alu: 0xc9d1d8, comp: 0x2b3a33 };

  function label(text, opt = {}) {
    const THREE = T3(); const pad = 10, fs = opt.size || 30; const c = document.createElement('canvas'); const x = c.getContext('2d');
    x.font = `600 ${fs}px "Be Vietnam Pro"`; const w = Math.ceil(x.measureText(text).width) + pad * 2, hh = Math.ceil(fs * 1.6) + pad;
    c.width = w; c.height = hh; x.font = `600 ${fs}px "Be Vietnam Pro"`; x.fillStyle = opt.bg || 'rgba(15,20,24,.82)'; x.strokeStyle = opt.border || 'rgba(255,197,49,.8)'; x.lineWidth = 2;
    const r = 10; x.beginPath(); x.moveTo(r, 1); x.arcTo(w - 1, 1, w - 1, hh - 1, r); x.arcTo(w - 1, hh - 1, 1, hh - 1, r); x.arcTo(1, hh - 1, 1, 1, r); x.arcTo(1, 1, w - 1, 1, r); x.fill(); x.stroke();
    x.fillStyle = opt.color || '#e8eef2'; x.textBaseline = 'middle'; x.fillText(text, pad, hh / 2 + 1);
    const tex = new THREE.CanvasTexture(c); tex.minFilter = THREE.LinearFilter;
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, depthTest: false, transparent: true })); const k = (opt.scale || 1) * 0.022;
    s.scale.set(w * k, hh * k, 1); s.renderOrder = 10; return s;
  }
  const mat = (color, o = {}) => new (T3().MeshStandardMaterial)(Object.assign({ color, roughness: 0.55, metalness: 0.35 }, o));
  const box = (w, hh, d, m) => new (T3().Mesh)(new (T3().BoxGeometry)(w, hh, d), m);
  const line = (pts, color, o = {}) => { const THREE = T3(); const g = new THREE.BufferGeometry().setFromPoints(pts.map(p => new THREE.Vector3(...p))); return new THREE.Line(g, new THREE.LineBasicMaterial(Object.assign({ color, transparent: true, opacity: 1 }, o))); };

  /* ================= CẢNH ================= */
  const SCENES = {
    ut: { title: 'Siêu âm đầu dò góc 60° trên mối hàn V dày 25 mm', cam: [11, 8, 13], target: [3, 1, 0],
      note: 'Kéo vị trí đầu dò: chùm sóng ngang (vàng) đi chân 1 xuống đáy, phản xạ, đi chân 2 lên. Màn hình A-scan bên dưới chạy theo: ở y ≈ 44 mm thấy gờ chân mối hàn (SP 50 mm, độ sâu = T), ở y ≈ 84 mm thấy không ngấu (SP 84 mm). Không ngấu ở mặt vát phía đầu dò được “bắt” rõ nhất ở chân 2, khi chùm gần vuông góc mặt vát.',
      build(S, ui) {
        const THREE = T3(), T = 2.5, tan = Math.tan(Math.PI / 3), bev = Math.tan(Math.PI / 6), gap = 0.1, L = 20;
        const plateM = mat(COL.steel, { transparent: true, opacity: 0.28, depthWrite: false });
        [-1, 1].forEach(sd => { const sh = new THREE.Shape(); const a = gap, b = gap + T * bev;
          if (sd > 0) { sh.moveTo(a, 0); sh.lineTo(14, 0); sh.lineTo(14, T); sh.lineTo(b, T); } else { sh.moveTo(-a, 0); sh.lineTo(-14, 0); sh.lineTo(-14, T); sh.lineTo(-b, T); } sh.closePath();
          const g = new THREE.ExtrudeGeometry(sh, { depth: L, bevelEnabled: false }); g.translate(0, 0, -L / 2); const m = new THREE.Mesh(g, plateM); S.add(m);
          const e = new THREE.LineSegments(new THREE.EdgesGeometry(g), new THREE.LineBasicMaterial({ color: 0x6c7f8c })); S.add(e); });
        const ws = new THREE.Shape(); const b = gap + T * bev; ws.moveTo(-gap, 0); ws.lineTo(gap, 0); ws.lineTo(b, T); ws.quadraticCurveTo(0, T + 0.45, -b, T); ws.closePath();
        const wg = new THREE.ExtrudeGeometry(ws, { depth: L, bevelEnabled: false }); wg.translate(0, 0, -L / 2); S.add(new THREE.Mesh(wg, mat(COL.weld, { transparent: true, opacity: 0.5, depthWrite: false })));
        const d = 0.8, fy = T - d, fx = gap + (T - d) * bev; const flaw = box(0.08, 0.45, 1.5, mat(COL.bad, { emissive: 0x551111 })); flaw.position.set(fx, fy, 0); flaw.rotation.z = -Math.PI / 6; S.add(flaw);
        const probe = new THREE.Group(); const wedge = box(2.2, 1.0, 1.6, mat(0x2a6f9e, { metalness: 0.1 })); wedge.position.y = 0.5; probe.add(wedge); const cable = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 2, 12), mat(0x222222)); cable.position.set(0.6, 1.9, 0); cable.rotation.z = -0.5; probe.add(cable); S.add(probe);
        let beam = null; const pulse = new THREE.Mesh(new THREE.SphereGeometry(0.22, 16, 12), new THREE.MeshBasicMaterial({ color: COL.hi })); S.add(pulse);
        const glow = new THREE.Mesh(new THREE.SphereGeometry(0.6, 16, 12), new THREE.MeshBasicMaterial({ color: COL.bad, transparent: true, opacity: 0 })); glow.position.copy(flaw.position); S.add(glow);
        S.add(Object.assign(label('Đầu dò 60°'), {}), label('Mũ mối hàn'), label('Không ngấu thành vát', { border: 'rgba(255,93,93,.9)' }));
        const [lp, lc, lf] = S.children.slice(-3); lc.position.set(0, T + 1.3, -L / 2 + 1); lf.position.set(fx - 1.5, fy - 1.2, 0);
        let xp = 8.4, pts = [];
        // A-scan đồng bộ: tiếng vọng gờ chân (chân 1, SP 50 mm) và không ngấu (chân 2, SP 84 mm)
        const ac = h('canvas', { class: 'screen', style: 'margin-top:8px' }); ui.extra.append(ac);
        const echoes = () => { const x = xp * 10, sig = 3.5;
          return [{ sp: 50, a: 62 * Math.exp(-((x - 25 * tan - 1) ** 2) / (2 * 4 * 4)), n: 'gờ chân' }, { sp: (50 - 8) / 0.5, a: 92 * Math.exp(-((x - (fx * 10 + 42 * tan)) ** 2) / (2 * sig * sig)), n: 'không ngấu (chân 2)' },
            { sp: 8 / 0.5, a: 16 * Math.exp(-((x - (fx * 10 + 8 * tan)) ** 2) / (2 * sig * sig)), n: 'không ngấu (chân 1, yếu)' }]; };
        const asc = () => { const { ctx, W, H } = root.Game.fitCanvas(ac, window.innerWidth < 600 ? 120 : 140); const R = 125, X = mm => 26 + (W - 34) * mm / R, Y = v => H - 16 - (H - 26) * Math.min(1.05, v / 100);
          ctx.fillStyle = '#061109'; ctx.fillRect(0, 0, W, H); ctx.strokeStyle = '#123821'; for (let i = 0; i <= 10; i++) { ctx.beginPath(); ctx.moveTo(X(i * 12.5), 6); ctx.lineTo(X(i * 12.5), H - 16); ctx.stroke(); }
          ctx.fillStyle = '#3ddc97'; ctx.font = '10px "Roboto Mono"'; for (let i = 0; i <= 125; i += 25) ctx.fillText(i, X(i) - 6, H - 4);
          const E = echoes(); ctx.strokeStyle = '#7dff9b'; ctx.lineWidth = 1.2; ctx.beginPath();
          for (let k = 0; k <= W - 34; k++) { const mm = R * k / (W - 34); let v = mm < 3 ? 100 : 2 + Math.random() * 3; for (const e of E) v += e.a * Math.exp(-((mm - e.sp) ** 2) / 1.2) * (0.6 + 0.4 * Math.cos((mm - e.sp) * 6)); k ? ctx.lineTo(X(mm), Y(Math.abs(v))) : ctx.moveTo(X(mm), Y(v)); } ctx.stroke();
          ctx.font = '11px "Be Vietnam Pro"'; ctx.fillStyle = '#e8eef2'; for (const e of E) if (e.a > 12) ctx.fillText(`${e.n} · SP ${fmt(e.sp, 0)} mm`, Math.min(X(e.sp) + 4, W - 170), Y(e.a) - 4);
          ctx.fillStyle = '#9fb0bc'; ctx.fillText('A-scan · SP (mm)', W - 110, 14); };
        let lastA = 0;
        const setProbe = v => { xp = v; probe.position.set(xp, T, 0); lp.position.set(xp + 1, T + 2.2, 0);
          pts = [[xp, T, 0], [xp - T * tan, 0, 0], [xp - 2 * T * tan, T, 0]]; if (beam) S.remove(beam); beam = line(pts, COL.hi, { opacity: 0.9 }); S.add(beam);
          S.userData.hit = Math.abs(xp - (fx + (2 * T - d) * tan)) < 0.2;
          ui.read.textContent = `Điểm ra chùm cách tâm mối hàn ${fmt(xp * 10, 1)} mm · bước nhảy ${fmt(P.skipDistance(25, 60), 1)} mm` + (S.userData.hit ? ' · CHÙM TRÚNG KHÔNG NGẤU Ở CHÂN 2!' : ''); asc(); };
        ui.slider('Vị trí đầu dò (mm tới tâm)', 25, 110, 0.5, xp * 10, v => setProbe(v / 10)); setProbe(xp);
        return t => { const u = (t * 0.6) % 1; let p; if (u < 0.5) { const k = u / 0.5; p = [xp - T * tan * k, T - T * k]; } else { const k = (u - 0.5) / 0.5; p = [xp - T * tan - T * tan * k, T * k]; }
          pulse.position.set(p[0], p[1], 0); glow.material.opacity = S.userData.hit ? 0.35 + 0.3 * Math.sin(t * 8) : 0; if (t - lastA > 0.12) { lastA = t; asc(); } };
      } },

    mt: { title: 'Gông từ AC trên mối hàn: đường sức và chỉ thị hạt từ', cam: [16, 14, 18], target: [0, 1, 0],
      note: 'Xoay gông: hạt từ chỉ tụ lại khi đường sức (xanh) cắt ngang vết nứt. Song song thì gần như không có chỉ thị: vì thế phải kiểm tra hai hướng vuông góc.',
      build(S, ui) {
        const THREE = T3(); const pl = box(22, 1.2, 16, mat(COL.steel)); pl.position.y = -0.6; S.add(pl);
        const bead = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 22, 24), mat(COL.weld)); bead.rotation.z = Math.PI / 2; bead.position.y = 0; S.add(bead);
        const crack = box(5, 0.05, 0.08, new THREE.MeshBasicMaterial({ color: 0x111111 })); crack.position.set(0, 0.7, 0); S.add(crack);
        const yoke = new THREE.Group(); const ym = mat(0x2f5fa0, { metalness: 0.5 }); [-1, 1].forEach(s => { const leg = box(1.2, 4, 1.6, ym); leg.position.set(s * 3, 2, 0); yoke.add(leg); }); const top = box(7.2, 1.2, 1.6, ym); top.position.y = 4.5; yoke.add(top);
        const coil = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.1, 2.6, 24), mat(0xc97a2a, { metalness: 0.6 })); coil.rotation.z = Math.PI / 2; coil.position.y = 4.5; yoke.add(coil); S.add(yoke);
        const lines = new THREE.Group(); for (let k = -3; k <= 3; k++) { const pts = []; for (let i = 0; i <= 30; i++) { const x = -3 + 6 * i / 30; pts.push([x, 0.85 - 0.15 * Math.sin(Math.PI * i / 30) * Math.abs(k) / 3, k * 0.45 * (1 + 0.6 * Math.sin(Math.PI * i / 30))]); } const cur = new THREE.CatmullRomCurve3(pts.map(q => new THREE.Vector3(...q))); lines.add(new THREE.Mesh(new THREE.TubeGeometry(cur, 30, 0.045, 6), new THREE.MeshBasicMaterial({ color: COL.cy, transparent: true }))); } yoke.add(lines);
        const N = 400, pg = new THREE.BufferGeometry(), pos = new Float32Array(N * 3); for (let i = 0; i < N; i++) { pos[i * 3] = (Math.random() - 0.5) * 4.6; pos[i * 3 + 1] = 0.74 + Math.random() * 0.08; pos[i * 3 + 2] = (Math.random() - 0.5) * 0.35; }
        pg.setAttribute('position', new THREE.BufferAttribute(pos, 3)); const pts = new THREE.Points(pg, new THREE.PointsMaterial({ color: 0x050505, size: 0.16, transparent: true })); S.add(pts);
        const lb = label('Vết nứt (dọc mối hàn)'); lb.position.set(-3.5, 1.8, 1.5); const ly = label('Gông từ AC'); ly.position.set(4.5, 5.6, 0); S.add(lb, ly);
        let ang = 90, fill = 0;
        const setA = v => { ang = v; yoke.rotation.y = -ang * Math.PI / 180; const k = P.leakageFactor(ang, 0); ui.read.textContent = `Đường sức lệch vết nứt ${fmt(ang, 0)}° · |sinΔ| = ${fmt(k, 2)} → ${k >= P.MT_DETECT ? 'chỉ thị rõ' : 'chỉ thị yếu hoặc không có'}`; S.userData.k = k; };
        ui.slider('Góc xoay gông', 0, 90, 5, ang, v => setA(v)); setA(ang);
        ui.button('Phun lại hạt từ', () => { fill = 0; });
        return (t, dt) => { const k = S.userData.k; fill = Math.min(1, fill + dt * 0.5); pts.material.opacity = 1; pts.visible = k >= 0.3; pts.scale.set(1, 1, 1); pts.material.size = 0.06 + 0.14 * k * fill; pts.material.transparent = true; pts.material.opacity = k * fill;
          lines.children.forEach((l, i) => l.material.opacity = 0.4 + 0.5 * Math.abs(Math.sin(t * 3 + i))); };
      } },

    pt: { title: 'Mặt cắt vết nứt qua các bước PT', cam: [10, 7, 13], target: [0, -0.5, 0],
      note: 'Kéo qua 5 bước: chất thấm vào vết nứt nhờ mao dẫn, lau sạch bề mặt (không xả dung môi), phủ hiện hình mỏng, chất thấm rỉ ngược lên thành chỉ thị đỏ.',
      build(S, ui) {
        const THREE = T3(); const blk = new THREE.Group(); S.add(blk);
        [-1, 1].forEach(s => { const sh = new THREE.Shape(); sh.moveTo(0.06 * s, 0); sh.lineTo(6 * s, 0); sh.lineTo(6 * s, -4); sh.lineTo(0.01 * s, -4); sh.lineTo(0.005 * s, -2.8); sh.closePath();
          const g = new THREE.ExtrudeGeometry(sh, { depth: 6, bevelEnabled: false }); g.translate(0, 0, -3); blk.add(new THREE.Mesh(g, mat(COL.steel))); });
        const fillG = new THREE.Shape(); fillG.moveTo(-0.06, 0); fillG.lineTo(0.06, 0); fillG.lineTo(0.005, -2.8); fillG.closePath(); const fg = new THREE.ExtrudeGeometry(fillG, { depth: 5.8, bevelEnabled: false }); fg.translate(0, 0, -2.9);
        const crackFill = new THREE.Mesh(fg, new THREE.MeshBasicMaterial({ color: 0xd2141e })); S.add(crackFill);
        const film = box(12, 0.12, 6, new THREE.MeshBasicMaterial({ color: 0xd2141e, transparent: true, opacity: 0.85 })); film.position.y = 0.06; S.add(film);
        const dev = box(12, 0.18, 6, new THREE.MeshStandardMaterial({ color: 0xf3f1ea, roughness: 1, transparent: true, opacity: 0.95 })); dev.position.y = 0.09; S.add(dev);
        const bleed = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 0.02, 40), new THREE.MeshBasicMaterial({ color: 0xd2141e, transparent: true, opacity: 0.9 })); bleed.scale.set(0.3, 1, 2.6); bleed.position.y = 0.2; S.add(bleed);
        const lab = label(''); S.add(lab); lab.position.set(0, 2.2, 0);
        const STEPS = ['1. Bề mặt đã làm sạch, vết nứt rỗng', '2. Phủ chất thấm: mao dẫn kéo vào vết nứt', '3. Lau sạch chất thừa bằng giẻ ẩm dung môi', '4. Phủ lớp hiện hình mỏng, đều', '5. Chất thấm rỉ lên: chỉ thị đỏ trên nền trắng'];
        let step = 1, t0 = 0; const setS = v => { step = v; t0 = S.userData.t || 0; ui.read.textContent = STEPS[step - 1]; S.remove(lab); if (S.userData.lab) S.remove(S.userData.lab); const nl = label(STEPS[step - 1]); nl.position.set(0, 2.4, 0); S.add(nl); S.userData.lab = nl; };
        ui.slider('Bước', 1, 5, 1, 1, v => setS(v)); setS(1);
        return t => { S.userData.t = t; const k = Math.min(1, (t - t0) / 2.5);
          film.visible = step === 2; crackFill.visible = step >= 2; crackFill.scale.y = step === 2 ? k : 1; 
          dev.visible = step >= 4; bleed.visible = step === 5; bleed.scale.x = 0.15 + 0.6 * (step === 5 ? k : 0); bleed.scale.z = 1.5 + 1.4 * (step === 5 ? k : 0); };
      } },

    rt: { title: 'Chụp gamma Ir-192 một thành ống, rào vùng kiểm soát', cam: [15, 11, 18], target: [0, 3, 0],
      note: 'Bật nguồn để thấy hình nón chùm tia qua ống chuẩn trực. Hàng rào đặt nơi suất liều ≤ 7,5 µSv/h, tính từ Ḣ = Γ·A/(k·d²) rồi xác nhận bằng máy đo ở lần chiếu đầu. Kéo bán kính: rào đỏ là chưa đủ xa.',
      build(S, ui) {
        const THREE = T3(); const ground = new THREE.Mesh(new THREE.CircleGeometry(30, 64), mat(0x26303a, { metalness: 0 })); ground.rotation.x = -Math.PI / 2; S.add(ground);
        const pipe = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.6, 16, 40, 1, true), mat(COL.steel, { side: THREE.DoubleSide })); pipe.rotation.z = Math.PI / 2; pipe.position.y = 3; S.add(pipe);
        [-0.02, 0.02].forEach(o => { const w = new THREE.Mesh(new THREE.TorusGeometry(1.62, 0.12, 8, 40), mat(COL.weld)); w.rotation.y = Math.PI / 2; w.position.set(o, 3, 0); S.add(w); });
        const filmM = new THREE.Mesh(new THREE.CylinderGeometry(1.45, 1.45, 1.2, 30, 1, true, Math.PI * 0.75, Math.PI * 0.5), new THREE.MeshBasicMaterial({ color: 0x223a55, side: THREE.DoubleSide })); filmM.rotation.z = Math.PI / 2; filmM.position.y = 3; S.add(filmM);
        const coll = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 1.2, 20), mat(0x555a60, { metalness: 0.8 })); coll.position.set(0, 9, 0); S.add(coll);
        const tube = line([[0, 8.4, 0], [3, 0.4, 4], [8, 0.4, 6]], 0x333333); S.add(tube);
        const cone = new THREE.Mesh(new THREE.ConeGeometry(1.4, 5.8, 32, 1, true), new THREE.MeshBasicMaterial({ color: COL.hi, transparent: true, opacity: 0.18, side: THREE.DoubleSide, depthWrite: false })); cone.position.set(0, 5.6, 0); S.add(cone);
        const NP = 160, pg = new THREE.BufferGeometry(), pp = new Float32Array(NP * 3); pg.setAttribute('position', new THREE.BufferAttribute(pp, 3)); const ph = new THREE.Points(pg, new THREE.PointsMaterial({ color: COL.hi, size: 0.12 })); S.add(ph);
        const seeds = Array.from({ length: NP }, () => [Math.random(), Math.random() * 6.283, Math.random()]);
        let rope = null; const posts = new THREE.Group(); S.add(posts); const person = new THREE.Group(); const body = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 1.6, 12), mat(0x3ddc97)); body.position.y = 0.8; const head = new THREE.Mesh(new THREE.SphereGeometry(0.3, 12, 10), mat(0xf0c8a0)); head.position.y = 1.9; person.add(body, head); S.add(person);
        const lsrc = label('Nguồn Ir-192 + ống chuẩn trực'); lsrc.position.set(0, 10.6, 0); const lfilm = label('Phim đặt trong ống'); lfilm.position.set(0, 1.2, 3); S.add(lsrc, lfilm); let lrope = null;
        const A = P.decay(1850, 90), need = P.barrierDistance(A, 7.5, 16), needOp = P.barrierDistance(A, 10, 16); let R = 12, on = true;
        const setR = v => { R = v; if (rope) S.remove(rope); const pts = []; for (let i = 0; i <= 64; i++) { const a = i / 64 * 6.283; pts.push([Math.cos(a) * R / 1.6, 1, Math.sin(a) * R / 1.6]); }
          const okk = R >= need; rope = line(pts, okk ? COL.ok : COL.bad); S.add(rope); posts.clear(); for (let i = 0; i < 12; i++) { const a = i / 12 * 6.283; const c = new THREE.Mesh(new THREE.ConeGeometry(0.25, 1, 10), mat(okk ? 0xffa21c : COL.bad)); c.position.set(Math.cos(a) * R / 1.6, 0.5, Math.sin(a) * R / 1.6); posts.add(c); }
          person.position.set(R / 1.6 + 1.2, 0, 0); if (lrope) S.remove(lrope); lrope = label(`Rào ${fmt(R, 1)} m · cần ≥ ${fmt(need, 1)} m`, { border: okk ? 'rgba(61,220,151,.9)' : 'rgba(255,93,93,.9)' }); lrope.position.set(0, 2.2, -R / 1.6); S.add(lrope);
          const rate = P.doseRate(A, R) * 1000 / 16; ui.read.textContent = `Hoạt độ hôm nay ${fmt(A, 0)} GBq · suất liều ở rào ≈ ${fmt(rate, 1)} µSv/h ${rate > 7.5 ? '> 7,5: KHÔNG ĐẠT' : '≤ 7,5: đạt'} · thợ chụp đứng ngoài trời cần cách ≥ ${fmt(needOp, 1)} m để ≤ 10 µSv/h, hoặc đứng sau che chắn (mô hình rút gọn)`; };
        ui.slider('Bán kính rào (m)', 6, 40, 0.5, R, v => setR(v)); setR(R);
        ui.button('Bật/thu nguồn', () => { on = !on; toast(on ? 'Nguồn đang mở: không ai được vào trong rào' : 'Đã thu nguồn về container', on ? 'hi' : 'ok'); });
        return t => { cone.visible = ph.visible = on; if (!on) return; for (let i = 0; i < NP; i++) { const s = seeds[i]; const u = (s[0] + t * 0.5) % 1, r = 1.4 * u * Math.sqrt(s[2]); pp[i * 3] = Math.cos(s[1]) * r; pp[i * 3 + 1] = 8.5 - 5.8 * u; pp[i * 3 + 2] = Math.sin(s[1]) * r; } pg.attributes.position.needsUpdate = true; };
      } },

    et: { title: 'Dòng điện xoáy dưới cuộn dây và hiệu ứng bề mặt', cam: [11, 9, 13], target: [0, -0.5, 0],
      note: 'Các vòng dòng xoáy mờ dần theo độ sâu (e^(−z/δ)); chiều sâu trong cảnh được phóng đại để dễ thấy. Tăng tần số: dòng dồn lên bề mặt. Di cuộn dây qua rãnh nứt: các vòng bị cắt, trở kháng thay đổi.',
      build(S, ui) {
        const THREE = T3(); const plate = box(14, 3, 8, mat(COL.alu, { transparent: true, opacity: 0.22, depthWrite: false, metalness: 0.15, roughness: 0.4 })); plate.position.y = -1.5; S.add(plate);
        const slot = box(0.08, 1.2, 4, new THREE.MeshBasicMaterial({ color: 0x111111 })); slot.position.set(2.5, -0.6, 0); S.add(slot);
        const coil = new THREE.Group(); for (let i = 0; i < 8; i++) { const tor = new THREE.Mesh(new THREE.TorusGeometry(1, 0.08, 8, 40), mat(0xc97a2a, { metalness: 0.7 })); tor.rotation.x = Math.PI / 2; tor.position.y = 0.4 + i * 0.18; coil.add(tor); }
        const core = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 2.2, 20), mat(0x333840)); core.position.y = 1.3; coil.add(core); S.add(coil);
        const rings = []; for (let i = 0; i < 6; i++) { const r = new THREE.Mesh(new THREE.TorusGeometry(1.3 + i * 0.12, 0.07, 8, 48), new THREE.MeshBasicMaterial({ color: COL.hi, transparent: true, depthTest: false })); r.rotation.x = Math.PI / 2; S.add(r); rings.push(r); }
        const lc = label('Cuộn dây AC'); lc.position.set(0, 3.4, 0); const ls = label('Rãnh nứt'); ls.position.set(2.5, 0.9, 2.6); S.add(lc, ls);
        let lf = 5, x = -2.5; const al = 40 / 100 * P.IACS;
        const upd = () => { const d = P.skinDepth(Math.pow(10, lf), al, 1) * 100; coil.position.x = x; S.userData.d = d;
          ui.read.textContent = `f = ${Math.pow(10, lf) >= 1e6 ? fmt(Math.pow(10, lf) / 1e6, 2) + ' MHz' : fmt(Math.pow(10, lf) / 1e3, 1) + ' kHz'} · nhôm ≈ 40 % IACS · δ = ${fmt(d * 10, 2)} mm` + (Math.abs(x - 2.5) < 1.2 ? ' · dòng xoáy bị rãnh cắt!' : ''); };
        ui.slider('Tần số (log₁₀ Hz)', 3, 6.5, 0.05, lf, v => { lf = v; upd(); }); ui.slider('Vị trí cuộn dây', -5, 5, 0.1, x, v => { x = v; upd(); }); upd();
        return t => { const d = S.userData.d; rings.forEach((r, i) => { const z = i * 0.25; r.position.set(x, -z - 0.05, 0); const near = Math.abs(x - 2.5) < 1.2 && z < 1.2;
          const dRef = P.skinDepth(1e4, al, 1) * 100; r.material.opacity = Math.exp(-i * 0.45 * dRef / Math.max(1e-4, d)) * (0.6 + 0.4 * Math.sin(t * 6 - i)); r.scale.set(near ? 0.75 : 1, near ? 1.35 : 1, 1); r.visible = r.material.opacity > 0.02; }); };
      } },

    ae: { title: 'Thử áp bồn chứa có giám sát phát xạ âm', cam: [24, 14, 24], target: [0, 4, 0],
      note: 'Bấm “Tăng áp”: vết nứt phát sự kiện, mặt sóng lan ra, các cảm biến sáng lên theo thứ tự đến. Hiệu thời gian đến cho phép định vị nguồn.',
      build(S, ui) {
        const THREE = T3(); const ground = box(40, 0.2, 30, mat(0x26303a, { metalness: 0 })); ground.position.y = -0.1; S.add(ground);
        const shell = new THREE.Group(); const cyl = new THREE.Mesh(new THREE.CylinderGeometry(3.5, 3.5, 14, 48, 1, true), mat(0xa8b3bb, { side: THREE.DoubleSide, transparent: true, opacity: 0.55, depthWrite: false })); cyl.rotation.z = Math.PI / 2; shell.add(cyl);
        [-7, 7].forEach(x => { const hd = new THREE.Mesh(new THREE.SphereGeometry(3.5, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), cyl.material); hd.rotation.z = x > 0 ? -Math.PI / 2 : Math.PI / 2; hd.position.x = x; shell.add(hd); });
        shell.position.y = 4.6; S.add(shell); [-4.5, 4.5].forEach(x => { const sd = box(1, 1.4, 5, mat(0x555a60)); sd.position.set(x, 0.7, 0); S.add(sd); });
        const SP = [[-6, 4.6, 3.5], [6, 4.6, 3.5], [-6, 4.6, -3.5], [6, 4.6, -3.5]]; const sens = SP.map((p, i) => { const s = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.5, 16), mat(0x2f5fa0, { emissive: 0x000000 })); s.rotation.x = Math.PI / 2; s.position.set(...p); S.add(s); const l = label('S' + (i + 1), { size: 26 }); l.position.set(p[0], p[1] + 1, p[2] * 1.15); S.add(l); return s; });
        const wave = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 16), new THREE.MeshBasicMaterial({ color: COL.hi, wireframe: true, transparent: true, opacity: 0.6 })); wave.visible = false; S.add(wave);
        const src = new THREE.Mesh(new THREE.SphereGeometry(0.25, 12, 10), new THREE.MeshBasicMaterial({ color: COL.bad })); src.visible = false; S.add(src);
        let ev = null; ui.read.textContent = 'Bấm “Tăng áp” để gia tải.';
        ui.button('Tăng áp (gia tải)', () => { const x = -5 + Math.random() * 10, a = Math.random() * 6.283; const p = new THREE.Vector3(x, 4.6 + Math.sin(a) * 3.5, Math.cos(a) * 3.5);
          ev = { p, t0: S.userData.t, arr: SP.map(s => p.distanceTo(new THREE.Vector3(...s))) }; src.position.copy(p); src.visible = true; wave.visible = true; sens.forEach(s => s.material.emissive.setHex(0));
          const order = ev.arr.map((d, i) => [d, i]).sort((a, b) => a[0] - b[0]).map(x => 'S' + (x[1] + 1)); ui.read.textContent = `Sự kiện! Thứ tự đến: ${order.join(' → ')} · Δt S1–S2 ≈ ${fmt((ev.arr[0] - ev.arr[1]) / 3000 * 10, 3)} ms (v = 3000 m/s, mô hình đường thẳng)`; });
        return t => { S.userData.t = t; if (!ev) return; const r = (t - ev.t0) * 6; wave.position.copy(ev.p); wave.scale.setScalar(Math.max(0.01, r)); wave.material.opacity = Math.max(0, 0.6 - r / 25);
          ev.arr.forEach((d, i) => { if (r >= d) sens[i].material.emissive.setHex(0xffc531); }); if (r > 25) wave.visible = false; };
      } },

    ir: { title: 'Nhiệt ảnh flash trên tấm composite', cam: [0, 13, 15], target: [0, 0, 0],
      note: 'Bấm “Flash”, rồi kéo thời gian. Tách lớp nông hiện sớm và rõ, tách lớp sâu hiện muộn và mờ (t ≈ z²/α). Bật “Nhìn xuyên” để thấy vị trí thật.',
      build(S, ui) {
        const THREE = T3(); const W = 128, Hh = 96; const cnv = document.createElement('canvas'); cnv.width = W; cnv.height = Hh; const cx = cnv.getContext('2d'); const tex = new THREE.CanvasTexture(cnv);
        const panel = new THREE.Mesh(new THREE.BoxGeometry(16, 0.6, 12), [mat(COL.comp), mat(COL.comp), new THREE.MeshBasicMaterial({ map: tex }), mat(COL.comp), mat(COL.comp), mat(COL.comp)]); S.add(panel);
        const alpha = 4e-7; const D = [{ x: -4.5, z: -2, z0: 0.5e-3, r: 1.6 }, { x: 0.5, z: 2, z0: 1e-3, r: 1.8 }, { x: 4.8, z: -1.5, z0: 2e-3, r: 2 }];
        const ghosts = D.map(d => { const g = new THREE.Mesh(new THREE.CylinderGeometry(d.r, d.r, 0.04, 32), new THREE.MeshBasicMaterial({ color: COL.cy, transparent: true, opacity: 0.6 })); g.position.set(d.x, 0.3 - d.z0 * 1000 * 0.25, d.z); g.visible = false; S.add(g); return g; });
        const lamps = [-5, 5].map(x => { const l = box(3, 0.6, 1.2, new THREE.MeshStandardMaterial({ color: 0x777777, emissive: 0x000000 })); l.position.set(x, 5, 6); l.lookAt(0, 0, 0); S.add(l); return l; });
        let tt = 0.5, see = false, flashAt = -9;
        const paint = () => { const img = cx.createImageData(W, Hh); const bg = 1 / Math.sqrt(tt + 0.2);
          for (let y = 0; y < Hh; y++) for (let x = 0; x < W; x++) { const px = (x / W - 0.5) * 16, pz = (y / Hh - 0.5) * 12; let v = 0.32 * bg;
            for (const d of D) { const ti = P.thermalTime(d.z0, alpha); const c = (0.5e-3 / d.z0) * (1 - Math.exp(-tt / ti)) * Math.exp(-tt / (8 * ti)); v += 0.6 * c * Math.exp(-((px - d.x) ** 2 + (pz - d.z) ** 2) / (d.r * d.r)); }
            v = Math.max(0, Math.min(1, v)); const k = (y * W + x) * 4; img.data[k] = 255 * Math.min(1, v * 2); img.data[k + 1] = 255 * Math.max(0, v * 2 - 0.6); img.data[k + 2] = 90 * (1 - v); img.data[k + 3] = 255; }
          cx.putImageData(img, 0, 0); tex.needsUpdate = true; ui.read.textContent = `t = ${fmt(tt, 1)} s sau flash · A sâu 0,5 mm · B sâu 1 mm · C sâu 2 mm · α = 4·10⁻⁷ m²/s (tham khảo)`; };
        ui.slider('Thời gian sau flash (s)', 0.1, 30, 0.1, tt, v => { tt = v; paint(); });
        ui.button('Flash', () => { flashAt = S.userData.t; tt = 0.1; paint(); }); ui.button('Nhìn xuyên', () => { see = !see; ghosts.forEach(g => g.visible = see); panel.material.forEach(m => { m.transparent = see; m.opacity = see ? 0.35 : 1; }); });
        paint(); ['A', 'B', 'C'].forEach((n, i) => { const l = label(n, { size: 26 }); l.position.set(D[i].x, 1.6, D[i].z); S.add(l); });
        return t => { S.userData.t = t; const f = Math.max(0, 1 - (t - flashAt) * 3); lamps.forEach(l => l.material.emissive.setRGB(f, f, f * 0.9)); };
      } },

    atom: { title: 'Mô hình nguyên tử (Bohr, minh họa)', cam: [0, 5, 20], target: [0, 0.5, 0],
      note: 'Hạt nhân: proton đỏ, neutron xám. Electron chạy trên các lớp. Chọn đồng vị để so sánh Fe-56 bền với các nguồn gamma của RT. Mô hình lớp vỏ chỉ để minh họa.',
      build(S, ui) {
        const THREE = T3(); const nuc = new THREE.Group(); S.add(nuc); const shells = new THREE.Group(); S.add(shells); let els = [];
        const pm = mat(COL.bad, { metalness: 0.1 }), nm = mat(0x9aa6af, { metalness: 0.1 }), em = new THREE.MeshBasicMaterial({ color: COL.cy });
        let lab = null;
        const make = (Z, N, name) => { nuc.clear(); shells.clear(); els = []; const A = Z + N, R = 0.35 * Math.cbrt(A);
          for (let i = 0; i < A; i++) { const y = 1 - 2 * (i + 0.5) / A, r = Math.sqrt(1 - y * y), a = i * 2.39996; const rr = R * Math.cbrt((i + 1) / A); const s = new THREE.Mesh(new THREE.SphereGeometry(0.16, 10, 8), (i * 7919) % A < Z ? pm : nm); s.position.set(Math.cos(a) * r * rr, y * rr, Math.sin(a) * r * rr); nuc.add(s); }
          const caps = [2, 8, 18, 32, 32, 18, 8]; let left = Z; caps.forEach((c, i) => { if (left <= 0) return; const n = Math.min(c, left); left -= n; const rad = 2.4 + i * 0.95;
            const ring = new THREE.Mesh(new THREE.TorusGeometry(rad, 0.015, 6, 80), new THREE.MeshBasicMaterial({ color: 0x6c7f8c })); ring.rotation.x = Math.PI / 2 + i * 0.25; ring.rotation.y = i * 0.4; shells.add(ring);
            for (let k = 0; k < n; k++) { const e = new THREE.Mesh(new THREE.SphereGeometry(0.09, 8, 6), em); shells.add(e); els.push({ e, rad, ring, a0: k / n * 6.283, w: 1.2 / (i + 1) }); } });
          if (lab) S.remove(lab); lab = label(`${name} · Z = ${Z}, N = ${N}, A = ${A}`); lab.position.set(0, 3.6, 0); S.add(lab); ui.read.textContent = `${name}: ${Z} proton, ${N} neutron, ${Z} electron`; };
        [['Fe-56 (bền)', 26, 30], ['Co-60 (gamma)', 27, 33], ['Se-75 (gamma)', 34, 41], ['Ir-192 (gamma)', 77, 115]].forEach(([n, z, nn]) => ui.button(n, () => make(z, nn, n.split(' ')[0])));
        make(26, 30, 'Fe-56');
        return t => { nuc.rotation.y = t * 0.3; for (const o of els) { const a = o.a0 + t * o.w; const v = new THREE.Vector3(Math.cos(a) * o.rad, 0, Math.sin(a) * o.rad); v.applyEuler(new THREE.Euler(o.ring.rotation.x - Math.PI / 2, o.ring.rotation.y, 0)); o.e.position.copy(v); } };
      } },

    wavemodes: { title: 'Các kiểu dao động của sóng siêu âm', cam: [0, 1.5, 13], target: [0, -1.8, 0],
      note: 'Mỗi chấm là một phần tử vật liệu. Sóng dọc: dao động cùng phương truyền (nén – giãn). Sóng ngang: dao động vuông góc. Sóng Rayleigh: quỹ đạo elip, tắt dần trong khoảng một bước sóng dưới bề mặt. Biên độ phóng đại để dễ thấy.',
      build(S, ui) {
        const THREE = T3(); const NX = 40, NY = 10, dx = 0.5, N = NX * NY; const g = new THREE.BufferGeometry(), pos = new Float32Array(N * 3); g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        const col = new Float32Array(N * 3); g.setAttribute('color', new THREE.BufferAttribute(col, 3)); const pts = new THREE.Points(g, new THREE.PointsMaterial({ size: 0.3, vertexColors: true })); S.add(pts);
        const arrow = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(-10, 0.9, 0), 4, 0xffc531, 0.8, 0.5); S.add(arrow);
        const la = label('Hướng truyền sóng', { scale: 0.7 }); la.position.set(-4.5, 0.9, 0); S.add(la);
        let mode = 'L'; const lam = 5;
        const NAMES = { L: 'Sóng dọc (L): thép ≈ 5920 m/s, đi được trong rắn, lỏng, khí', S: 'Sóng ngang (S): thép ≈ 3240 m/s, chỉ đi trong chất rắn', R: 'Sóng Rayleigh (mặt): ≈ 0,92 vS, tắt dần trong khoảng 1 bước sóng dưới bề mặt' };
        const setM = m => { mode = m; ui.read.textContent = NAMES[m] + ' · bước sóng trong cảnh = 5 đơn vị'; };
        [['L', 'Sóng dọc'], ['S', 'Sóng ngang'], ['R', 'Sóng Rayleigh']].forEach(([k, n]) => ui.button(n, () => setM(k))); setM('L');
        return t => { const k = 2 * Math.PI / lam, w = 3; for (let j = 0; j < NY; j++) for (let i = 0; i < NX; i++) { const n = j * NX + i, x0 = -10 + i * dx, y0 = -j * dx; const ph = k * x0 - w * t;
            let ux = 0, uy = 0, amp = 0.35;
            if (mode === 'L') ux = amp * Math.sin(ph); else if (mode === 'S') uy = amp * Math.sin(ph); else { const dec = Math.exp(-(j * dx) / (lam * 0.35)); ux = amp * dec * Math.cos(ph); uy = amp * dec * 1.4 * Math.sin(ph); }
            pos[n * 3] = x0 + ux; pos[n * 3 + 1] = y0 + uy; pos[n * 3 + 2] = 0; const c = 0.5 + 0.5 * Math.sin(ph); col[n * 3] = 0.26 + 0.7 * c; col[n * 3 + 1] = 0.6 + 0.3 * c; col[n * 3 + 2] = 0.95 - 0.6 * c; }
          g.attributes.position.needsUpdate = true; g.attributes.color.needsUpdate = true; };
      } },

    lattice: { title: 'Mạng tinh thể: ferit (BCC) và austenit (FCC)', cam: [5.2, 4.2, 6.2], target: [1.2, 1.3, 1.2],
      note: 'Ferit lập phương tâm khối (BCC) nhiễm từ: dùng được MT. Austenit lập phương tâm mặt (FCC) gần như không nhiễm từ, hạt thô trong mối hàn làm siêu âm bị lệch và tán xạ. Hình vẽ 2×2×2 ô cơ sở.',
      build(S, ui) {
        const THREE = T3(); const grp = new THREE.Group(); S.add(grp); const sm = mat(0x9aa6af, { metalness: 0.6 }), cm = mat(COL.hi, { metalness: 0.4 }), fm = mat(COL.cy, { metalness: 0.4 });
        let lab = null;
        const make = type => { grp.clear(); const a = 1.2, nC = 2, seen = new Set(); const add = (x, y, z, m, r) => { const key = [x, y, z].map(v => v.toFixed(2)).join(); if (seen.has(key)) return; seen.add(key); const s = new THREE.Mesh(new THREE.SphereGeometry(r, 18, 14), m); s.position.set(x, y, z); grp.add(s); };
          for (let i = 0; i <= nC; i++) for (let j = 0; j <= nC; j++) for (let k = 0; k <= nC; k++) add(i * a, j * a, k * a, sm, 0.18);
          for (let i = 0; i < nC; i++) for (let j = 0; j < nC; j++) for (let k = 0; k < nC; k++) { const o = [i * a, j * a, k * a];
            if (type === 'bcc') add(o[0] + a / 2, o[1] + a / 2, o[2] + a / 2, cm, 0.2);
            else [[a / 2, a / 2, 0], [a / 2, 0, a / 2], [0, a / 2, a / 2], [a / 2, a / 2, a], [a / 2, a, a / 2], [a, a / 2, a / 2]].forEach(d => add(o[0] + d[0], o[1] + d[1], o[2] + d[2], fm, 0.2)); }
          const e = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(a * nC, a * nC, a * nC)), new THREE.LineBasicMaterial({ color: 0x6c7f8c })); e.position.set(a, a, a); grp.add(e);
          for (let i = 0; i <= nC; i++) for (let j = 0; j <= nC; j++) { grp.add(line([[i * a, j * a, 0], [i * a, j * a, a * nC]], 0x3a4a56)); grp.add(line([[i * a, 0, j * a], [i * a, a * nC, j * a]], 0x3a4a56)); grp.add(line([[0, i * a, j * a], [a * nC, i * a, j * a]], 0x3a4a56)); }
          if (lab) S.remove(lab); lab = label(type === 'bcc' ? 'Ferit BCC · sắt từ · MT dùng được' : 'Austenit FCC · gần như không nhiễm từ · MT không dùng được', { border: type === 'bcc' ? 'rgba(255,197,49,.9)' : 'rgba(67,198,240,.9)', scale: 0.45 }); lab.position.set(1.2, 3.3, 1.2); S.add(lab);
          ui.read.textContent = type === 'bcc' ? 'BCC: 1 nguyên tử ở tâm mỗi ô (vàng). Thép cacbon, thép hợp kim thấp ở nhiệt độ thường.' : 'FCC: 1 nguyên tử ở tâm mỗi mặt (xanh). Inox 304, 316; niken; nhôm; đồng.'; };
        ui.button('Ferit (BCC)', () => make('bcc')); ui.button('Austenit (FCC)', () => make('fcc')); make('bcc');
        return t => { grp.rotation.y = t * 0.25; };
      } },

    mtfield: { title: 'Từ hóa tròn (dòng qua chi tiết) và từ hóa dọc (cuộn dây)', cam: [10, 7, 13], target: [0, 0, 0],
      note: 'Thanh có hai vết nứt: một dọc trục, một vòng quanh chu vi. Dòng chạy qua thanh tạo từ trường tròn: vết nứt dọc hiện chỉ thị. Đặt thanh trong cuộn dây tạo từ trường dọc: vết nứt vòng hiện chỉ thị. Cần cả hai cách để không bỏ sót.',
      build(S, ui) {
        const THREE = T3(); const bar = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 12, 40), mat(COL.steel)); bar.rotation.z = Math.PI / 2; S.add(bar);
        const cl = box(3, 0.04, 0.05, new THREE.MeshBasicMaterial({ color: 0x111111 })); cl.position.set(-2.5, 1.0, 0); S.add(cl);
        const cc = new THREE.Mesh(new THREE.TorusGeometry(1.005, 0.025, 6, 60, Math.PI * 1.2), new THREE.MeshBasicMaterial({ color: 0x111111 })); cc.rotation.y = Math.PI / 2; cc.rotation.z = Math.PI * 0.4; cc.position.x = 3; S.add(cc);
        const circ = new THREE.Group(); for (let i = -5; i <= 5; i++) { const r = new THREE.Mesh(new THREE.TorusGeometry(1.15, 0.03, 6, 48), new THREE.MeshBasicMaterial({ color: COL.cy, transparent: true })); r.rotation.y = Math.PI / 2; r.position.x = i; circ.add(r); } S.add(circ);
        const longi = new THREE.Group(); for (let k = 0; k < 10; k++) { const a = k / 10 * 6.283; longi.add(line([[-6.5, Math.cos(a) * 1.12, Math.sin(a) * 1.12], [6.5, Math.cos(a) * 1.12, Math.sin(a) * 1.12]], COL.cy)); } S.add(longi);
        const coil = new THREE.Group(); for (let i = 0; i < 14; i++) { const t = new THREE.Mesh(new THREE.TorusGeometry(1.6, 0.07, 8, 40), mat(0xc97a2a, { metalness: 0.7 })); t.rotation.y = Math.PI / 2; t.position.x = -1.3 + i * 0.2; coil.add(t); } S.add(coil);
        const clamps = new THREE.Group(); [-6.4, 6.4].forEach(x => { const c = box(0.6, 2.6, 2.6, mat(0xb08a3a, { metalness: 0.7 })); c.position.x = x; clamps.add(c); }); S.add(clamps);
        const mkP = (n, fn) => { const g = new THREE.BufferGeometry(), p = new Float32Array(n * 3); for (let i = 0; i < n; i++) fn(p, i); g.setAttribute('position', new THREE.BufferAttribute(p, 3)); const m = new THREE.Points(g, new THREE.PointsMaterial({ color: 0x050505, size: 0.12, transparent: true })); S.add(m); return m; };
        const pL = mkP(220, (p, i) => { p[i * 3] = -4 + Math.random() * 3; p[i * 3 + 1] = 1.02 + Math.random() * 0.05; p[i * 3 + 2] = (Math.random() - 0.5) * 0.18; });
        const pC = mkP(220, (p, i) => { const a = Math.PI * 0.4 + Math.random() * Math.PI * 1.2; p[i * 3] = 3 + (Math.random() - 0.5) * 0.18; p[i * 3 + 1] = Math.cos(a) * 1.04; p[i * 3 + 2] = Math.sin(a) * 1.04; });
        const l1 = label('Vết nứt dọc', { scale: 0.7 }), l2 = label('Vết nứt vòng', { scale: 0.7 }); l1.position.set(-3.5, 2.3, 0); l2.position.set(4.6, 2.3, 0); S.add(l1, l2);
        let mode = 'head', fill = 0;
        const setM = m => { mode = m; fill = 0; circ.visible = clamps.visible = m === 'head'; longi.visible = coil.visible = m === 'coil';
          ui.read.textContent = m === 'head' ? 'Head shot: dòng chạy dọc thanh → từ trường tròn (xanh) → chỉ thị ở vết nứt DỌC' : 'Cuộn dây: từ trường dọc trục (xanh) → chỉ thị ở vết nứt VÒNG'; };
        ui.button('Dòng qua chi tiết (head shot)', () => setM('head')); ui.button('Cuộn dây (coil shot)', () => setM('coil')); setM('head');
        return (t, dt) => { fill = Math.min(1, fill + dt * 0.6); pL.material.opacity = mode === 'head' ? fill : 0.05; pC.material.opacity = mode === 'coil' ? fill : 0.05;
          (mode === 'head' ? circ : longi).children.forEach((c, i) => { if (c.material) c.material.opacity = 0.45 + 0.5 * Math.abs(Math.sin(t * 3 + i)); }); };
      } },

    vt: { title: 'Điều kiện quan sát trực tiếp (ASME V T-952)', cam: [9, 8, 12], target: [0, 1, 0],
      note: 'Kéo khoảng cách, góc nhìn và độ rọi. Tia nhìn chuyển xanh khi đạt cả ba điều kiện: mắt ≤ 600 mm, góc ≥ 30° so với bề mặt, ≥ 1000 lx. Đèn càng gần, độ rọi càng lớn (tỉ lệ 1/d²).',
      build(S, ui) {
        const THREE = T3(); const plate = box(14, 0.6, 8, mat(COL.steel)); plate.position.y = -0.3; S.add(plate);
        const bead = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 14, 20), mat(COL.weld)); bead.rotation.z = Math.PI / 2; S.add(bead);
        const ut = box(0.6, 0.05, 0.12, new THREE.MeshBasicMaterial({ color: 0x331111 })); ut.position.set(0, 0.32, 0.42); S.add(ut);
        const eye = new THREE.Group(); const ball = new THREE.Mesh(new THREE.SphereGeometry(0.35, 20, 14), mat(0xf0f0f0, { metalness: 0 })); const iris = new THREE.Mesh(new THREE.SphereGeometry(0.16, 14, 10), mat(0x2a6f9e)); iris.position.z = -0.25; eye.add(ball, iris); S.add(eye);
        const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.3, 14, 10), new THREE.MeshBasicMaterial({ color: 0xfff2b0 })); S.add(lamp); const pl = new THREE.PointLight(0xfff2cc, 1, 30); lamp.add(pl);
        let ray = null, arc = null, d = 800, ang = 20, lx = 600;
        const upd = () => { const r = d / 200, a = ang * Math.PI / 180; eye.position.set(0, Math.sin(a) * r, 0.42 + Math.cos(a) * r); eye.lookAt(0, 0.32, 0.42);
          const okk = d <= 600 && ang >= 30 && lx >= 1000; if (ray) S.remove(ray); ray = line([[eye.position.x, eye.position.y, eye.position.z], [0, 0.32, 0.42]], okk ? COL.ok : COL.bad); S.add(ray);
          if (arc) S.remove(arc); const ap = []; for (let i = 0; i <= 20; i++) { const b = a * i / 20; ap.push([0, 0.32 + Math.sin(b) * 1.5, 0.42 + Math.cos(b) * 1.5]); } arc = line(ap, COL.hi); S.add(arc);
          const ld = Math.sqrt(1000 / lx) * 1.0; lamp.position.set(-1.5, 0.32 + ld * 0.8, 0.42 + ld * 0.6); pl.intensity = Math.min(2, lx / 800);
          const nl = label(`${d} mm · ${ang}° · ${lx} lx`, { border: okk ? 'rgba(61,220,151,.9)' : 'rgba(255,93,93,.9)', scale: 0.55 }); nl.position.set(eye.position.x, eye.position.y + 1.1, eye.position.z); S.userData.nl && S.remove(S.userData.nl); S.add(nl); S.userData.nl = nl;
          ui.read.textContent = [[d <= 600, `mắt ${d} mm ≤ 600`], [ang >= 30, `góc ${ang}° ≥ 30°`], [lx >= 1000, `độ rọi ${lx} lx ≥ 1000`]].map(([g, t]) => (g ? '✓ ' : '✗ ') + t).join(' · ') + (okk ? ' → ĐẠT quan sát trực tiếp' : ' → chưa đạt'); };
        ui.slider('Khoảng cách mắt (mm)', 150, 1200, 50, d, v => { d = v; upd(); }); ui.slider('Góc nhìn (°)', 5, 90, 5, ang, v => { ang = v; upd(); }); ui.slider('Độ rọi (lx)', 200, 2000, 50, lx, v => { lx = v; upd(); }); upd();
        const lu = label('Cháy cạnh nhỏ', { size: 24, scale: 0.7 }); lu.position.set(2.4, 0.9, 1.6); S.add(lu);
        return () => {};
      } },

    mw: { title: 'Đầu dò vi ba quét tấm composite có vùng ngấm nước', cam: [11, 9, 13], target: [0, 0.5, 0],
      note: 'Kéo đầu dò (ống dẫn sóng hở) qua tấm. Ở vùng ngấm nước, hằng số điện môi tăng nên sóng phản xạ (vàng) mạnh lên rõ rệt. Kim loại phía dưới phản xạ toàn phần nên vi ba không “nhìn” được vào trong kim loại.',
      build(S, ui) {
        const THREE = T3(); const panel = box(14, 1, 8, mat(0xd8cfa8, { metalness: 0, transparent: true, opacity: 0.55, depthWrite: false })); panel.position.y = 0; S.add(panel);
        const base = box(14, 0.3, 8, mat(COL.alu, { metalness: 0.8 })); base.position.y = -0.65; S.add(base);
        const wet = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 16), new THREE.MeshBasicMaterial({ color: 0x2a7fd6, transparent: true, opacity: 0.55 })); wet.scale.set(2, 0.35, 1.6); wet.position.set(2, 0, 0); S.add(wet);
        const horn = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.9, 1.4, 4, 1, true), mat(0xb87333, { metalness: 0.8, side: THREE.DoubleSide })); horn.rotation.y = Math.PI / 4; const guide = box(0.45, 1.4, 0.25, mat(0xb87333, { metalness: 0.8 })); guide.position.y = 1.4; const hg = new THREE.Group(); hg.add(horn, guide); S.add(hg);
        const inc = [], ref = []; for (let i = 0; i < 3; i++) { const a = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.03, 6, 30), new THREE.MeshBasicMaterial({ color: COL.cy, transparent: true })); a.rotation.x = Math.PI / 2; S.add(a); inc.push(a);
          const b = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.04, 6, 30), new THREE.MeshBasicMaterial({ color: COL.hi, transparent: true })); b.rotation.x = Math.PI / 2; S.add(b); ref.push(b); }
        const lw = label('Vùng ngấm nước', { scale: 0.7 }), ls = label('Nền kim loại', { scale: 0.7 }); lw.position.set(2, 1.3, -2.4); ls.position.set(-5, -1.3, 4.4); S.add(lw, ls);
        let x = -4, G = 0; const eDry = 4.5;
        const upd = () => { hg.position.set(x, 2.1, 0); const wetF = Math.exp(-((x - 2) ** 2) / (2 * 1.2 * 1.2)); const eps = eDry + (40 - eDry) * wetF; G = Math.abs(P.mwGamma(eps));
          ui.read.textContent = `Vị trí ${fmt(x * 10, 0)} mm · ε ≈ ${fmt(eps, 1)} · |Γ| ≈ ${fmt(G, 2)} · công suất phản xạ ≈ ${fmt(G * G * 100, 0)} % (mô hình minh họa, chỉ tính bề mặt)`; };
        ui.slider('Vị trí đầu dò', -6, 6, 0.1, x, v => { x = v; upd(); }); upd();
        return t => { for (let i = 0; i < 3; i++) { const u = (t * 0.8 + i / 3) % 1; inc[i].position.set(x, 1.4 - u * 0.9, 0); inc[i].scale.setScalar(0.6 + u * 0.8); inc[i].material.opacity = 0.8 * (1 - u);
            ref[i].position.set(x, 0.5 + u * 1.0, 0); ref[i].scale.setScalar(0.7 + u * 1.2); ref[i].material.opacity = Math.min(1, G * 1.6) * (1 - u); } };
      } },

    probe: { title: 'Cấu tạo đầu dò siêu âm (tách rời từng bộ phận)', cam: [5.6, 4.6, 7.2], target: [0, 2.3, 0],
      note: 'Chọn loại đầu dò, kéo “Tách rời” để thấy các lớp bên trong, bấm tên bộ phận để xem chức năng. Kích thước minh họa, không theo tỉ lệ.',
      build(S, ui) {
        const THREE = T3(); const grp = new THREE.Group(); S.add(grp); let parts = [], ex = 0, kind = 'angle', labs = [];
        const DESC = { vo: 'Vỏ: bảo vệ, chống nhiễu điện từ, chịu va đập.', noi: 'Đầu nối: dẫn xung kích thích vào và tín hiệu thu ra qua cáp đồng trục.', giam: 'Lớp giảm chấn (bột vonfram trong epoxy): dập dao động phía sau, làm xung ngắn lại. Giảm chấn mạnh: phân giải tốt, kém nhạy.',
          bien: 'Biến tử áp điện (PZT): dày ≈ λ/2 quyết định tần số; đường kính quyết định vùng gần và độ mở chùm.', dien: 'Điện cực bạc/vàng phủ hai mặt biến tử để đặt điện áp và lấy tín hiệu.', phoi: 'Lớp bảo vệ/phối hợp dày ≈ λ/4: chống mài mòn, giúp truyền năng lượng vào vật.',
          nem: 'Nêm Perspex (vL = 2730 m/s): tạo góc tới để trong thép thành sóng ngang ở góc danh định. Thời gian qua nêm là “probe delay”.', tieu: 'Khối tiêu âm ở đuôi nêm: dập phản xạ nội bộ trong nêm.', diem: 'Vạch điểm ra tia: chỗ chùm trung tâm rời nêm; xác định lại trên V1/V2 vì nêm mòn.',
          vach: 'Vách cách âm: ngăn sóng đi thẳng từ biến tử phát sang biến tử thu, nhờ đó đo được vật mỏng.', tre: 'Đường trễ: đẩy xung phát ra khỏi vùng đo; hai đường trễ nghiêng nhẹ (roof angle) để chùm hội tụ ở độ sâu cần đo.' };
        const add = (key, mesh, dir, name) => { mesh.userData = { key, base: mesh.position.clone(), dir: new THREE.Vector3(...dir) }; grp.add(mesh); parts.push(mesh); const l = label(name, { scale: 0.42 }); l.userData = { m: mesh, off: new THREE.Vector3(dir[0] * 0.6, -0.35, 1.0) }; S.add(l); labs.push(l); };
        const mk = () => { parts.forEach(p => grp.remove(p)); labs.forEach(l => S.remove(l)); parts = []; labs = []; const glass = mat(0x8899aa, { transparent: true, opacity: 0.18, depthWrite: false });
          if (kind === 'straight' || kind === 'angle') {
            const y0 = kind === 'angle' ? 1.3 : 0;
            if (kind === 'angle') { const sh = new THREE.Shape(); sh.moveTo(-1.4, 0); sh.lineTo(1.4, 0); sh.lineTo(1.4, 0.4); sh.lineTo(-1.4, 1.25); sh.closePath(); const g = new THREE.ExtrudeGeometry(sh, { depth: 1.2, bevelEnabled: false }); g.translate(0, 0, -0.6);
              add('nem', new THREE.Mesh(g, mat(0x9fd3ff, { transparent: true, opacity: 0.55, metalness: 0 })), [0, -1, 0], 'Nêm Perspex');
              const tb = box(0.5, 0.9, 1.2, mat(0x3a2f2a, { metalness: 0 })); tb.position.set(-1.15, 0.5, 0); add('tieu', tb, [-1, 0, 0], 'Khối tiêu âm');
              const im = box(0.04, 0.3, 0.02, new THREE.MeshBasicMaterial({ color: 0xff3333 })); im.position.set(0.55, 0.15, 0.62); add('diem', im, [0, 0, 1], 'Điểm ra tia'); }
            const tilt = kind === 'angle' ? -0.29 : 0; const stack = new THREE.Group(); stack.position.set(kind === 'angle' ? 0.1 : 0, y0 + (kind === 'angle' ? 0.12 : 0.05), 0); stack.rotation.z = tilt; grp.add(stack);
            let li = 0; const L = (key, h0, hh, m, name, r = 0.5) => { li++; const c = new THREE.Mesh(new THREE.CylinderGeometry(r, r, hh, 32), m); c.position.y = h0; c.userData = { key, base: c.position.clone(), dir: new THREE.Vector3(0, 0.7 * li, 0) }; stack.add(c); parts.push(c); const l = label(name, { scale: 0.42 }); l.userData = { m: c, off: new THREE.Vector3(li % 2 ? 1.5 : -1.5, 0, 0) }; S.add(l); labs.push(l); };
            if (kind === 'straight') L('phoi', 0.03, 0.06, mat(0xd8d0c0, { metalness: 0 }), 'Lớp bảo vệ λ/4');
            L('dien', 0.08, 0.02, mat(0xe0e0e0, { metalness: 0.9 }), 'Điện cực'); L('bien', 0.15, 0.12, mat(0xf0c95a, { metalness: 0.3 }), 'Biến tử PZT'); L('giam', 0.55, 0.65, mat(0x2b2b2b, { metalness: 0.2 }), 'Lớp giảm chấn');
            L('noi', 1.25, 0.5, mat(0xc9a227, { metalness: 0.9 }), 'Đầu nối', 0.18);
            const hous = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.62, 1.3, 32, 1, true), glass); hous.position.y = 0.55; hous.userData = { key: 'vo', base: hous.position.clone(), dir: new THREE.Vector3(0, 0, -1) }; stack.add(hous); parts.push(hous);
          } else {
            [-1, 1].forEach(sd => { const dl = box(0.7, 0.6, 1, mat(0x9fd3ff, { transparent: true, opacity: 0.55, metalness: 0 })); dl.position.set(sd * 0.42, 0.3, 0); dl.rotation.z = sd * 0.06; add('tre', dl, [sd, 0, 0], sd < 0 ? 'Đường trễ (phát)' : 'Đường trễ (thu)');
              const cr = box(0.6, 0.08, 0.8, mat(0xf0c95a)); cr.position.set(sd * 0.42, 0.65, 0); add('bien', cr, [sd, 1, 0], sd < 0 ? 'Biến tử phát' : 'Biến tử thu');
              const bk = box(0.6, 0.5, 0.8, mat(0x2b2b2b)); bk.position.set(sd * 0.42, 0.95, 0); add('giam', bk, [sd, 2, 0], 'Giảm chấn'); });
            const bar = box(0.06, 1.3, 1, mat(0xbb4444, { metalness: 0 })); bar.position.set(0, 0.65, 0); add('vach', bar, [0, 0, 1], 'Vách cách âm');
          } setEx(ex); };
        const setEx = v => { ex = v; parts.forEach(p => { if (p.userData.base) p.position.copy(p.userData.base).addScaledVector(p.userData.dir, ex * 0.9); }); };
        [['angle', 'Đầu dò góc'], ['straight', 'Đầu dò thẳng'], ['tr', 'Đầu dò kép TR']].forEach(([k, n]) => ui.button(n, () => { kind = k; mk(); ui.read.textContent = n + ': bấm tên bộ phận để xem chức năng.'; }));
        ui.slider('Tách rời', 0, 1, 0.02, 0, v => setEx(v));
        const info = h('div', { class: 'row', style: 'margin-top:4px' }); ui.extra.append(info);
        Object.entries({ bien: 'Biến tử', giam: 'Giảm chấn', dien: 'Điện cực', phoi: 'Lớp λ/4', nem: 'Nêm', tieu: 'Tiêu âm', diem: 'Điểm ra tia', vach: 'Vách cách âm', tre: 'Đường trễ', noi: 'Đầu nối', vo: 'Vỏ' }).forEach(([k, n]) => info.append(h('button', { class: 'btn sm ghost', onclick: () => {
          ui.read.textContent = DESC[k]; parts.forEach(p => { if (p.material && p.material.emissive) p.material.emissive.setHex(p.userData.key === k ? 0x553300 : 0); }); } }, n)));
        mk(); ui.read.textContent = 'Đầu dò góc: bấm tên bộ phận để xem chức năng.';
        const wp = new THREE.Vector3();
        return t => { labs.forEach(l => { l.userData.m.getWorldPosition(wp); l.position.copy(wp).add(l.userData.off); }); grp.rotation.y = Math.sin(t * 0.3) * 0.25; };
      } },

    rsmap: { title: 'Bản đồ suất liều quanh nguồn Ir-192 ở hiện trường', cam: [0, 72, 58], target: [0, 0, 0],
      note: 'Màu trên sàn là suất liều khi đang chiếu (chùm chính hướng xuống, mọi hướng ngang đều ngoài chùm). Đường cam: hàng rào 7,5 µSv/h; đường xanh: 10 µSv/h. Vách thép chỉ che phía sau nó. Kéo người để xem suất liều và liều trong ca. Mô hình nguồn điểm, chưa tính tán xạ.',
      build(S, ui) {
        const THREE = T3(); const N = 160, half = 40; const c = document.createElement('canvas'); c.width = c.height = N; const cx = c.getContext('2d'); const tex = new THREE.CanvasTexture(c); tex.magFilter = THREE.NearestFilter;
        const floor = new THREE.Mesh(new THREE.PlaneGeometry(2 * half, 2 * half), new THREE.MeshBasicMaterial({ map: tex })); floor.rotation.x = -Math.PI / 2; S.add(floor);
        const src = new THREE.Mesh(new THREE.SphereGeometry(0.6, 16, 12), new THREE.MeshBasicMaterial({ color: 0xff5a1f })); src.position.y = 1; S.add(src);
        const coll = box(1.2, 1.2, 1.2, mat(0x13233a)); coll.position.y = 1.6; S.add(coll); const ls = label('Nguồn + ống chuẩn trực', { scale: 0.9 }); ls.position.set(0, 4, 0); S.add(ls);
        const wall = box(0.6, 4, 20, mat(0x5a6570)); S.add(wall); const lw = label('Vách thép', { scale: 0.8 }); S.add(lw);
        const person = new THREE.Group(); const pb = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 3, 12), mat(0x3ddc97)); pb.position.y = 1.5; const ph = new THREE.Mesh(new THREE.SphereGeometry(0.55, 12, 10), mat(0xf0c8a0)); ph.position.y = 3.5; person.add(pb, ph); S.add(person);
        let ci = 20, coll_k = 10, th = 20, wx = 12, px = 18, pz = 0, tmin = 90; const lab = label('', { scale: 0.9 }); S.add(lab); let curLab = lab;
        const rateAt = (x, z) => { const d = Math.max(0.5, Math.hypot(x, z)); let r = P.doseRate(ci * 37, d) * 1000 / coll_k; if (th > 0 && x > wx && Math.abs(z * wx / x) < 10) r *= Math.pow(0.5, th / P.IR192.hvlSteel); return r; };
        const col = r => r > 100 ? [220, 40, 40] : r > 10 ? [255, 140, 30] : r > 7.5 ? [255, 210, 60] : r > 2.5 ? [90, 120, 140] : [38, 48, 58];
        const paint = () => { const img = cx.createImageData(N, N);
          for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) { const x = -half + (i + 0.5) * 2 * half / N, z = -half + (j + 0.5) * 2 * half / N, r = rateAt(x, z); const k = (j * N + i) * 4; const cc = col(r); img.data[k] = cc[0]; img.data[k + 1] = cc[1]; img.data[k + 2] = cc[2]; img.data[k + 3] = 255;
            const e = (lim) => { const r2 = rateAt(x + 2 * half / N, z), r3 = rateAt(x, z + 2 * half / N); return (r - lim) * (r2 - lim) < 0 || (r - lim) * (r3 - lim) < 0; };
            if (e(7.5)) { img.data[k] = 255; img.data[k + 1] = 120; img.data[k + 2] = 0; } else if (e(10)) { img.data[k] = 60; img.data[k + 1] = 140; img.data[k + 2] = 255; } }
          cx.putImageData(img, 0, 0); tex.needsUpdate = true; };
        const upd = () => { wall.position.set(wx, 2, 0); wall.visible = th > 0; wall.scale.x = Math.max(0.3, th / 20); lw.position.set(wx, 5, 10); person.position.set(px, 0, pz); paint();
          const r = rateAt(px, pz), dose = r * tmin / 60; S.remove(curLab); curLab = label(`${fmt(r, 1)} µSv/h`, { scale: 0.9, border: r <= 7.5 ? 'rgba(61,220,151,.9)' : r <= 10 ? 'rgba(255,197,49,.9)' : 'rgba(255,93,93,.9)' }); curLab.position.set(px, 6, pz); S.add(curLab);
          const rB = Math.sqrt(P.IR192.gamma * 1000 * ci * 37 / (coll_k * 7.5));
          ui.read.textContent = `Người cách nguồn ${fmt(Math.hypot(px, pz), 1)} m: ${fmt(r, 1)} µSv/h → ${r <= 7.5 ? 'ngoài hàng rào được' : r <= 10 ? 'chỉ đạt mức vị trí thợ chụp' : 'quá cao, phải lùi hoặc che'} · liều ${tmin} phút phát tia ≈ ${fmt(dose, 1)} µSv · bán kính 7,5 µSv/h không che ≈ ${fmt(rB, 1)} m`; };
        ui.slider('Hoạt độ (Ci)', 2, 100, 1, ci, v => { ci = v; upd(); }); ui.slider('Vách thép (mm)', 0, 60, 2, th, v => { th = v; upd(); }); ui.slider('Vị trí vách (m)', 4, 30, 1, wx, v => { wx = v; upd(); });
        ui.slider('Người: x (m)', -40, 40, 0.5, px, v => { px = v; upd(); }); ui.slider('Người: z (m)', -40, 40, 0.5, pz, v => { pz = v; upd(); });
        ui.button('Ống chuẩn trực ÷10 / ÷16', () => { coll_k = coll_k === 10 ? 16 : 10; toast(`Ống chuẩn trực giảm ${coll_k} lần`); upd(); });
        upd(); return t => { src.scale.setScalar(1 + 0.15 * Math.sin(t * 6)); };
      } }

  };

  /* ================= KHUNG XEM ================= */
  function webglOK() { try { const c = document.createElement('canvas'); return !!(window.WebGLRenderingContext && (c.getContext('webgl') || c.getContext('experimental-webgl'))); } catch (e) { return false; } }
  function mount(el, id, opt = {}) {
    const def = SCENES[id]; if (!def) return;
    const wrap = h('div', { class: 'card v3d' }); const stage = h('div', { class: 'v3d-stage' }); const ctl = h('div', { class: 'v3d-ctl' }); const read = h('div', { class: 'mono', style: 'font-size:.88rem;margin-top:6px' });
    const extra = h('div');
    wrap.append(h('div', { class: 'row' }, h('span', { class: 'chip hi' }, 'Mô hình 3D'), h('h3', { style: 'margin:0' }, def.title)), stage, extra, ctl, read, h('p', { class: 'dim', style: 'font-size:.88rem;margin:6px 0 0' }, def.note, ' Kéo để xoay, cuộn hoặc chụm hai ngón để phóng to.'));
    el.append(wrap);
    const H = opt.height || (window.innerWidth < 600 ? 300 : 380); stage.style.height = H + 'px';
    if (!T3() || !webglOK()) { stage.append(h('div', { class: 'callout' }, 'Trình duyệt này không bật được WebGL nên không hiển thị mô hình 3D. Các phần khác vẫn dùng bình thường.')); return wrap; }
    const wait = h('div', { class: 'v3d-wait' }, 'Đang mở mô hình 3D…'); stage.append(wait);
    // Chỉ khởi tạo WebGL khi khung cuộn vào màn hình (tiết kiệm pin và bộ nhớ trên điện thoại)
    let started = false; const io0 = new IntersectionObserver(es => { if (es[0].isIntersecting && !started) { started = true; io0.disconnect(); start(); } }, { rootMargin: '200px' }); io0.observe(stage);
    function start() {
      const THREE = T3(); wait.remove(); const dpr = window.devicePixelRatio || 1;
      const renderer = new THREE.WebGLRenderer({ antialias: dpr < 1.5, alpha: true, powerPreference: 'low-power' }); renderer.setPixelRatio(Math.min(dpr, window.innerWidth < 600 ? 1.5 : 2)); stage.append(renderer.domElement);
      const scene = new THREE.Scene(); const cam = new THREE.PerspectiveCamera(38, 1, 0.1, 500); cam.position.set(...def.cam);
      scene.add(new THREE.HemisphereLight(0xdfe8f0, 0x1a1f24, 0.9)); const dl = new THREE.DirectionalLight(0xffffff, 0.9); dl.position.set(10, 20, 12); scene.add(dl);
      const ctr = THREE.OrbitControls ? new THREE.OrbitControls(cam, renderer.domElement) : null; if (ctr) { ctr.target.set(...def.target); ctr.enableDamping = true; ctr.update(); }
      const ui = { read, extra, slider(lbl, mn, mx, st, v, on) { ctl.append(root.Game.slider(lbl, mn, mx, st, v, '', on)); }, button(lbl, on) { ctl.append(h('button', { class: 'btn sm ghost', style: 'margin:4px 6px 4px 0', onclick: on }, lbl)); } };
      let update = null; try { update = def.build(scene, ui); } catch (e) { stage.append(h('div', { class: 'callout bad' }, 'Lỗi dựng cảnh 3D: ' + e.message)); console.error(e); }
      ctl.append(h('button', { class: 'btn sm ghost', style: 'margin:4px 0', onclick: () => { cam.position.set(...def.cam); if (ctr) { ctr.target.set(...def.target); ctr.update(); } } }, 'Đặt lại góc nhìn'));
      const size = () => { const w = stage.clientWidth || 600; renderer.setSize(w, H); cam.aspect = w / H; cam.updateProjectionMatrix(); };
      const ro = new ResizeObserver(size); ro.observe(stage); size();
      let vis = true; const io = new IntersectionObserver(es => { vis = es[0].isIntersecting; }); io.observe(stage);
      const clock = new THREE.Clock(); let raf = 0;
      const dispose = () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); ctr && ctr.dispose();
        scene.traverse(o => { o.geometry && o.geometry.dispose(); const ms = o.material ? [].concat(o.material) : []; ms.forEach(m => { m.map && m.map.dispose(); m.dispose(); }); }); renderer.dispose(); };
      const loop = () => { if (!wrap.isConnected) return dispose();
        raf = requestAnimationFrame(loop); if (!vis || document.hidden) { clock.getDelta(); return; } const dt = Math.min(0.05, clock.getDelta()), t = clock.elapsedTime; try { update && update(t, dt); } catch (e) { /* giữ vòng lặp */ } ctr && ctr.update(); renderer.render(scene, cam); };
      loop();
    }
    return wrap;
  }
  // chương Học viện → cảnh 3D
  const FOR_CHAPTER = { ut2: 'probe', rs: 'rsmap', atom: 'atom', elec: 'et', mag: 'mtfield', waves: 'wavemodes', sound: 'ut', xray: 'rt', mat: 'lattice', cap: 'pt', vt: 'vt', ut: 'ut', mt: 'mt', et: 'et', mw: 'mw', rt: 'rt', pt: 'pt', ae: 'ae', ir: 'ir' };
  const FOR_METHOD = { PT: 'pt', MT: 'mt', UT: 'ut', RT: 'rt' };
  root.View3D = { mount, SCENES, FOR_CHAPTER, FOR_METHOD };
})(this);
