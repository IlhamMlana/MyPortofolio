/* ==========================================
   ILHAM MAULANA, S.M. - EXECUTIVE PORTFOLIO
   Interactive JavaScript Logic
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initMobileNav();
  initStatsCounter();
  initTimelineFilter();
  initDocFilter();
  initModals();
  initCopyButtons();
  initContactForm();
  initSmoothScroll();
  initBackToTop();
});

/* ==========================================
   2. Header & Sticky Nav
   ========================================== */
function initHeaderScroll() {
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

/* ==========================================
   3. Mobile Navigation Menu
   ========================================== */
function initMobileNav() {
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileNavClose = document.getElementById('mobileNavClose');
  const mobileNav = document.getElementById('mobileNav');
  const mobileNavOverlay = document.getElementById('mobileNavOverlay');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  function openMenu() {
    mobileNav.classList.add('open');
    mobileNavOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    mobileNav.classList.remove('open');
    mobileNavOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', openMenu);
  if (mobileNavClose) mobileNavClose.addEventListener('click', closeMenu);
  if (mobileNavOverlay) mobileNavOverlay.addEventListener('click', closeMenu);

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}

/* ==========================================
   4. Animated Stat Counters
   ========================================== */
function initStatsCounter() {
  const statsElements = document.querySelectorAll('.stat-number');
  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        statsElements.forEach(stat => {
          const target = parseFloat(stat.getAttribute('data-target'));
          const prefix = stat.getAttribute('data-prefix') || '';
          const suffix = stat.getAttribute('data-suffix') || '';
          const isDecimal = stat.getAttribute('data-decimal') === 'true';
          
          let count = 0;
          const duration = 2000; // 2 seconds
          const stepTime = 30;
          const steps = duration / stepTime;
          const increment = target / steps;

          const timer = setInterval(() => {
            count += increment;
            if (count >= target) {
              count = target;
              clearInterval(timer);
            }
            stat.textContent = prefix + (isDecimal ? count.toFixed(2) : Math.floor(count)) + suffix;
          }, stepTime);
        });
      }
    });
  }, { threshold: 0.5 });

  const statsContainer = document.querySelector('.hero-stats');
  if (statsContainer) observer.observe(statsContainer);
}

/* ==========================================
   5. Career Timeline Filter
   ========================================== */
function initTimelineFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const timelineItems = document.querySelectorAll('.timeline-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      timelineItems.forEach(item => {
        const cat = item.getAttribute('data-category');
        if (filter === 'all' || cat.includes(filter)) {
          item.style.display = 'block';
          item.style.opacity = '0';
          setTimeout(() => { item.style.opacity = '1'; }, 50);
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================
   6. Interactive WLA (Workload Analysis) Calculator
   ========================================== */
function initWlaCalculator() {
  const form = document.getElementById('wlaCalcForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    calculateWla();
  });

  const inputs = form.querySelectorAll('input, select');
  inputs.forEach(input => {
    input.addEventListener('input', calculateWla);
  });

  calculateWla(); // initial calculation
}

function calculateWla() {
  const taskVolume = parseFloat(document.getElementById('wlaVolume')?.value || 100);
  const timePerTask = parseFloat(document.getElementById('wlaTime')?.value || 1.5);
  const totalStaff = parseFloat(document.getElementById('wlaStaff')?.value || 1);
  const standardWorkingHours = parseFloat(document.getElementById('wlaWorkingHours')?.value || 1250); // EWT / Jam Kerja Efektif per tahun

  // Total Workload Hours per Year = (Volume * TimePerTask)
  const totalWorkloadHours = taskVolume * timePerTask;
  
  // FTE (Full-Time Equivalent) = Total Workload Hours / (Total Staff * Standard Working Hours)
  const fte = totalWorkloadHours / (totalStaff * standardWorkingHours);

  const fteValEl = document.getElementById('wlaFteResult');
  const fteStatusEl = document.getElementById('wlaStatusResult');
  const fteAdviceEl = document.getElementById('wlaAdviceResult');

  if (!fteValEl || !fteStatusEl || !fteAdviceEl) return;

  fteValEl.textContent = fte.toFixed(2) + ' FTE';

  if (fte < 0.90) {
    fteStatusEl.className = 'wla-status-tag wla-status-underload';
    fteStatusEl.textContent = 'Underload (Beban Kerja Kurang)';
    fteAdviceEl.textContent = 'Rekomendasi HR: Beban kerja karyawan di bawah kapasitas standar. Dapat dilakukan redistribusi tugas atau penggabungan fungsi job desk.';
  } else if (fte >= 0.90 && fte <= 1.10) {
    fteStatusEl.className = 'wla-status-tag wla-status-optimal';
    fteStatusEl.textContent = 'Optimal (Beban Kerja Ideal)';
    fteAdviceEl.textContent = 'Rekomendasi HR: Jumlah SDM dan alokasi waktu kerja sangat seimbang & efisien sesuai standar efektivitas organisasi.';
  } else if (fte > 1.10 && fte <= 1.25) {
    fteStatusEl.className = 'wla-status-tag wla-status-underload';
    fteStatusEl.textContent = 'High (Beban Kerja Tinggi)';
    fteAdviceEl.textContent = 'Rekomendasi HR: Memerlukan pengawasan overtime. Pertimbangkan optimalisasi prosedur kerja atau efisiensi sistem.';
  } else {
    fteStatusEl.className = 'wla-status-tag wla-status-overload';
    fteStatusEl.textContent = 'Overload (Beban Kerja Sangat Tinggi)';
    fteAdviceEl.textContent = 'Rekomendasi HR: Beban kerja melebihi kapasitas normal. Sangat direkomendasikan penambahan jumlah SDM (Manpower Planning) atau pembagian tugas.';
  }
}

/* ==========================================
   7. Interactive Skill Gap Analyzer
   ========================================== */
function initSkillGapAnalyzer() {
  const form = document.getElementById('skillGapForm');
  if (!form) return;

  const targetSelect = document.getElementById('gapTargetSkill');
  const currentLevelInput = document.getElementById('gapCurrentLevel');
  const currentValSpan = document.getElementById('gapCurrentLevelVal');

  if (currentLevelInput && currentValSpan) {
    currentLevelInput.addEventListener('input', () => {
      currentValSpan.textContent = currentLevelInput.value + ' / 5';
      updateGapAnalysis();
    });
  }

  if (targetSelect) {
    targetSelect.addEventListener('change', updateGapAnalysis);
  }

  updateGapAnalysis();
}

function updateGapAnalysis() {
  const currentLevel = parseInt(document.getElementById('gapCurrentLevel')?.value || 3);
  const requiredLevel = 4.5; // Benchmark standard level for Ilham's standards

  const gapScore = requiredLevel - currentLevel;
  const resultBox = document.getElementById('skillGapResult');
  if (!resultBox) return;

  if (gapScore <= 0) {
    resultBox.innerHTML = `
      <div style="color: #059669; font-weight:700; font-size:1.1rem; margin-bottom:0.3rem;"><i class="fas fa-check-circle"></i> Kompetensi Memenuhi Standar Industri</div>
      <p style="font-size:0.85rem; color:var(--text-muted);">Karyawan memiliki kecakapan tingkat lanjut. Siap untuk program rotasi atau kepemimpinan proyek.</p>
    `;
  } else if (gapScore <= 1.5) {
    resultBox.innerHTML = `
      <div style="color: #d97706; font-weight:700; font-size:1.1rem; margin-bottom:0.3rem;"><i class="fas fa-exclamation-triangle"></i> Skill Gap Ringan (${gapScore.toFixed(1)} Poin)</div>
      <p style="font-size:0.85rem; color:var(--text-muted);">Rekomendasi TNA: Diperlukan On-the-Job Training (OJT) & program mentoring singkat untuk penyempurnaan.</p>
    `;
  } else {
    resultBox.innerHTML = `
      <div style="color: #dc2626; font-weight:700; font-size:1.1rem; margin-bottom:0.3rem;"><i class="fas fa-times-circle"></i> Skill Gap Signifikan (${gapScore.toFixed(1)} Poin)</div>
      <p style="font-size:0.85rem; color:var(--text-muted);">Rekomendasi TNA: Diperlukan Modul Pelatihan Komprehensif Eksternal/Internal serta evaluasi berkala 3 bulan.</p>
    `;
  }
}

/* ==========================================
   8. Modals System (Project Case Studies & Certs)
   ========================================== */
function initModals() {
  const modalOverlay = document.getElementById('modalOverlay');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');
  const modalCloseBtn = document.getElementById('modalCloseBtn');

  if (!modalOverlay) return;

  function closeModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
    const vid = modalBody.querySelector('video');
    if (vid) {
      vid.pause();
    }
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  // Attach triggers for project detail buttons
  document.querySelectorAll('.open-project-modal').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const projectId = btn.getAttribute('data-project');
      showProjectModal(projectId);
    });
  });

  // Attach trigger for certificate modal
  document.querySelectorAll('.open-cert-modal').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      showCertModal();
    });
  });

  // Attach triggers for documentation modals
  document.querySelectorAll('.open-doc-modal').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const docId = btn.getAttribute('data-doc');
      if (docId) {
        showDocModal(docId);
      }
    });
  });
}

