import supabase from './supabaseClient.js';

const btnSimpan = document.getElementById('btnSimpan');
const inputNama = document.getElementById('namaSiswa');
const inputKelas = document.getElementById('kelasSiswa');

btnSimpan.addEventListener('click', async () => {
    const nama = inputNama.value;
    const kelas = inputKelas.value;

    if (!nama || !kelas) {
        alert("Nama dan Kelas tidak boleh kosong!");
        return;
    }

    const { data, error } = await supabase
        .from('Perpus uji 1')
        .insert([
            { 
                "Nama": nama, 
                "Kelas": kelas, 
                "Status Pinjam": "Bebas Pinjam" 
            }
        ]); [cite: 4]

    if (error) {
        console.error('Gagal simpan:', error.message);
        alert('Gagal menyimpan data: ' + error.message);
    } else {
        alert('Data siswa berhasil disimpan!'); [cite: 5]
        inputNama.value = '';
        inputKelas.value = '';
    }
});
