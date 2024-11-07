// URL model Teachable Machine
const URL = "https://teachablemachine.withgoogle.com/models/wbv_2gdgI/";
let model, labelContainer, maxPredictions;

function getProgressBarColor(percentage) {
    if (percentage >= 70) return '#4CAF50'; // Hijau untuk persentase tinggi
    if (percentage >= 40) return '#FFA500'; // Oranye untuk persentase sedang
    return '#FF6B6B'; // Merah untuk persentase rendah
}
// Load model
async function init() {
    try {
        const modelURL = URL + "model.json";
        const metadataURL = URL + "metadata.json";
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();
        
        // Siapkan container untuk label hasil prediksi
        labelContainer = document.getElementById("label-container");
        labelContainer.innerHTML = ''; // Bersihkan container sebelum menambahkan elemen baru
    } catch (error) {
        console.error("Error loading model:", error);
    }
}

// Handle input gambar
document.getElementById('imageUpload').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            // Tampilkan preview gambar
            const preview = document.getElementById('imagePreview');
            preview.innerHTML = `<img src="${e.target.result}" style="max-width: 100%; max-height: 300px; border-radius: 15px;">`;
        }
        
        reader.readAsDataURL(file);
    }
});

// Fungsi prediksi
async function predict() {
    try {
        // Pastikan model sudah di-load
        if (!model) await init();
        
        // Ambil gambar dari preview
        const image = document.querySelector('#imagePreview img');
        if (!image) {
            alert('Silakan pilih gambar terlebih dahulu');
            return;
        }

        // Lakukan prediksi
        const prediction = await model.predict(image);
        
        // Temukan prediksi dengan probabilitas tertinggi
        let highestProbability = 0;
        let mostLikelyDisease = '';

        labelContainer.innerHTML = ''; // Bersihkan hasil sebelumnya

        for (let i = 0; i < maxPredictions; i++) {
            const probability = prediction[i].probability * 100;
            console.log("Probability:", probability);
            console.log("Color:", getProgressBarColor(probability));
            const classPrediction = `
                <div class="prediction-item">
                    <div class="prediction-header">
                        <span class="prediction-name">${prediction[i].className}</span>
                        <span class="prediction-probability">${probability.toFixed(2)}%</span>
                    </div>
                    <div class="progress-bar-container">
                        <div class="progress-bar" style="width: ${probability}%; background-color: ${getProgressBarColor(probability)}"></div>
                    </div>
                </div>
            `;
            labelContainer.innerHTML += classPrediction;
        
            if (prediction[i].probability > highestProbability) {
                highestProbability = prediction[i].probability;
                mostLikelyDisease = prediction[i].className;
            }
        }

        // Hapus info penyakit sebelumnya jika ada
        const oldInfo = document.querySelector('.penyakit-info');
        if (oldInfo) oldInfo.remove();

        // Tampilkan informasi penyakit
        tampilkanInfoPenyakit(mostLikelyDisease);

    } catch (error) {
        console.error("Error during prediction:", error);
        alert('Terjadi kesalahan saat melakukan prediksi. Silakan coba lagi.');
    }
}

const penyakitInfo = {
    "VSD (Vascular Streak Dieback)": {
        nama: "VSD (Vascular Streak Dieback)",
        daun: "Daun menguning, gugur lebih awal",
        batang: "Kematian batang muda",
        ciriKhusus: "Penyakit jamur, menurunkan produktivitas",
        penanganan: "Pemangkasan cabang terinfeksi, aplikasi fungisida sistemik, penggunaan klon tahan VSD"
    },
    "Busuk Buah Hitam": {
        nama: "Busuk Buah Hitam",
        buah: "Buah berwarna hitam dan membusuk",
        ciriKhusus: "Jamur pada buah menyebabkan busuk hitam",
        penanganan: "Sanitasi kebun, pemangkasan untuk sirkulasi udara, aplikasi fungisida, panen tepat waktu"
    },
    "Busuk Pangkal Batang": {
        nama: "Busuk Pangkal Batang",
        batang: "Luka pada pangkal batang",
        ciriKhusus: "Luka berwarna coklat dengan lendir",
        penanganan: "Pembersihan area terinfeksi, aplikasi fungisida, perbaikan drainase tanah"
    },
    "Kanker Batang": {
        nama: "Kanker Batang",
        batang: "Luka terbuka dan keluarnya getah",
        ciriKhusus: "Menghambat penyerapan nutrisi",
        penanganan: "Pemangkasan bagian terinfeksi, aplikasi fungisida, penutupan luka dengan penutup luka"
    },
    "Karat Daun Kakao": {
        nama: "Karat Daun Kakao",
        daun: "Bercak kuning-oranye",
        ciriKhusus: "Penyakit jamur pada daun, menurunkan fotosintesis",
        penanganan: "Aplikasi fungisida, pemangkasan untuk meningkatkan sirkulasi udara, penggunaan varietas tahan"
    },
    "Antraknosa": {
        nama: "Antraknosa",
        daun: "Bercak coklat pada daun",
        buah: "Bercak coklat pada buah",
        ciriKhusus: "Pembentukan bercak hitam pada buah",
        penanganan: "Sanitasi kebun, pemangkasan, aplikasi fungisida, panen tepat waktu"
    },
    "Penyakit Akar Putih": {
        nama: "Penyakit Akar Putih",
        akar: "Akar berwarna putih kapur",
        ciriKhusus: "Akar terinfeksi dengan warna putih kapur",
        penanganan: "Isolasi tanaman terinfeksi, aplikasi fungisida pada area perakaran, perbaikan drainase tanah"
    }
};
function tampilkanInfoPenyakit(namaPenyakit) {
    const info = penyakitInfo[namaPenyakit];
    if (!info) return;

    let infoHTML = `
        <h2>${info.nama}</h2>
        <p>Penyakit ini memiliki ciri-ciri:</p>
        <ul>
    `;

    if (info.daun) infoHTML += `<li>${info.daun}</li>`;
    if (info.akar) infoHTML += `<li>${info.akar}</li>`;
    if (info.batang) infoHTML += `<li>${info.batang}</li>`;
    if (info.buah) infoHTML += `<li>${info.buah}</li>`;
    if (info.bunga) infoHTML += `<li>${info.bunga}</li>`;
    if (info.ciriKhusus) infoHTML += `<li>${info.ciriKhusus}</li>`;

    infoHTML += `</ul>`;

    if (info.penanganan) {
        infoHTML += `
            <p>Cara penanganan penyakit ini:</p>
            <p>${info.penanganan}</p>
        `;
    }

    const infoContainer = document.createElement('div');
    infoContainer.innerHTML = infoHTML;
    infoContainer.className = 'penyakit-info';

    const resultContainer = document.getElementById('result-container');
    resultContainer.appendChild(infoContainer);
}
// Navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});
burger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});
// Init saat halaman dimuat
init();