function showProjectModal(id) {
  const modalOverlay = document.getElementById('modalOverlay');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');

  const projectData = {
    'wla': {
      title: 'Workload Analysis (WLA) & Manpower Planning - Laznas Sahabat Yatim',
      content: `
        <div style="display:flex; flex-direction:column; gap:1.25rem;">
          <img src="project/project-wla.jpg" alt="WLA Project" style="width:100%; border-radius:12px; max-height:280px; object-fit:cover;">
          <div>
            <h4 style="font-size:1.1rem; color:var(--text-main); margin-bottom:0.5rem;">Ringkasan Proyek</h4>
            <p style="font-size:0.925rem; color:var(--text-muted); line-height:1.7;">
              Proyek analisis beban kerja menyeluruh di seluruh unit operasional Laznas Sahabat Yatim Indonesia. Bertujuan untuk mengukur jam kerja efektif (Effective Working Time), menetapkan rasio Full-Time Equivalent (FTE), dan menghasilkan rekomendasi jumlah manpower planning yang presisi.
            </p>
          </div>
          <div style="background:var(--bg-subtle); padding:1rem; border-radius:10px; border-left:4px solid var(--secondary);">
            <h5 style="font-weight:700; color:var(--text-main); margin-bottom:0.3rem;">Hasil & Dampak Utama:</h5>
            <ul style="padding-left:1.2rem; font-size:0.9rem; color:var(--text-muted); display:flex; flex-direction:column; gap:0.3rem;">
              <li>Menyelesaikan evaluasi FTE untuk seluruh lini karyawan perusahaan.</li>
              <li>Berhasil mengidentifikasi divisi yang membutuhkan redistribusi beban kerja.</li>
              <li>Mengurangi rasio ketergantungan lembur berlebihan melalui optimalisasi job description.</li>
            </ul>
          </div>
          <div style="display:flex; justify-content:flex-end; gap:0.75rem; margin-top:0.5rem;">
            <a href="project/wla-analysis.html" class="btn btn-primary btn-sm"><i class="fas fa-external-link-alt"></i> Buka Halaman Dokumentasi Lengkap</a>
          </div>
        </div>
      `
    },
    'tna': {
      title: 'Matriks Kompetensi & Training Needs Analysis (TNA)',
      content: `
        <div style="display:flex; flex-direction:column; gap:1.25rem;">
          <img src="project/project-tna.jpg" alt="TNA Project" style="width:100%; border-radius:12px; max-height:280px; object-fit:cover;">
          <div>
            <h4 style="font-size:1.1rem; color:var(--text-main); margin-bottom:0.5rem;">Ringkasan Proyek</h4>
            <p style="font-size:0.925rem; color:var(--text-muted); line-height:1.7;">
              Perancangan sistem competency matrix interaktif untuk mengevaluasi skill gap karyawan di berbagai tingkat jabatan. Mengintegrasikan metode TNA komprehensif untuk menyusun modul pelatihan yang tepat sasaran dan efisien.
            </p>
          </div>
          <div style="background:var(--bg-subtle); padding:1rem; border-radius:10px; border-left:4px solid var(--secondary);">
            <h5 style="font-weight:700; color:var(--text-main); margin-bottom:0.3rem;">Hasil & Dampak Utama:</h5>
            <ul style="padding-left:1.2rem; font-size:0.9rem; color:var(--text-muted); display:flex; flex-direction:column; gap:0.3rem;">
              <li>Terbentuknya katalog kompetensi teknis & soft skills terstandarisasi.</li>
              <li>Meningkatkan efisiensi alokasi anggaran pelatihan perusahaan.</li>
            </ul>
          </div>
          <div style="display:flex; justify-content:flex-end; gap:0.75rem; margin-top:0.5rem;">
            <a href="project/tna-matrix.html" class="btn btn-primary btn-sm"><i class="fas fa-external-link-alt"></i> Buka Halaman Dokumentasi Lengkap</a>
          </div>
        </div>
      `
    },
    'job-eval': {
      title: 'Job Evaluation & System Architecture Salary Grade',
      content: `
        <div style="display:flex; flex-direction:column; gap:1.25rem;">
          <img src="project/project-job-eval.jpg" alt="Job Evaluation Project" style="width:100%; border-radius:12px; max-height:280px; object-fit:cover;">
          <div>
            <h4 style="font-size:1.1rem; color:var(--text-main); margin-bottom:0.5rem;">Ringkasan Proyek</h4>
            <p style="font-size:0.925rem; color:var(--text-muted); line-height:1.7;">
              Pengembangan sistem penilaian bobot jabatan (Job Evaluation) berbasis Point-Factor System untuk menentukan kesetaraan internal (Internal Equity) dan grading struktur jabatan perusahaan.
            </p>
          </div>
          <div style="display:flex; justify-content:flex-end; gap:0.75rem; margin-top:0.5rem;">
            <a href="project/job-evaluation.html" class="btn btn-primary btn-sm"><i class="fas fa-external-link-alt"></i> Buka Halaman Dokumentasi Lengkap</a>
          </div>
        </div>
      `
    }
  };

  const project = projectData[id] || {
    title: 'Detail Proyek Management',
    content: '<p>Dokumentasi proyek sedang dimuat...</p>'
  };

  modalTitle.textContent = project.title;
  modalBody.innerHTML = project.content;
  modalOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function showCertModal() {
  const modalOverlay = document.getElementById('modalOverlay');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');

  modalTitle.textContent = 'Sertifikasi BNSP SDM (6 Bidang Competency)';
  modalBody.innerHTML = `
    <div style="display:flex; flex-direction:column; gap:1.25rem;">
      <div style="background:#0f172a; border-radius:12px; overflow:hidden; display:flex; justify-content:center; align-items:center;">
        <img src="sertifikat/sertifikat%20bnsp.jpeg" alt="Sertifikat BNSP SDM Ilham Maulana" style="width:100%; max-height:480px; object-fit:contain; display:block;">
      </div>
      <div>
        <h4 style="font-size:1.15rem; color:var(--text-main); font-weight:700;">Badan Nasional Sertifikasi Profesi (BNSP)</h4>
        <p style="font-size:0.9rem; color:var(--accent-gold); font-weight:700;">Sertifikat Kompetensi Kerja SDM | Diterbitkan: 26 Juli 2025</p>
        <p style="font-size:0.9rem; color:var(--text-muted); margin-top:0.5rem;">
          Telah dinyatakan KOMPETEN dalam 6 Unit SKKNI SDM Nasional meliputi Perencanaan SDM, Rekrutmen & Seleksi, Pelatihan & Pengembangan, Manajemen Kinerja, Hubungan Industrial, dan Job Evaluation.
        </p>
      </div>
      <div style="display:flex; justify-content:flex-end; gap:0.75rem;">
        <a href="sertifikat/bnsp-sdm.html" class="btn btn-gold btn-sm"><i class="fas fa-award"></i> Lihat Rincian SKKNI Lengkap</a>
      </div>
    </div>
  `;
  modalOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

/* ==========================================
   8B. Documentation Filter Logic
   ========================================== */
function initDocFilter() {
  const filterBtns = document.querySelectorAll('.doc-filter-btn');
  const docCards = document.querySelectorAll('.doc-card');

  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      docCards.forEach(card => {
        const cat = card.getAttribute('data-category') || '';
        if (filter === 'all' || cat.includes(filter)) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          setTimeout(() => { card.style.opacity = '1'; }, 30);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================
   8C. Documentation Modal Showcase
   ========================================== */
const docData = {
  'service-poster': {
    title: 'Poster Pengumuman Pelatihan "Service Excellence"',
    category: 'In-House Training & Development',
    categoryIcon: 'fas fa-chalkboard-teacher',
    role: 'Narasumber Utama / Pemateri',
    date: 'Sabtu, 15 Agustus 2026',
    platform: 'Program Pelatihan SDM Internal / Google Meet',
    mediaType: 'image',
    mediaSrc: 'dokumentasi/1.jpeg',
    summary: 'Publikasi resmi modul pelatihan internal kelembagaan bertajuk "Service Excellence: Melayani dengan Hati, Meningkatkan Kepuasan, Membangun Kepercayaan". Dirancang untuk menstandardisasi mutu layanan garda depan (frontliners) dan staf hubungan donatur di seluruh cabang.',
    highlights: [
      'Menanamkan mindset pelayanan prima (Service Culture) berbasis ketulusan dan profesionalitas.',
      'Membedah teknik komunikasi empatik dan penanganan keluhan donatur secara cepat dan solutif.',
      'Menyelaraskan nilai-nilai integritas kelembagaan dengan kepuasan dan loyalitas para donatur/muzakki.'
    ]
  },
  'service-meet': {
    title: 'Pelaksanaan Pelatihan Service Excellence via Google Meet',
    category: 'Online Training Webinar',
    categoryIcon: 'fas fa-laptop-code',
    role: 'Trainer & Fasilitator Pelatihan',
    date: '15 Agustus 2026',
    platform: 'Virtual Meeting (30+ Peserta Aktif Lintas Cabang)',
    mediaType: 'image',
    mediaSrc: 'dokumentasi/5.jpeg',
    summary: 'Dokumentasi tangkapan layar saat Ilham Maulana mempresentasikan modul materi "Pelayanan Prima - Service Excellence: Membangun budaya layanan yang menciptakan kepuasan, kepercayaan, dan loyalitas donatur". Sesi ini berlangsung interaktif dan diikuti oleh kepala asrama, staf layanan donatur, dan personel cabang se-Indonesia.',
    highlights: [
      'Diikuti secara antusias oleh 30+ personel dari berbagai kantor cabang, asrama, dan perwakilan daerah.',
      'Pemaparan komprehensif mengenai framework Service Excellence, respon cepat, dan etika komunikasi.',
      'Sesi studi kasus penanganan situasi kritis donatur serta sesi tanya jawab dua arah yang aplikatif.'
    ]
  },
  'training-offline': {
    title: 'Sesi Presentasi & Training In-House Tatap Muka',
    category: 'In-House Training SDM',
    categoryIcon: 'fas fa-chalkboard',
    role: 'Corporate Trainer & Presenter',
    date: '2025 - 2026',
    platform: 'Ruang Pertemuan / Training Center Sahabat Yatim',
    mediaType: 'image',
    mediaSrc: 'dokumentasi/2.jpeg',
    summary: 'Sesi pembekalan tatap muka di training room di mana Ilham Maulana membawakan materi pelatihan teknis operasional dan standardisasi alur kerja di depan layar proyektor. Menggunakan pendekatan andragogi (pembelajaran orang dewasa) yang interaktif dan memicu partisipasi aktif audiens.',
    highlights: [
      'Penyampaian materi berbasis TNA (Training Needs Analysis) yang telah dipetakan sebelumnya.',
      'Kombinasi metode pemaparan visual, simulasi peran (role play), dan evaluasi pemahaman langsung.',
      'Memastikan keselarasan pemahaman tim terhadap SOP dan target capaian kinerja lembaga.'
    ]
  },
  'powerful-fundraiser': {
    title: 'Workshop & Capacity Building: Powerful Fundraiser',
    category: 'Fundraising Bootcamp & Team Coaching',
    categoryIcon: 'fas fa-user-friends',
    role: 'Koordinator Pembinaan & Instruktur',
    date: '2025 - 2026',
    platform: 'Training Hall Laznas Sahabat Yatim',
    mediaType: 'image',
    mediaSrc: 'dokumentasi/3.jpeg',
    summary: 'Foto bersama seluruh peserta workshop dan bootcamp intensif "Powerful Fundraiser" setelah sukses menyelesaikan rangkaian pelatihan penggalangan dana. Program ini bertujuan mengasah keterampilan interpersonal, negosiasi, dan ketangguhan mental tim fundraiser di lapangan.',
    highlights: [
      'Membina lebih dari 20 amil dan fundraiser dalam strategi penetrasi donatur korporat maupun ritel.',
      'Pelatihan teknik pitching persuasif, objection handling, serta follow-up prospek secara terstruktur.',
      'Membangun kekompakan tim, motivasi tinggi, dan budaya kerja berorientasi target capaian penghimpunan dana ZISWAF.'
    ]
  },
  'belanja-yatim-1': {
    title: 'Master of Ceremony (MC) Akbar - Belanja Yatim Ramadhan 1447 H',
    category: 'Public Speaking & Event Hosting',
    categoryIcon: 'fas fa-microphone',
    role: 'Master of Ceremony (MC) & Event Host',
    date: 'Ramadhan 1447 H',
    platform: 'Panggung Utama Atrium Harmoni Mall',
    mediaType: 'image',
    mediaSrc: 'dokumentasi/6.jpeg',
    summary: 'Ilham Maulana memandu acara puncak seremonial "Belanja Yatim Ramadhan 1447 H: Perjalanan Kebaikan, Menyapa Yatim & Dhuafa!" di panggung atrium mall. Bertanggung jawab memimpin alur susunan acara formal maupun non-formal yang melibatkan ratusan anak yatim, donatur pendamping, tamu kehormatan, dan jajaran direksi.',
    highlights: [
      'Memandu seluruh susunan acara mulai dari seremonial pembukaan, penyerahan simbolis santunan, hingga pelepasan rombongan belanja.',
      'Mengatur koordinasi panggung berskala besar dengan interaksi langsung kepada audiens publik.',
      'Menampilkan pembawaan panggung yang berkarisma, energik, dan santun, mencerminkan citra profesional lembaga.'
    ]
  },
  'belanja-yatim-2': {
    title: 'Aksi Panggung Dinamis & Audiens Engagement',
    category: 'Public Speaking & Live Entertainment',
    categoryIcon: 'fas fa-theater-masks',
    role: 'Stage Host & Dynamic Energizer',
    date: 'Ramadhan 1447 H',
    platform: 'Panggung Event Belanja Yatim',
    mediaType: 'image',
    mediaSrc: 'dokumentasi/7.jpeg',
    summary: 'Momen interaksi panggung dinamis saat Ilham Maulana memfasilitasi kuis, apresiasi donatur, dan ice breaking yang menceriakan ratusan anak-anak yatim binaan. Membuktikan fleksibilitas komunikasi dan kemampuan crowd control dalam memelihara energi positif sepanjang acara.',
    highlights: [
      'Kecakapan ice breaking dan interaksi ramah anak untuk menghidupkan suasana panggung di area publik.',
      'Mampu mencairkan ketegangan dan menjaga fokus audiens di tengah keramaian pusat perbelanjaan.',
      'Menyampaikan pesan-pesan nilai kemanusiaan dan kepedulian sosial secara menyentuh dan bermakna.'
    ]
  },
  'gerai-zakat': {
    title: 'Direct Fundraising & Edukasi Muzakki di Gerai Zakat',
    category: 'Direct Fundraising & Donor Relations',
    categoryIcon: 'fas fa-hand-holding-usd',
    role: 'Fundraising Specialist & Konsultan ZISWAF',
    date: 'Ramadhan Event Campaign',
    platform: 'Stand Gerai Zakat Laznas Sahabat Yatim',
    mediaType: 'image',
    mediaSrc: 'dokumentasi/4.jpeg',
    summary: 'Dokumentasi interaksi tatap muka langsung Ilham Maulana melayani muzakki dan donatur di gerai zakat. Mengaplikasikan langsung prinsip Service Excellence dalam memberikan konsultasi perhitungan zakat maal, infaq, serta mendampingi kemudahan transaksi digital melalui QRIS.',
    highlights: [
      'Penerapan nyata standar pelayanan prima (Service Excellence) dalam interaksi tatap muka dengan donatur.',
      'Edukasi literasi zakat dan infaq serta pembagian souvenir/laporan transparansi penyaluran donasi.',
      'Pemanfaatan teknologi pembayaran digital QRIS untuk kemudahan dan kenyamanan donatur berdonasi.'
    ]
  },
  'csr-bulog': {
    title: 'Presentasi Profil Kelembagaan & Sinergi Kemitraan CSR - Perum BULOG',
    category: 'Corporate CSR & Strategic Partnership',
    categoryIcon: 'fas fa-handshake',
    role: 'Corporate Presenter & Partnership Specialist',
    date: 'Kemitraan Strategis BUMN',
    platform: 'Pertemuan Resmi Manajemen Perum BULOG & Sahabat Yatim',
    mediaType: 'image',
    mediaSrc: 'dokumentasi/8.jpeg',
    summary: 'Dokumentasi saat Ilham Maulana mempresentasikan profil kelembagaan (Company Profile) serta rencana program strategis di hadapan jajaran pimpinan dan manajemen Perusahaan Umum (Perum) BULOG. Presentasi ini berhasil menyelaraskan pilar tanggung jawab sosial lingkungan (TJSL/CSR) BUMN dengan program pemberdayaan kelembagaan, serta berkontribusi langsung dalam kesepakatan closing pendanaan program kemitraan sosial.',
    highlights: [
      'Penyampaian Company Profile kelembagaan secara profesional, sistematis, dan berbasis data akuntabilitas sosial.',
      'Kemampuan komunikasi persuasif dalam menyelaraskan kebutuhan program sosial dengan target indikator CSR Perum BULOG.',
      'Berkontribusi aktif dalam pencapaian kesepakatan kemitraan strategis dan realisasi alokasi dana CSR korporat.'
    ]
  },
  'video-kegiatan': {
    title: 'Video Live Suasana Kegiatan & Public Speaking',
    category: 'Live Video Dokumentasi',
    categoryIcon: 'fas fa-video',
    role: 'Master of Ceremony & Live Speaker',
    date: 'Dokumentasi Rekaman Langsung',
    platform: 'Dokumentasi Panggung Lapangan (Format MP4 HD)',
    mediaType: 'video',
    mediaSrc: 'dokumentasi/9.mp4',
    summary: 'Rekaman video langsung yang memperlihatkan performa panggung dan dinamika pembawaan acara oleh Ilham Maulana, S.M. secara langsung. Menjadi bukti otentik kemampuan olah vokal, artikulasi, ketepatan intonasi, ekspresi, dan penguasaan panggung yang meyakinkan.',
    highlights: [
      'Menampilkan artikulasi suara yang tegas, intonasi bersahabat, dan body language yang percaya diri.',
      'Kesiapan memandu acara publik skala besar dengan spontanitas dan ketenangan tinggi.',
      'Bukti audio-visual nyata atas kompetensi Public Speaking, Event Management, dan Interpersonal Communication.'
    ]
  }
};

function showDocModal(id) {
  const modalOverlay = document.getElementById('modalOverlay');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');

  const item = docData[id];
  if (!item) return;

  modalTitle.textContent = item.title;

  let mediaHtml = '';
  if (item.mediaType === 'video') {
    mediaHtml = `
      <div style="background:#000; border-radius:12px; overflow:hidden; margin-bottom:1.25rem;">
        <video controls autoplay playsinline style="width:100%; max-height:480px; display:block;">
          <source src="${item.mediaSrc}" type="video/mp4">
          Browser Anda tidak mendukung pemutar video HTML5.
        </video>
      </div>
    `;
  } else {
    mediaHtml = `
      <div style="background:#0f172a; border-radius:12px; overflow:hidden; margin-bottom:1.25rem; display:flex; justify-content:center; align-items:center;">
        <img src="${item.mediaSrc}" alt="${item.title}" style="width:100%; max-height:480px; object-fit:contain; display:block;">
      </div>
    `;
  }

  const highlightsHtml = item.highlights.map(h => `<li style="margin-bottom:0.4rem;">${h}</li>`).join('');

  modalBody.innerHTML = `
    <div>
      ${mediaHtml}

      <div style="display:flex; flex-wrap:wrap; gap:0.5rem; margin-bottom:1rem; align-items:center;">
        <span style="display:inline-flex; align-items:center; gap:0.4rem; padding:0.3rem 0.8rem; background:rgba(13,148,136,0.12); color:var(--secondary); border-radius:9999px; font-size:0.8rem; font-weight:700;">
          <i class="${item.categoryIcon}"></i> ${item.category}
        </span>
        <span style="display:inline-flex; align-items:center; gap:0.4rem; padding:0.3rem 0.8rem; background:rgba(2,132,199,0.1); color:var(--primary-accent); border-radius:9999px; font-size:0.8rem; font-weight:700;">
          <i class="fas fa-user-tag"></i> ${item.role}
        </span>
        <span style="display:inline-flex; align-items:center; gap:0.4rem; padding:0.3rem 0.8rem; background:var(--bg-subtle); color:var(--text-muted); border-radius:9999px; font-size:0.8rem; font-weight:600;">
          <i class="far fa-calendar-alt"></i> ${item.date}
        </span>
        <span style="display:inline-flex; align-items:center; gap:0.4rem; padding:0.3rem 0.8rem; background:var(--bg-subtle); color:var(--text-muted); border-radius:9999px; font-size:0.8rem; font-weight:600;">
          <i class="fas fa-map-marker-alt"></i> ${item.platform}
        </span>
      </div>

      <h4 style="font-size:1.15rem; font-weight:700; color:var(--text-main); margin-bottom:0.6rem;">Deskripsi & Konteks Kegiatan</h4>
      <p style="font-size:0.925rem; color:var(--text-muted); line-height:1.7; margin-bottom:1.25rem;">
        ${item.summary}
      </p>

      <div style="background:var(--bg-subtle); padding:1.15rem; border-radius:10px; border-left:4px solid var(--secondary); margin-bottom:1.5rem;">
        <h5 style="font-weight:700; color:var(--text-main); margin-bottom:0.5rem; font-size:0.95rem;">
          <i class="fas fa-check-circle" style="color:var(--secondary);"></i> Poin Utama & Dampak Kompetensi:
        </h5>
        <ul style="padding-left:1.2rem; font-size:0.9rem; color:var(--text-muted); line-height:1.6;">
          ${highlightsHtml}
        </ul>
      </div>

      <div style="display:flex; justify-content:flex-end; gap:0.75rem;">
        <a href="${item.mediaSrc}" target="_blank" class="btn btn-outline btn-sm">
          <i class="fas fa-external-link-alt"></i> Buka File Asli
        </a>
        <button class="btn btn-primary btn-sm modal-dismiss-btn">
          <i class="fas fa-times"></i> Tutup
        </button>
      </div>
    </div>
  `;

  modalOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';

  const dismissBtn = modalBody.querySelector('.modal-dismiss-btn');
  if (dismissBtn) {
    dismissBtn.addEventListener('click', () => {
      modalOverlay.classList.remove('active');
      document.body.style.overflow = '';
      const vid = modalBody.querySelector('video');
      if (vid) vid.pause();
    });
  }
}

/* ==========================================
   9. Copy Buttons & Toast Notifications
   ========================================== */
function initCopyButtons() {
  const copyBtns = document.querySelectorAll('.copy-btn');
  copyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-copy');
      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast(`Berhasil menyalin: ${textToCopy}`);
        });
      }
    });
  });
}

