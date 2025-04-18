document.addEventListener('DOMContentLoaded', function() {
    // Variabel global
    let allVocabularyData = [];  // Menyimpan semua data
    let filteredData = [];       // Data setelah difilter (minggu & hari)
    let displayedData = [];      // Data yang ditampilkan (termasuk pagination)
    let currentWeek = 1;
    let currentDay = 1;
    let currentPage = 1;
    let itemsPerPage = 20;       // Default: 20 baris/halaman

    // Elemen UI
    const weekSelector = document.getElementById('weekSelector');
    const daySelector = document.getElementById('daySelector');
    const itemsPerPageSelector = document.getElementById('itemsPerPage');
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    const pageInfoSpan = document.getElementById('pageInfo');

    // Inisialisasi
    initEventListeners();
    loadAllData();  // Load semua data sekaligus

    // Fungsi utama
    async function loadAllData() {
        try {
            const response = await fetch('data.json');  // Asumsi semua data dalam 1 file
            if (!response.ok) throw new Error("Gagal memuat data");
            
            allVocabularyData = await response.json();
            filterData();  // Filter berdasarkan minggu & hari
            updateDisplay(); // Tampilkan data
        } catch (error) {
            console.error("Error:", error);
            showError(error.message);
        }
    }

    // Filter data berdasarkan minggu & hari
    function filterData() {
        filteredData = allVocabularyData.filter(item => 
            item.minggu == currentWeek && item.hari == currentDay
        );
        
        currentPage = 1;  // Reset ke halaman 1 saat filter berubah
        updateDisplay();
    }

    // Update data yang ditampilkan (termasuk pagination)
    function updateDisplay() {
        const startIdx = (currentPage - 1) * itemsPerPage;
        const endIdx = startIdx + itemsPerPage;
        displayedData = filteredData.slice(startIdx, endIdx);
        
        renderTable();
        updatePagination();
    }

    // Render tabel
    function renderTable() {
        const tbody = document.querySelector('#vocabularyTable tbody');
        tbody.innerHTML = '';

        if (displayedData.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5">Tidak ada data</td></tr>';
            return;
        }

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

    // Update tampilan pagination
    function updatePagination() {
        const totalPages = Math.ceil(filteredData.length / itemsPerPage);
        
        // Update tombol navigasi
        prevPageBtn.disabled = (currentPage === 1);
        nextPageBtn.disabled = (currentPage >= totalPages);
        
        // Update info halaman
        pageInfoSpan.textContent = `Halaman ${currentPage} dari ${totalPages}`;
    }

    // Event Listeners
    function initEventListeners() {
        // Dropdown filter
        weekSelector.addEventListener('change', () => {
            currentWeek = parseInt(weekSelector.value);
            filterData();
        });

        daySelector.addEventListener('change', () => {
            currentDay = parseInt(daySelector.value);
            filterData();
        });

        // Dropdown items per page
        itemsPerPageSelector.addEventListener('change', () => {
            itemsPerPage = parseInt(itemsPerPageSelector.value);
            currentPage = 1;  // Reset ke halaman 1
            updateDisplay();
        });

        // Tombol pagination
        prevPageBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                updateDisplay();
            }
        });

        nextPageBtn.addEventListener('click', () => {
            const totalPages = Math.ceil(filteredData.length / itemsPerPage);
            if (currentPage < totalPages) {
                currentPage++;
                updateDisplay();
            }
        });
    }

    function showError(message) {
        const tbody = document.querySelector('#vocabularyTable tbody');
        tbody.innerHTML = `<tr><td colspan="5" class="error">${message}</td></tr>`;
    }
});
