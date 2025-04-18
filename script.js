document.addEventListener('DOMContentLoaded', function() {
    // Variabel global
    let vocabularyData = [];
    let currentWeek = 1;
    let currentDay = 1; // Diasumsikan 'halaman' di nama file = 'hari' di dropdown
    let itemsPerPage = 20;
    
    // Elemen UI
    const weekSelector = document.getElementById('weekSelector');
    const daySelector = document.getElementById('daySelector');
    const itemsPerPageSelect = document.getElementById('itemsPerPage');
    
    // Inisialisasi
    initEventListeners();
    loadVocabularyData(); // Muat data awal

    // Fungsi utama - Memuat data dari file JSON
    async function loadVocabularyData() {
        try {
            const filename = `data/kotoba-minggu${currentWeek}-halaman${currentDay}.json`;
            const response = await fetch(filename);
            
            if (!response.ok) {
                throw new Error(`Data tidak ditemukan untuk Minggu ${currentWeek} Hari ${currentDay}`);
            }
            
            vocabularyData = await response.json();
            renderTable();
        } catch (error) {
            console.error("Error:", error);
            showError(error.message);
        }
    }

    // Render tabel dengan pagination
    function renderTable() {
        const tbody = document.querySelector('#vocabularyTable tbody');
        tbody.innerHTML = '';
        
        if (vocabularyData.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5">Tidak ada data</td></tr>';
            return;
        }
        
        // Potong data sesuai itemsPerPage (jika ingin pagination client-side)
        const displayedData = vocabularyData.slice(0, itemsPerPage);
        
        displayedData.forEach((item, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${item.kotoba || '-'}</td>
                <td>${item.kana || '-'}</td>
                <td>${item.arti || '-'}</td>
                <td><i class="fas fa-eye"></i></td>
            `;
            tbody.appendChild(row);
        });
    }

    // Event Listeners
    function initEventListeners() {
        // Dropdown minggu
        weekSelector.addEventListener('change', () => {
            currentWeek = parseInt(weekSelector.value);
            currentDay = 1; // Reset ke hari 1 saat minggu berubah
            daySelector.value = 1;
            loadVocabularyData();
        });

        // Dropdown hari
        daySelector.addEventListener('change', () => {
            currentDay = parseInt(daySelector.value);
            loadVocabularyData();
        });

        // Dropdown items per page
        itemsPerPageSelect.addEventListener('change', () => {
            itemsPerPage = parseInt(itemsPerPageSelect.value);
            renderTable(); // Render ulang dengan jumlah item baru
        });
    }

    function showError(message) {
        const tbody = document.querySelector('#vocabularyTable tbody');
        tbody.innerHTML = `<tr><td colspan="5" class="error">${message}</td></tr>`;
    }
});