function showToast(msg) {
  let toast = document.getElementById('toastNotification');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toastNotification';
    toast.style.cssText = `
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      background: var(--primary);
      color: #ffffff;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      font-size: 0.9rem;
      font-weight: 600;
      z-index: 3000;
      box-shadow: var(--shadow-lg);
      transition: all 0.3s ease;
      opacity: 0;
      transform: translateY(20px);
    `;
    document.body.appendChild(toast);
  }

  toast.textContent = msg;
  toast.style.opacity = '1';
  toast.style.transform = 'translateY(0)';

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
  }, 3000);
}

/* ==========================================
   10. Contact Form Handler
   ========================================== */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('cName')?.value.trim() || '';
    const email = document.getElementById('cEmail')?.value.trim() || '';
    const subject = document.getElementById('cSubject')?.value.trim() || 'Pesan dari Portofolio';
    const message = document.getElementById('cMessage')?.value.trim() || '';

    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;

    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengirim ke Email Ilham...';

    // Construct Mailto Link for native mail app / client launch
    const mailtoSubject = encodeURIComponent(`[Portofolio HR] ${subject}`);
    const mailtoBody = encodeURIComponent(
      `Halo Ilham Maulana, S.M.,\n\nSaya ingin menghubungi Anda melalui Portofolio Website:\n\n` +
      `• Nama Lengkap: ${name}\n` +
      `• Email Pengirim: ${email}\n` +
      `• Subjek / Perihal: ${subject}\n\n` +
      `Pesan:\n${message}\n\n` +
      `Terima kasih,\n${name}`
    );

    const mailtoUrl = `mailto:mlnilham41@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`;

    // 1. Direct Email Dispatch via FormSubmit AJAX API
    fetch('https://formsubmit.co/ajax/mlnilham41@gmail.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        _subject: `[Portofolio HR] ${subject}`,
        Nama: name,
        Email: email,
        Subjek: subject,
        Pesan: message
      })
    }).catch(err => console.log('Formsubmit dispatch status:', err));

    // 2. Open default mail client / mailto link
    setTimeout(() => {
      window.location.href = mailtoUrl;
    }, 400);

    setTimeout(() => {
      btn.disabled = false;
      btn.innerHTML = '<i class="fas fa-check-circle"></i> Pesan Terkirim ke Email!';
      btn.style.background = '#059669';
      showToast('Pesan berhasil dialihkan & terkirim ke email Ilham (mlnilham41@gmail.com)!');
      form.reset();

      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.background = '';
      }, 4000);
    }, 1200);
  });
}

/* ==========================================
   11. Smooth Scroll Helper
   ========================================== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/* ==========================================
   12. Floating Back To Top Button Handler
   ========================================== */
function initBackToTop() {
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}
