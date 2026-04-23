// Ganti dengan URL dan Key milikmu
const supabaseUrl = 'https://vdkjyvdfddybtmyytqdx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZka2p5dmRmZGR5YnRteXl0cWR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5MzE1MjUsImV4cCI6MjA5MjUwNzUyNX0.jT72qRw6-AbO4vTZb5P5H7rOPZLYhOrkKcRHSfSc5wI';
const client = supabase.createClient(supabaseUrl, supabaseKey);

// 2. VARIABEL GLOBAL UNTUK SCANNER
let html5QrCode;

// 3. FUNGSI NAVIGASI HALAMAN
async function tampilkanHalaman(idHalaman) {
    // Sembunyikan semua halaman
    document.getElementById('menu-utama').classList.add('hidden');
    document.querySelectorAll('.halaman').forEach(h => h.classList.add('hidden'));
    
    // Tampilkan halaman yang dituju
    document.getElementById(idHalaman).classList.remove('hidden');

    // Jika masuk ke halaman scan, nyalakan kamera
    if (idHalaman === 'halaman-kedatangan') {
        mulaiScan();
    }
}

function kembaliKeMenu() {
    document.querySelectorAll('.halaman').forEach(h => h.classList.add('hidden'));
    document.getElementById('menu-utama').classList.remove('hidden');
}

// 4. FUNGSI KHUSUS SCANNER
function mulaiScan() {
    html5QrCode = new Html5Qrcode("reader");
    const config = { fps: 15, qrbox: { width: 250, height: 250 } };

    html5QrCode.start(
        { facingMode: "environment" },
        config,
        async (decodedText) => {
            const idScanned = parseInt(decodedText);
            
            // Berhenti scan agar tidak berulang-ulang
            stopScanner();

            // --- TAHAP 1: CARI NAMA SISWA ---
            // Kita minta Supabase mencari baris yang ID-nya cocok dengan hasil scan
            const { data: dataSiswa, error: errorCari } = await client
                .from('Perpus digital')
                .select('Nama Siswa, Kelas')
                .eq('id', idScanned) 
                .single(); // Kita hanya butuh 1 data saja

            if (errorCari || !dataSiswa) {
                alert("Waduh! ID " + idScanned + " tidak ditemukan di data siswa. Silakan registrasi dulu.");
                kembaliKeMenu();
                return;
            }

            // --- TAHAP 2: JIKA KETEMU, BARU SIMPAN KE TABEL KEDATANGAN ---
            const { error: errorSimpan } = await client
                .from('Kedatangan')
                .insert([{ id_siswa: idScanned }]);

            if (errorSimpan) {
                alert("Gagal mencatat: " + errorSimpan.message);
            } else {
                // TAHAP 3: MUNCULKAN NAMA DI LAYAR
                alert("Selamat Datang, " + dataSiswa['Nama Siswa'] + "!\nKelas: " + dataSiswa.Kelas);
            }
            
            kembaliKeMenu();
        }
    ).catch(err => {
        console.error("Kamera bermasalah:", err);
    });
}

// INI FUNGSI YANG TADI HILANG/BELUM ADA
function stopScanner() {
    if (html5QrCode && html5QrCode.isScanning) {
        html5QrCode.stop().then(() => {
            console.log("Scanner Berhenti.");
            kembaliKeMenu();
        }).catch(err => {
            console.error("Gagal stop scanner:", err);
            kembaliKeMenu(); // Tetap balik ke menu meski gagal stop
        });
    } else {
        kembaliKeMenu();
    }
}

// 5. LOGIKA REGISTRASI (Siswa Baru)
const btnSimpan = document.getElementById('btnSimpan');
if (btnSimpan) {
    btnSimpan.addEventListener('click', async () => {
        const nama = document.getElementById('namaSiswa').value;
        const kelas = document.getElementById('kelasSiswa').value;

        if(!nama || !kelas) {
            alert("Isi nama dan kelas dulu!");
            return;
        }

        const { data, error } = await client
            .from('Perpus digital') 
            .insert([{ "Nama Siswa": nama, "Kelas": kelas }]);

        if (error) {
            alert("Error: " + error.message);
        } else {
            alert("Siswa Berhasil Terdaftar!");
            document.getElementById('namaSiswa').value = '';
            document.getElementById('kelasSiswa').value = '';
            kembaliKeMenu();
        }
    });
}
