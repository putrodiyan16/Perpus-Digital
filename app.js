const supabaseUrl = 'https://vdkjyvdfddybtmyytqdx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZka2p5dmRmZGR5YnRteXl0cWR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5MzE1MjUsImV4cCI6MjA5MjUwNzUyNX0.jT72qRw6-AbO4vTZb5P5H7rOPZLYhOrkKcRHSfSc5wI';

// Gunakan nama variabel yang unik agar tidak bentrok dengan library-nya
const db = supabase.createClient(supabaseUrl, supabaseKey);

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

// Logika Simpan Registrasi
const btnSimpan = document.getElementById('btnSimpan');
if (btnSimpan) {
    btnSimpan.addEventListener('click', async () => {
        const nama = document.getElementById('namaSiswa').value;
        const kelas = document.getElementById('kelasSiswa').value;

        if(!nama || !kelas) {
            alert("Isi nama dan kelas dulu ya!");
            return;
        }

        // Pakai variabel 'db' yang tadi kita buat di atas
        const { data, error } = await db
            .from('Perpus digital') 
            .insert([{ "Nama Siswa": nama, "Kelas": kelas }]);

        if (error) {
            alert("Gagal simpan: " + error.message);
        } else {
            alert("Data siswa berhasil disimpan!");
            document.getElementById('namaSiswa').value = '';
            document.getElementById('kelasSiswa').value = '';
            kembaliKeMenu();
        }
    });
}
