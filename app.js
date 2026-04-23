// Kita panggil langsung dari window karena menggunakan CDN di index.html
const { createClient } = window.supabase;

// Ambil URL dan Key dari Environment Variables Netlify
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Buat koneksi
const supabase = createClient(supabaseUrl, supabaseKey);

const btnSimpan = document.getElementById('btnSimpan');
const inputNama = document.getElementById('namaSiswa');
const inputKelas = document.getElementById('kelasSiswa');

btnSimpan.addEventListener('click', async () => {
    const nama = inputNama.value;
    const kelas = inputKelas.value;

    if (!nama || !kelas) {
        alert("Mohon isi Nama dan Kelas!");
        return;
    }

    console.log("Mencoba mengirim data..."); // Cek di console browser

    const { data, error } = await supabase
        .from('Perpus uji 1')
        .insert([
            { 
                "Nama Siswa": nama, 
                "Kelas": kelas 
            }
        ]);

    if (error) {
        console.error('Error detail:', error);
        alert('Gagal: ' + error.message);
    } else {
        console.log('Hasil:', data);
        alert('Data siswa berhasil disimpan!');
        inputNama.value = '';
        inputKelas.value = '';
    }
});
