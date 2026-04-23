import supabase from './supabaseClient.js';

const btnSimpan = document.getElementById('btnSimpan');
const inputNama = document.getElementById('namaSiswa');
const inputKelas = document.getElementById('kelasSiswa');

btnSimpan.addEventListener('click', async () => {
    const nama = inputNama.value;
    const kelas = inputKelas.value;

    // 1. Validasi Input
    if (!nama || !kelas) {
        alert("Mohon isi Nama dan Kelas terlebih dahulu!");
        return;
    }

    // 2. Proses Simpan ke Supabase
    // Saya sesuaikan "Nama Siswa" sesuai struktur tabel kamu [cite: 3, 4]
    const { data, error } = await supabase
        .from('Perpus uji 1')
        .insert([
            { 
                "Nama Siswa": nama, 
                "Kelas": kelas 
                // Kolom "Status Pinjam" dihapus karena sudah tidak ada di database kamu
            }
        ]);

    // 3. Penanganan Hasil
    if (error) {
        console.error('Detail Error:', error);
        alert('Gagal menyimpan: ' + error.message);
    } else {
        alert('Data siswa berhasil disimpan!');
        // Kosongkan form agar bisa input data baru
        inputNama.value = '';
        inputKelas.value = '';
    }
});
