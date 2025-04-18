document.addEventListener('DOMContentLoaded', function() {
    // Variabel global
    let vocabularyData = [];
    let filteredData = [];
    let currentWeek = 1;
    let currentDay = 1;
    let currentPage = 1;
    let itemsPerPage = 20;
    let totalPages = 1;

    // Elemen UI
    const weekSelector = document.getElementById('weekSelector');
    const daySelector = document.getElementById('daySelector');
    const itemsPerPageSelect = document.getElementById('itemsPerPage');
    const searchInput = document.getElementById('searchInput');
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
            filteredData = [...vocabularyData];

            const cacheKey = `week${currentWeek}day${currentDay}`;
            localStorage.setItem(cacheKey, JSON.stringify(vocabularyData));

            searchInput.value = '';
            currentPage = 1;
            updatePagination();
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

        if (filteredData.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="no-data">Tidak ada data</td></tr>';
            return;
        }

        const paginatedData = getPaginatedData();

        paginatedData.forEach((item, index) => {
            const globalIndex = (currentPage - 1) * itemsPerPage + index + 1;
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${globalIndex}</td>
                <td>${item.kotoba || '-'}</td>
                <td>${item.kana || '-'}</td>
                <td>${item.arti || '-'}</td>
                <td><i class="fas fa-eye action-btn" title="Sembunyikan baris"></i></td>
            `;
            tbody.appendChild(row);
        });

        setupActionButtons();  // Tambahkan listener untuk tombol aksi di baris
    }

    // Tambahkan listener ke ikon aksi (mata) di tiap baris
    function setupActionButtons() {
        document.querySelectorAll('.action-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const row = btn.closest('tr');
                const cells = row.querySelectorAll('td');

                for (let i = 1; i <= 3; i++) {
                    cells[i].classList.toggle('blurred');
                }

                btn.classList.toggle('fa-eye');
                btn.classList.toggle('fa-eye-slash');
            });
        });
    }

    // Dapatkan data pagination
    function getPaginatedData() {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredData.slice(start, start + itemsPerPage);
    }

    // Update informasi pagination
    function updatePagination() {
        totalPages = Math.ceil(filteredData.length / itemsPerPage);
        pageInfo.textContent = `Halaman ${currentPage} dari ${totalPages}`;
        prevPageBtn.disabled = currentPage <= 1;
        nextPageBtn.disabled = currentPage >= totalPages;
    }

    // Filter data berdasarkan pencarian
    function filterData(keyword) {
        if (!keyword) {
            filteredData = [...vocabularyData];
        } else {
            const lowerKeyword = keyword.toLowerCase();
            filteredData = vocabularyData.filter(item =>
                (item.kotoba && item.kotoba.toLowerCase().includes(lowerKeyword)) ||
                (item.kana && item.kana.toLowerCase().includes(lowerKeyword))
            );
        }

        currentPage = 1;
        updatePagination();
        renderTable();
    }

    // Toggle kolom dari header
    function setupColumnToggles() {
        document.querySelectorAll('.column-toggle').forEach(icon => {
            icon.addEventListener('click', (e) => {
                const column = e.target.dataset.column;
                const columnIndex = getColumnIndex(column);

                document.querySelectorAll(`tbody td:nth-child(${columnIndex})`).forEach(cell => {
                    cell.classList.toggle('blurred');
                });

                e.target.classList.toggle('fa-eye');
                e.target.classList.toggle('fa-eye-slash');
            });
        });
    }

    function getColumnIndex(columnName) {
        const columns = {
            'kotoba': 2,
            'kana': 3,
            'arti': 4
        };
        return columns[columnName] || 0;
    }

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        document.querySelector('#vocabularyTable tbody').innerHTML = '';
    }

    // Event Listeners
    function initEventListeners() {
        weekSelector.addEventListener('change', () => {
            currentWeek = parseInt(weekSelector.value);
            currentDay = 1;
            daySelector.value = 1;
            loadVocabularyData();
        });

        daySelector.addEventListener('change', () => {
            currentDay = parseInt(daySelector.value);
            loadVocabularyData();
        });

        itemsPerPageSelect.addEventListener('change', () => {
            itemsPerPage = parseInt(itemsPerPageSelect.value);
            currentPage = 1;
            updatePagination();
            renderTable();
        });

        searchInput.addEventListener('input', (e) => {
            filterData(e.target.value);
        });

        prevPageBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                updatePagination();
                renderTable();
            }
        });

        nextPageBtn.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                updatePagination();
                renderTable();
            }
        });

        burger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            burger.classList.toggle('active');
        });

        // Toggle header kolom
        setupColumnToggles();
    }
});
