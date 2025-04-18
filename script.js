let vocabularyData = [];
let currentWeek = 1;
let currentPage = 1;
let blurredColumns = { kotoba: false, kana: false, arti: false };
let blurredRows = new Set();

async function loadVocabulary() {
    try {
        const response = await fetch(`data/kotoba-minggu${currentWeek}-halaman${currentPage}.json`);
        if (!response.ok) {
            throw new Error('Data tidak ditemukan untuk halaman ini.');
        }
        vocabularyData = await response.json();
        renderTable();
        updatePageInfo();
    } catch (error) {
        console.error(error);
        document.getElementById('table-body').innerHTML = `<tr><td colspan="5" class="text-center text-red-500">${error.message}</td></tr>`;
    }
}

function renderTable() {
    const tableBody = document.getElementById('table-body');
    tableBody.innerHTML = '';

    vocabularyData.forEach((item, index) => {
        const row = document.createElement('tr');
        const isBlurredRow = blurredRows.has(index);
        row.className = isBlurredRow ? 'blurred' : '';

        row.innerHTML = `
            <td>${index + 1}</td>
            <td class="${blurredColumns.kotoba ? 'blurred' : ''}">${item.kotoba}</td>
            <td class="${blurredColumns.kana ? 'blurred' : ''}">${item.kana}</td>
            <td class="${blurredColumns.arti ? 'blurred' : ''}">${item.arti}</td>
            <td><i class="fas fa-eye toggle-blur" data-index="${index}" title="Blur baris ini"></i></td>
        `;

        tableBody.appendChild(row);
    });

    attachToggleRowBlurListeners();
}

function attachToggleRowBlurListeners() {
    document.querySelectorAll('.toggle-blur').forEach(icon => {
        icon.addEventListener('click', () => {
            const index = parseInt(icon.getAttribute('data-index'));
            if (blurredRows.has(index)) {
                blurredRows.delete(index);
            } else {
                blurredRows.add(index);
            }
            renderTable();
        });
    });
}

function toggleColumnBlur(column) {
    blurredColumns[column] = !blurredColumns[column];
    renderTable();
}

function nextPage() {
    currentPage++;
    loadVocabulary();
}

function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        loadVocabulary();
    }
}

function updatePageInfo() {
    document.getElementById('pageInfo').textContent = `Halaman ${currentPage}`;
}

// Panggil pertama kali saat halaman dimuat
loadVocabulary();
