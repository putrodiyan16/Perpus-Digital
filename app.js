const supabaseUrl = 'URL_SUPABASE_KAMU';
const supabaseKey = 'KEY_SUPABASE_KAMU';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Fungsi Pindah Halaman
function tampilkanHalaman(idHalaman) {
    document.getElementById('menu-utama').classList.add('hidden');
    document.querySelectorAll('.halaman').forEach(h => h.classList.add('hidden'));
    document.getElementById(idHalaman).classList.remove('hidden');
}

function kembaliKeMenu() {
    document.querySelectorAll('.halaman').forEach(h => h.classList.add('hidden'));
    document.getElementById('menu-utama').classList.remove('hidden');
}

// Logika Simpan Registrasi (Yang sudah kita tes berhasil)
const btnSimpan = document.getElementById('btnSimpan');
btnSimpan.addEventListener('click', async () => {
    const nama = document.getElementById('namaSiswa').value;
    const kelas = document.getElementById('kelasSiswa').value;

    if(!nama || !kelas) {
        alert("Isi nama dan kelas dulu ya!");
        return;
    }

    const { data, error } = await supabase
        .from('Perpus digital') // Sesuaikan dengan nama tabel barumu jika berubah
        .insert([{ "Nama Siswa": nama, "Kelas": kelas }]);

    if (error) {
        console.error(error);
        alert("Gagal simpan: " + error.message);
    } else {
        alert("Data siswa berhasil disimpan! ID otomatis telah dibuat di sistem.");
        document.getElementById('namaSiswa').value = '';
        document.getElementById('kelasSiswa').value = '';
        kembaliKeMenu();
    }
});
