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
        // 1. CZYSZCZENIE KOMENTARZY BLOKOWYCH MYSQL ORAZ BACKTICKÓW
        .replace(/\/\*!.*?\*\/\s*;/g, '')
        .replace(/\/\*!.*?\*\//g, '')
        .replace(/`/g, '')
        
        // 2. NAPRAWA PODWÓJNYCH SPACJI I SŁÓW KLUCZOWYCH (np. aktywny  UNSIGNED INT)
        .replace(/\s+/g, ' ') // Zamienia wielokrotne spacje/tabulacje na jedną pojedynczą spację

        // 3. TRANSLACJA KLUCZY GŁÓWNYCH I AUTO_INCREMENT 
        .replace(/\bINT\s*\(?\d*\)?\s+AUTO_INCREMENT/gi, 'INTEGER PRIMARY KEY AUTOINCREMENT')
        .replace(/\bBIGINT\s*\(?\d*\)?\s+AUTO_INCREMENT/gi, 'INTEGER PRIMARY KEY AUTOINCREMENT')
        .replace(/\bINTEGER\s+AUTO_INCREMENT/gi, 'INTEGER PRIMARY KEY AUTOINCREMENT')
        .replace(/\bAUTO_INCREMENT/gi, 'AUTOINCREMENT')

        // 4. CZYSZCZENIE TYPÓW DANYCH (Usuwanie UNSIGNED, nawiasów z INT oraz precyzji z DATETIME i TIMESTAMP)
        .replace(/\bUNSIGNED\s+INT\b/gi, 'INTEGER')
        .replace(/\bUNSIGNED\s+INTEGER\b/gi, 'INTEGER')
        .replace(/\bUNSIGNED\b/gi, '')               
        .replace(/\bINT\s*\(\d+\)/gi, 'INTEGER')     
        .replace(/\bINTEGER\s*\(\d+\)/gi, 'INTEGER') 
        .replace(/\b(DATETIME|TIMESTAMP)\s*\(\d+\)/gi, '$1') 
        .replace(/CURRENT_TIMESTAMP\s*\(\d+\)/gi, 'CURRENT_TIMESTAMP') // Czyści CURRENT_TIMESTAMP(6) na CURRENT_TIMESTAMP

        // 5. UPROSZCZENIE POZOSTAŁYCH TYPÓW DANYCH DLA SQLITE
        .replace(/\b(VARCHAR|CHAR|LONGTEXT|MEDIUMTEXT|TINYTEXT)\s*\(\d+\)/gi, 'TEXT')
        .replace(/\b(VARCHAR|CHAR|LONGTEXT|MEDIUMTEXT|TINYTEXT)\b/gi, 'TEXT')
        .replace(/\b(TINYINT|SMALLINT|MEDIUMINT|BIGINT)\s*\(?\d*\)?/gi, 'INTEGER')
        .replace(/\b(DOUBLE|FLOAT|DECIMAL\(\d+,\s*\d+\))\b/gi, 'REAL')

        // 6. OBSŁUGA INSTRUKCJI INSERT IGNORE
        .replace(/\bINSERT\s+IGNORE\s+INTO\b/gi, 'INSERT OR IGNORE INTO')

        // 7. TŁUMACZENIE FUNKCJI (CONCAT, NOW, IFNULL, RAND)
        .replace(/CONCAT\s*\(([^)]+)\)/gi, (match, g1) => {
            return g1.split(',').map(item => item.trim()).join(' || ');
        })
        .replace(/\b(NOW|SYSDATE)\s*\(\s*\)/gi, "datetime('now', 'localtime')")
        .replace(/\bCURDATE\s*\(\s*\)/gi, "date('now')")
        .replace(/\bIFNULL\b/gi, 'COALESCE')
        .replace(/\bRAND\s*\(\s*\)/gi, 'random()')

        // 8. ZNAKI UCIECZKI, WARUNKI LOGICZNE I SILNIKI TABEL
        .replace(/\\'/g, "''")
        .replace(/\b(TRUE)\b/gi, '1')
        .replace(/\b(FALSE)\b/gi, '0')
        .replace(/ENGINE\s*=\s*\w+\s*(DEFAULT\s+CHARSET\s*=\s*\w+)?\s*(COLLATE\s*=\s*\w+)?/gi, '')
        .replace(/ON\s+UPDATE\s+CURRENT_TIMESTAMP\s*(\(\s*\))?/gi, '');

    // 9. USUNIĘCIE ZDUBWLOWANEJ KLAUZULI PRIMARY KEY NA DOLE (Skorygowany Regex ze zwykłą spacją)
    kodSqlite = kodSqlite.replace(/,\s*PRIMARY\s+KEY\s*\([^)]+\)/gi, '');

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
