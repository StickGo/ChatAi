import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-black flex items-center justify-center px-6 py-12">
      <main className="w-full max-w-5xl">
        <div className="bg-white border border-gray-300 rounded-2xl p-10 md:p-14 shadow-xl hover:shadow-2xl transition-shadow duration-300">
          {/* Layout dengan foto gitar & laptop di atas, teks di bawah */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            {/* FOTO GITAR - MUSIC */}
            <div className="relative w-full aspect-square rounded-xl overflow-hidden border-2 border-gray-400 shadow-lg hover:border-gray-600 transition-colors duration-300 group">
              <Image
                src="https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=500&h=500&fit=crop"
                alt="Gitar - Music"
                fill
                className="object-cover hover:scale-105 transition-transform duration-300 grayscale group-hover:grayscale-0"
                priority
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-300 flex items-end justify-center pb-4">
                <span className="text-white font-bold text-lg">Music</span>
              </div>
            </div>

            {/* FOTO LAPTOP - IT */}
            <div className="relative w-full aspect-square rounded-xl overflow-hidden border-2 border-gray-400 shadow-lg hover:border-gray-600 transition-colors duration-300 group">
              <Image
                src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=500&fit=crop"
                alt="Laptop - IT"
                fill
                className="object-cover hover:scale-105 transition-transform duration-300 grayscale group-hover:grayscale-0"
                priority
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-300 flex items-end justify-center pb-4">
                <span className="text-white font-bold text-lg">IT</span>
              </div>
            </div>
          </div>

          {/* TEKS SECTION */}
          <div className="flex flex-col border-t border-gray-300 pt-10">
            <h1 className="text-5xl font-bold tracking-wider text-black">
              Agil Faqih
            </h1>

            <div className="mt-4 h-1 w-32 bg-black rounded-full"></div>

            <p className="mt-6 text-base leading-relaxed text-gray-700">
              Saya seorang developer dan music enthusiast yang passionate
              tentang teknologi dan seni. Dengan keahlian dalam web development
              dan programming, saya menciptakan solusi digital yang inovatif. Di
              saat luang, saya menikmati musik, baik sebagai pendengar maupun
              creator. Saya percaya bahwa teknologi dan musik adalah dua aspek
              kreativitas yang saling melengkapi.
            </p>

            {/* Skills section */}
            <div className="mt-8 flex gap-3 flex-wrap">
              <span className="px-4 py-2 bg-gray-200 border border-gray-400 rounded-full text-sm font-semibold hover:bg-gray-300 transition-colors cursor-default">
                IT & Development
              </span>
              <span className="px-4 py-2 bg-gray-200 border border-gray-400 rounded-full text-sm font-semibold hover:bg-gray-300 transition-colors cursor-default">
                Music Production
              </span>
              <span className="px-4 py-2 bg-gray-200 border border-gray-400 rounded-full text-sm font-semibold hover:bg-gray-300 transition-colors cursor-default">
                Web Design
              </span>
            </div>
          </div>
        </div>

        {/* Garis bawah */}
        <div className="mt-8 h-1 w-full bg-gradient-to-r from-transparent via-black to-transparent rounded-full opacity-30"></div>
      </main>
    </div>
  );
}
