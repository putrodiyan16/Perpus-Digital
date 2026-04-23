// 1. KONFIGURASI SUPABASE
const supabaseUrl = 'https://vdkjyvdfddybtmyytqdx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZka2p5dmRmZGR5YnRteXl0cWR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5MzE1MjUsImV4cCI6MjA5MjUwNzUyNX0.jT72qRw6-AbO4vTZb5P5H7rOPZLYhOrkKcRHSfSc5wI';
const client = supabase.createClient(supabaseUrl, supabaseKey);

let html5QrCode;

// 3. NAVIGASI
async function tampilkanHalaman(idHalaman) {
    document.getElementById('menu-utama').classList.add('hidden');
    document.querySelectorAll('.halaman').forEach(h => h.classList.add('hidden'));
    document.getElementById(idHalaman).classList.remove('hidden');
    if (idHalaman === 'halaman-kedatangan') { mulaiScan(); }
}

function kembaliKeMenu() {
    document.querySelectorAll('.halaman').forEach(h => h.classList.add('hidden'));
    document.getElementById('menu-utama').classList.remove('hidden');
}

// 4. SCANNER (Pencarian Nama)
function mulaiScan() {
    html5QrCode = new Html5Qrcode("reader");
    const config = { fps: 15, qrbox: { width: 250, height: 250 } };

    html5QrCode.start({ facingMode: "environment" }, config, async (decodedText) => {
        const idScanned = parseInt(decodedText);
        stopScanner();

        // MENCARI NAMA: Kita arahkan ke kolom ID_Siswa sesuai gambar tabelmu
        const { data: dataSiswa, error: errorCari } = await client
            .from('Perpus digital')
            .select('"Nama Siswa", Kelas')
            .eq('ID_Siswa', idScanned) 
            .single();

        if (errorCari || !dataSiswa) {
            alert("ID " + idScanned + " belum terdaftar di database siswa.");
            kembaliKeMenu();
            return;
        }

        // CATAT KEHADIRAN
        const { error: errorSimpan } = await client
            .from('Kedatangan')
            .insert([{ ID_Siswa: idScanned }]);

        if (errorSimpan) {
            alert("Gagal catat: " + errorSimpan.message);
        } else {
            // MUNCULKAN NAMA SISWA
            alert("Selamat Datang, " + dataSiswa["Nama Siswa"] + "!\nKelas: " + dataSiswa.Kelas);
        }
        kembaliKeMenu();
    }).catch(err => console.error(err));
}

function stopScanner() {
    if (html5QrCode && html5QrCode.isScanning) { html5QrCode.stop(); }
}

// 5. REGISTRASI (ID Otomatis)
const btnSimpan = document.getElementById('btnSimpan');
if (btnSimpan) {
    btnSimpan.addEventListener('click', async () => {
        const nama = document.getElementById('namaSiswa').value;
        const kelas = document.getElementById('kelasSiswa').value;

        if(!nama || !kelas) {
            alert("Nama dan Kelas wajib diisi!");
            return;
        }

        // LOGIKA BARU: Buat ID 6 digit acak secara otomatis
        const idOtomatis = Math.floor(100000 + Math.random() * 900000);

        const { error } = await client
            .from('Perpus digital') 
            .insert([{ 
                "Nama Siswa": nama, 
                "Kelas": kelas, 
                "ID_Siswa": idOtomatis 
            }]);

        if (error) {
            alert("Gagal daftar: " + error.message);
        } else {
            alert("BERHASIL!\nSiswa: " + nama + "\nID Anda: " + idOtomatis + "\n(Gunakan ID ini untuk membuat QR Code)");
            document.getElementById('namaSiswa').value = '';
            document.getElementById('kelasSiswa').value = '';
            kembaliKeMenu();
        }
    });
}
