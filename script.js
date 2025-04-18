let currentWeek = 1; // Minggu default
let currentPage = 1; // Halaman default
let itemsPerPage = 20;
let vocabularyData = [];
let blurredColumns = {
    kotoba: false,
    kana: false,
    arti: false
};

// Fungsi untuk memuat data kosakata berdasarkan minggu dan halaman
async function loadVocabulary() {
    try {
        const response = await fetch(`data/kotoba-minggu${currentWeek}-halaman${currentPage}.json`);
        vocabularyData = await response.json();
        renderTable();
    } catch (error) {
        console.error('Error loading vocabulary data:', error);
    }
}

// Fungsi untuk merender tabel
function renderTable() {
    const tableBody = document.querySelector('#vocabularyTable tbody');
    tableBody.innerHTML = '';
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = vocabularyData.slice(startIndex, endIndex);
    
    currentItems.forEach((item, index) => {
        const row = document.createElement('tr');
        const globalIndex = startIndex + index;
        
        row.innerHTML = `
            <td>${globalIndex + 1}</td>
            <td class="${blurredColumns.kotoba ? 'blurred' : ''}">${item.kotoba}</td>
            <td class="${blurredColumns.kana ? 'blurred' : ''}">${item.kana}</td>
            <td class="${blurredColumns.arti ? 'blurred' : ''}">${item.arti}</td>
            <td><i class="fas fa-eye toggle-blur" data-index="${globalIndex}" title="Blur baris ini"></i></td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // Update info halaman
    document.getElementById('pageInfo').textContent = `Halaman ${currentPage} dari ${Math.ceil(vocabularyData.length / itemsPerPage)}`;
    
    // Nonaktifkan tombol sebelumnya jika di halaman pertama
    document.getElementById('prevPage').disabled = currentPage === 1;
    
    // Nonaktifkan tombol berikutnya jika di halaman terakhir
    document.getElementById('nextPage').disabled = currentPage === Math.ceil(vocabularyData.length / itemsPerPage);
    
    // Update icon kolom toggle
    updateColumnToggleIcons();
}

// Fungsi untuk update icon toggle kolom
function updateColumnToggleIcons() {
    const toggles = document.querySelectorAll('.column-toggle');
    toggles.forEach(toggle => {
        const column = toggle.getAttribute('data-column');
        if (blurredColumns[column]) {
            toggle.classList.remove('fa-eye');
            toggle.classList.add('fa-eye-slash');
        } else {
            toggle.classList.remove('fa-eye-slash');
            toggle.classList.add('fa-eye');
        }
    });
}

// Fungsi untuk toggle blur kolom
function toggleColumnBlur(column) {
    blurredColumns[column] = !blurredColumns[column];
    renderTable();
}

// Fungsi untuk toggle blur baris tertentu
function toggleRowBlur(index) {
    const rows = document.querySelectorAll('#vocabularyTable tbody tr');
    const rowIndex = index - ((currentPage - 1) * itemsPerPage);
    
    if (rowIndex >= 0 && rowIndex < rows.length) {
        const cells = rows[rowIndex].querySelectorAll('td');
        for (let i = 1; i < 4; i++) {
            cells[i].classList.toggle('blurred');
        }
    }
}

// Fungsi scroll ke tabel vocabulary
function scrollToVocabulary() {
    const vocabSection = document.getElementById('vocabulary');
    if (vocabSection) {
        window.scrollTo({
            top: vocabSection.offsetTop - 80,
            behavior: 'smooth'
        });
    }
}

// Event listeners
document.getElementById('itemsPerPage').addEventListener('change', function() {
    itemsPerPage = parseInt(this.value);
    currentPage = 1;
    loadVocabulary();
});

document.getElementById('prevPage').addEventListener('click', function() {
    if (currentPage > 1) {
        currentPage--;
        loadVocabulary();
        scrollToVocabulary();
    }
});

document.getElementById('nextPage').addEventListener('click', function() {
    if (currentPage < Math.ceil(vocabularyData.length / itemsPerPage)) {
        currentPage++;
        loadVocabulary();
        scrollToVocabulary();
    }
});

document.getElementById('weekSelector').addEventListener('change', function() {
    currentWeek = parseInt(this.value);
    currentPage = 1;
    loadVocabulary();
});

document.addEventListener('click', function(e) {
    if (e.target.classList.contains('column-toggle')) {
        const column = e.target.getAttribute('data-column');
        toggleColumnBlur(column);
    }

    if (e.target.classList.contains('toggle-blur')) {
        const index = parseInt(e.target.getAttribute('data-index'));
        toggleRowBlur(index);
    }
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Fade-in animasi dan load data saat halaman siap
document.addEventListener('DOMContentLoaded', function() {
    const fadeElements = document.querySelectorAll('.fade-in');

    const fadeInObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    fadeElements.forEach(el => {
        el.style.opacity = 0;
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        fadeInObserver.observe(el);
    });

    // Muat data awal
    loadVocabulary();
});
