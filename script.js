document.addEventListener('DOMContentLoaded', function() {
    // Variabel global
    let vocabularyData = [];
    let currentWeek = 1;
    let currentDay = 1;
    let currentPage = 1;
    let itemsPerPage = 20;
    let totalPages = 1;
    
    // Elemen UI
    const weekSelector = document.getElementById('weekSelector');
    const daySelector = document.getElementById('daySelector');
    const itemsPerPageSelect = document.getElementById('itemsPerPage');
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    const pageInfo = document.getElementById('pageInfo');
    const errorMessage = document.getElementById('errorMessage');
    const burger = document.getElementById('burger');
    const navLinks = document.querySelector('.nav-links');

    // Inisialisasi
    initEventListeners();
    loadVocabularyData();

    // Fungsi utama - Memuat data dari file JSON
    async function loadVocabularyData() {
        try {
            errorMessage.style.display = 'none';
            const filename = `data/kotoba-minggu${currentWeek}-halaman${currentDay}.json`;
            const response = await fetch(filename);
            
            if (!response.ok) {
                throw new Error(`Data tidak ditemukan untuk Minggu ${currentWeek} Hari ${currentDay}`);
            }
            
            vocabularyData = await response.json();
            currentPage = 1; // Reset ke halaman 1 saat data berubah
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
            tbody.innerHTML = '<tr><td colspan="5" class="no-data">Tidak ada data</td></tr>';
            return;
        }
        
        totalPages = Math.ceil(vocabularyData.length / itemsPerPage);
        const startIndex = (currentPage - 1) * itemsPerPage;
        const paginatedData = vocabularyData.slice(startIndex, startIndex + itemsPerPage);
        
        paginatedData.forEach((item, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${startIndex + index + 1}</td>
                <td>${item.kotoba || '-'}</td>
                <td>${item.kana || '-'}</td>
                <td>${item.arti || '-'}</td>
                <td><i class="fas fa-eye action-btn" title="Lihat detail"></i></td>
            `;
            tbody.appendChild(row);
        });
        
        updatePagination();
    }

    // Update informasi pagination
    function updatePagination() {
        pageInfo.textContent = `Halaman ${currentPage} dari ${totalPages}`;
        prevPageBtn.disabled = currentPage <= 1;
        nextPageBtn.disabled = currentPage >= totalPages;
    }

    // Tampilkan error
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        document.querySelector('#vocabularyTable tbody').innerHTML = '';
    }

    // Event Listeners
    function initEventListeners() {
        // Dropdown minggu
        weekSelector.addEventListener('change', () => {
            currentWeek = parseInt(weekSelector.value);
            currentDay = 1;
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
            currentPage = 1; // Reset ke halaman 1 saat mengubah items per page
            renderTable();
        });

        // Tombol pagination
        prevPageBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderTable();
            }
        });

        nextPageBtn.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                renderTable();
            }
        });

        // Toggle menu mobile
        burger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            burger.classList.toggle('active');
        });
    }
});
