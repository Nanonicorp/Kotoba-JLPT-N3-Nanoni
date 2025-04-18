document.addEventListener('DOMContentLoaded', function() {
    // Inisialisasi variabel
    let vocabularyData = [];
    let currentWeek = 1;
    let currentPage = 1;
    let blurredColumns = { kotoba: false, kana: false, arti: false };
    let blurredRows = new Set();

    // Elemen UI
    const weekSelector = document.getElementById('weekSelector');
    const pageSelector = document.getElementById('pageSelector');
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');

    // Inisialisasi Event Listeners
    function initEventListeners() {
        weekSelector.addEventListener('change', function() {
            currentWeek = parseInt(this.value);
            currentPage = 1;
            pageSelector.value = currentPage;
            loadVocabulary();
        });

        pageSelector.addEventListener('change', function() {
            currentPage = parseInt(this.value);
            loadVocabulary();
        });

        prevBtn.addEventListener('click', prevPage);
        nextBtn.addEventListener('click', nextPage);

        document.querySelectorAll('.column-toggle').forEach(icon => {
            icon.addEventListener('click', function() {
                const column = this.getAttribute('data-column');
                toggleColumnBlur(column);
            });
        });
    }

    // Fungsi utama
    async function loadVocabulary() {
        try {
            const response = await fetch(`data/week${currentWeek}_page${currentPage}.json`);
            
            if (!response.ok) {
                throw new Error(`Data minggu ${currentWeek} halaman ${currentPage} tidak ditemukan`);
            }
            
            vocabularyData = await response.json();
            renderTable();
            updatePageInfo();
        } catch (error) {
            console.error('Error:', error);
            showError(error.message);
        }
    }

    function renderTable() {
        const tbody = document.querySelector('#vocabularyTable tbody');
        tbody.innerHTML = '';

        if (vocabularyData.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5">Tidak ada data</td></tr>';
            return;
        }

        vocabularyData.forEach((item, index) => {
            const row = document.createElement('tr');
            if (blurredRows.has(index)) row.classList.add('blurred');
            
            row.innerHTML = `
                <td>${index + 1}</td>
                <td class="${blurredColumns.kotoba ? 'blurred' : ''}">${item.kotoba || '-'}</td>
                <td class="${blurredColumns.kana ? 'blurred' : ''}">${item.kana || '-'}</td>
                <td class="${blurredColumns.arti ? 'blurred' : ''}">${item.arti || '-'}</td>
                <td><i class="fas fa-eye toggle-blur" data-index="${index}"></i></td>
            `;
            
            tbody.appendChild(row);
        });

        // Attach event listeners untuk toggle baris
        document.querySelectorAll('.toggle-blur').forEach(icon => {
            icon.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                toggleRowBlur(index);
            });
        });
    }

    // Fungsi pembantu
    function toggleColumnBlur(column) {
        blurredColumns[column] = !blurredColumns[column];
        renderTable();
    }

    function toggleRowBlur(index) {
        if (blurredRows.has(index)) {
            blurredRows.delete(index);
        } else {
            blurredRows.add(index);
        }
        renderTable();
    }

    function prevPage() {
        if (currentPage > 1) {
            currentPage--;
            pageSelector.value = currentPage;
            loadVocabulary();
        }
    }

    function nextPage() {
        currentPage++;
        pageSelector.value = currentPage;
        loadVocabulary();
    }

    function updatePageInfo() {
        document.getElementById('pageInfo').textContent = `Halaman ${currentPage}`;
    }

    function showError(message) {
        const tbody = document.querySelector('#vocabularyTable tbody');
        tbody.innerHTML = `<tr><td colspan="5" class="error">${message}</td></tr>`;
    }

    // Jalankan inisialisasi
    initEventListeners();
    loadVocabulary();
});
