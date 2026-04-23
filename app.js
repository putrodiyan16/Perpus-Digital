// Memanggil library Supabase dari window (karena pakai CDN di HTML)
const { createClient } = window.supabase;

// Masukkan URL dan Key kamu secara langsung (Hardcoded)
const supabaseUrl = 'https://vdkjyvdfddybtmyytqdx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZka2p5dmRmZGR5YnRteXl0cWR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5MzE1MjUsImV4cCI6MjA5MjUwNzUyNX0.jT72qRw6-AbO4vTZb5P5H7rOPZLYhOrkKcRHSfSc5wI';

const supabase = createClient(supabaseUrl, supabaseKey);

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

    console.log("Sedang mencoba mengirim data ke Supabase...");

    const { data, error } = await supabase
        .from('Perpus uji 1')
        .insert([
            { 
                "Nama Siswa": nama, 
                "Kelas": kelas 
            }
        ]);

    if (error) {
        console.error('Ada Error:', error.message);
        alert('Gagal simpan: ' + error.message);
    } else {
        console.log('Berhasil:', data);
        alert('Data ' + nama + ' berhasil masuk ke Supabase!');
        inputNama.value = '';
        inputKelas.value = '';
    }
});
