export const PORTFOLIO_DATA = {
  identity: {
    nama: "Agil Faqih Ijsam",
    // Narrative Bio
    bio: "Halo, saya Agil. Seorang siswa SMK Telkom Makassar jurusan Rekayasa Perangkat Lunak yang memiliki ketertarikan mendalam pada teknologi dan seni. Saya percaya bahwa kode dan nada adalah bahasa universal yang bisa menciptakan sesuatu yang luar biasa. Fokus pengembangan saya saat ini meliputi Game Development, Web Engineering, dan Mobile Apps. Selain koding, saya aktif memproduksi musik elektronik sebagai bentuk ekspresi kreatif saya.",
    email: "faqihatun26@gmail.com",
    location: "Bandung, Indonesia",
    social: {
      github: "https://github.com/StickGo",
      linkedin: "https://www.linkedin.com/in/agil-faqih-ijsam-4866613a1",
      instagram: "https://instagram.com/ijsamagilfaqih"
    }
  },
  // Replaced Competencies with Journey
  journey: [
    {
      date: "Jan 2024 - Sekarang",
      role: "PKL / Intern",
      company: "Ashari Tech",
      description: "Bergabung sebagai peserta Praktik Kerja Lapangan (PKL) di Bandung. Terlibat dalam pengembangan aplikasi web dan mobile menggunakan teknologi modern, serta belajar best practice dalam software engineering di lingkungan profesional."
    },
    {
      date: "2023 - 2024",
      role: "Game Developer Student",
      company: "Ecopreneur Project",
      description: "Mengembangkan game edukasi 'Ecopreneur' yang berfokus pada wirausaha lingkungan. Berhasil menjadi Finalis Nasional Lomba Fiksi Game Development 2025. Mempelajari Unity Game Engine, C#, dan Game Design Document."
    },
    {
      date: "2023",
      role: "Music Producer",
      company: "Independent",
      description: "Merilis EP 'Neon Horizon' secara independen. Mengeksplorasi sound design, mixing, dan mastering menggunakan FL Studio. Juara I BigBang Talent Show."
    }
  ],
  projects: [
    {
      slug: "cyber-ninja",
      category: "Game Development",
      title: "Cyber Ninja: Neon City",
      description: "Action-platformer 2D dengan gaya pixel art futuristik. Pemain mengendalikan ninja cyber di kota neon yang penuh rintangan.",
      stack: ["Unity", "C#", "Pixel Art"],
      image: "/images/cyber_ninja.png",
      features: ["Wall-run & Double Jump mechanics", "Boss Battles with AI patterns", "Dynamic lighting system"],
      challenges: "Mengoptimalkan performa game pada perangkat mobile low-end dan menyeimbangkan difficulty curve."
    },
    {
      slug: "school-management",
      category: "Web Development",
      title: "School Management System",
      description: "Sistem informasi sekolah komprehensif untuk manajemen siswa, guru, dan nilai. Dilengkapi fitur absensi real-time.",
      stack: ["Next.js", "TypeScript", "PostgreSQL"],
      image: "/images/school_dashboard.png",
      features: ["Role-based Access Control (RBAC)", "Real-time Attendance Tracking", "Automated Report Generation"],
      challenges: "Merancang database schema yang efisien untuk menangani ribuan data siswa dan nilai secara real-time."
    },
    {
      slug: "health-tracker",
      category: "App Development",
      title: "HealthTracker Pro",
      description: "Aplikasi mobile cross-platform untuk memantau kesehatan harian, kalori, dan aktivitas fisik pengguna.",
      stack: ["Flutter", "Dart", "Firebase"],
      image: "/images/health_tracker.png",
      features: ["Step Counter Integration", "Calorie Scanner using AI", "Social Challenge Mode"],
      challenges: "Sinkronisasi data background service agar tetap akurat tanpa menguras baterai pengguna."
    },
    {
      slug: "midnight-jazz",
      category: "Music Production",
      title: "Midnight Jazz Sessions",
      description: "Album Jazz Noir yang menggabungkan elemen saxophone akustik dengan ambient rain sounds. Cocok untuk suasana santai malam hari.",
      stack: ["Live Recording", "Saxophone", "Piano"],
      image: "/images/midnight_jazz.jpg", // Using user uploaded midnight jazz image
      features: ["Live Studio Recording", "Improvisational Solos", "Warm Analog Composition"],
      challenges: "Menangkap dinamika emosional dari permainan saxophone live dan mixing dengan suara ambient."
    },
    {
      slug: "cosmic-racer",
      category: "Game Development",
      title: "Cosmic Racer 3000",
      description: "Game balap luar angkasa high-speed dengan visual low-poly. Pemain berlomba di lintasan antar planet.",
      stack: ["Unity", "C#", "Blender"],
      image: "/images/cosmic_racer.png",
      features: ["Endless Runner Mode", "Global Leaderboard", "Unlockable Spacecrafts"],
      challenges: "Implementasi procedural generation untuk lintasan agar tidak repetitif."
    },
    {
      slug: "ecommerce-dash",
      category: "Web Development",
      title: "ShopMaster Dashboard",
      description: "Admin panel modern untuk manajemen toko online. Dilengkapi analitik penjualan real-time.",
      stack: ["React", "Tailwind CSS", "Chart.js"],
      image: "/images/ecommerce_dashboard.png",
      features: ["Dark/Light Mode Toggle", "CSV Export for Reports", "Inventory Management System"],
      challenges: "Membuat visualisasi data yang kompleks tetap responsif di layar mobile."
    },
    {
      slug: "meditate-now",
      category: "App Development",
      title: "ZenFlow: Meditate Now",
      description: "Aplikasi meditasi minimalis untuk membantu pengguna mengurangi stres dengan panduan audio.",
      stack: ["Flutter", "Dart", "Audio Player"],
      image: "/images/health_tracker.png",
      features: ["Offline Mode", "Sleep Timer", "Daily Mood Tracker"],
      challenges: "Mengelola state management audio player agar tetap berjalan lancar di background."
    },
    {
      slug: "smooth-jazz-cafe",
      category: "Single Release",
      title: "Smooth Jazz Cafe",
      description: "Single upbeat dengan nuansa coffee shop. Bass line yang groovy dipadukan dengan rhodes piano.",
      stack: ["Logic Pro X", "MIDI Controller"],
      image: "/images/cafe_jazz.jpg", // Using user uploaded cafe image
      features: ["Radio Ready Mix", "Catchy Melody", "Coffee Shop Vibe"],
      challenges: "Membuat groove yang repetitif tapi tidak membosankan."
    }
  ],
  services: [
    {
      title: "Web Development",
      description: "Membangun website modern yang responsif, cepat, dan SEO-friendly menggunakan teknologi terbaru seperti Next.js dan Tailwind CSS.",
      icon: "Code"
    },
    {
      title: "Game Design",
      description: "Menciptakan pengalaman bermain yang imersif dengan mekanisme unik dan visual pixel-art yang menawan.",
      icon: "Gamepad2"
    },
    {
      title: "Sound Production",
      description: "Memproduksi musik latar (BGM) dan efek suara (SFX) kustom untuk game, video, dan media interaktif lainnya.",
      icon: "Music"
    }
  ],
  testimonials: [
    {
      name: "Rina S.",
      role: "Project Manager, Ashari Tech",
      quote: "Agil adalah pembelajar yang sangat cepat. Dedikasinya dalam menyelesaikan tugas backend sangat membantu tim kami mengejar deadline."
    },
    {
      name: "Indra W.",
      role: "Juri Fiksi Game Dev 2025",
      quote: "Konsep game 'Ecopreneur' yang dibawakan Agil sangat fresh. Dia mengerti cara menggabungkan edukasi dan fun dengan seimbang."
    },
    {
      name: "Budi Santoso",
      role: "Ketua Panitia Senratasik",
      quote: "Aransemen musik yang dibuat Agil untuk acara kami benar-benar membangun suasana. Sangat berbakat di usia muda."
    }
  ],
  // Keep creativity for reference if needed, though mostly subsumed by Journey/Projects
  creativity: [
    {
      title: "Musik",
      description: "Kontribusi pada Musik Senratasik Mahasiswa UNM 2024, Juara I BigBang Talent Show bersama Band SMK Telkom.",
      achievement: "Sertifikat Pemusik No. 002/MUSPEN/FSD-UNM/VI/2024"
    },
    {
      title: "Game Development (Real)",
      description: "Finalis Lomba Fiksi Game Development 2025 dengan karya 'Ecopreneur' (Game kewirausahaan berbasis lingkungan).",
      achievement: "Finalis Nasional (Undangan Final Jakarta 26-31 Okt 2025)"
    }
  ]
};
