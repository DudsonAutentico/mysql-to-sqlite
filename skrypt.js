const mysqlInput = document.getElementById('mysql');
const sqliteOutput = document.getElementById('sqlite');
const btnTlumacz = document.getElementById('btn-tlumacz');
const btnKopiuj = document.getElementById('btn-kopiuj');
const toast = document.getElementById('toast-powiadomienie');

// ==========================================
// 1. FUNKCJA TRANSLATORA DIALEKTÓW SQL
// ==========================================
btnTlumacz.addEventListener('click', () => {
    const kodMysql = mysqlInput.value;
    if (kodMysql.trim() === "") {
        alert("Najpierw wpisz lub wklej zapytanie MySQL!");
        return;
    }

    let kodSqlite = kodMysql
        .replace(/`/g, '')
        .replace(/ENGINE\s*=\s*\w+\s*(DEFAULT\s+CHARSET\s*=\s*\w+)?\s*(COLLATE\s*=\s*\w+)?/gi, '')
        .replace(/^#.*\$/gm, '')
        .replace(/INT\s+AUTO_INCREMENT/gi, 'INTEGER PRIMARY KEY AUTOINCREMENT')
        .replace(/BIGINT\s+AUTO_INCREMENT/gi, 'INTEGER PRIMARY KEY AUTOINCREMENT')
        .replace(/AUTO_INCREMENT/gi, 'AUTOINCREMENT')
        .replace(/\b(VARCHAR|CHAR|LONGTEXT|MEDIUMTEXT|TINYTEXT)\(\d+\)/gi, 'TEXT')
        .replace(/\b(VARCHAR|CHAR|LONGTEXT|MEDIUMTEXT|TINYTEXT)\b/gi, 'TEXT')
        .replace(/\b(TINYINT|SMALLINT|MEDIUMINT|BIGINT)\b/gi, 'INTEGER')
        .replace(/\b(DOUBLE|FLOAT|DECIMAL\(\d+,\s*\d+\))\b/gi, 'REAL')
        .replace(/CONCAT\s*\(([^)]+)\)/gi, (match, g1) => {
            return g1.split(',').map(item => item.trim()).join(' || ');
        })
        .replace(/\b(NOW|SYSDATE)\s*\(\s*\)/gi, "datetime('now', 'localtime')")
        .replace(/\bCURDATE\s*\(\s*\)/gi, "date('now')")
        .replace(/\bIFNULL\b/gi, 'COALESCE')
        .replace(/\bRAND\s*\(\s*\)/gi, 'random()')
        .replace(/\\'/g, "''")
        .replace(/\b(TRUE)\b/gi, '1')
        .replace(/\b(FALSE)\b/gi, '0')
        .replace(/ON\s+UPDATE\s+CURRENT_TIMESTAMP\s*(\(\s*\))?/gi, '');
    
    sqliteOutput.value = kodSqlite;
    btnKopiuj.style.visibility = 'visible';
});

// ==========================================
// 2. OBSŁUGA KOPIOWANIA I OKIENKA TOAST
// ==========================================
let toastTimeout;

btnKopiuj.addEventListener('click', () => {
    if (sqliteOutput.value.trim() === "") return;

    navigator.clipboard.writeText(sqliteOutput.value)
        .then(() => {
            clearTimeout(toastTimeout);
            toast.classList.add('pokaz');
            
            toastTimeout = setTimeout(() => {
                toast.classList.remove('pokaz');
            }, 2500);
        })
        .catch(err => {
            console.error("Błąd schowka: ", err);
        });
});

// ===================================================
// 3. OBSŁUGA PRZEŁĄCZNIKA MOTYWÓW (NA BODY)
// ===================================================
const themeToggle = document.getElementById('theme-toggle');
const currentTheme = localStorage.getItem('theme');

// Sprawdzenie przy ładowaniu strony, czy użytkownik ma zapisany motyw
if (currentTheme) {
    document.body.setAttribute('data-theme', currentTheme);
    if (currentTheme === 'dark') {
        themeToggle.checked = true; // Zaznacza suwak, jeśli zapisano tryb nocny
    }
} else {
    // Domyślny start w trybie jasnym
    document.body.setAttribute('data-theme', 'light');
}

// Nasłuchiwanie kliknięcia w przełącznik i dynamiczna zmiana atrybutu na body
themeToggle.addEventListener('change', (e) => {
    if (e.target.checked) {
        document.body.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark'); // Zapis do pamięci przeglądarki
    } else {
        document.body.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
    }
});