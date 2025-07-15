---
applyTo: '**'
---
Provide project context and coding guidelines that AI should follow when generating code, answering questions, or reviewing changes.

# Project Context
This project is a Flutter application that tracks user progress. It includes both a user interface and backend functionality. The application is designed to be run on multiple platforms, including web and Android.
The backend is implemented using Google Apps Script, which interacts with a Google Spreadsheet to store and retrieve user progress data. The application allows users to input their progress and view it in a structured format.
The project also includes a GitHub repository for version control and collaboration.
user interface is built using Flutter webview where url for user is https://syuaibsyuaib.github.io/progress_tracker/user.html

# Coding Guidelines
1. **Code Structure**: Organize code into modules and components for better maintainability.
2. **State Management**: Use appropriate state management techniques (e.g., Provider, Riverpod) to manage application state.
3. **API Integration**: Follow best practices for API integration, including error handling and data validation.
4. **UI/UX Design**: Adhere to Material Design guidelines for a consistent user experience across platforms.
5. **Testing**: Write unit and integration tests to ensure code quality and reliability.

# Links
gscript: https://script.google.com/macros/s/AKfycbxlZW3AxOBaTcPlZCNgFZaI4fMS4nDh2ESv7ujRkDLPz9AZxhNwLduQkbV2YP4iQ3pImw/exec
github pages (user): https://syuaibsyuaib.github.io/progress_tracker/user.html
github pages (admin): https://syuaibsyuaib.github.io/progress_tracker/index.html

# ID Spreadsheet
1GytHkptBkFUzEqul7EmJIH07bEeMastwsZM_DXrVQVM

# Model kolom progres
The model for the progress entries includes the following columns:
- **NOMOR**: Nomor urut entri progres, biasanya berupa angka berurutan.
- **ID**: Identifikasi unik untuk setiap entri progres, sering kali berupa string atau angka.
- **ID_USER**: Identifikasi unik pengguna yang membuat entri progres, digunakan untuk mengaitkan entri dengan pengguna tertentu.
- **ID_PROGRES**: Identifikasi unik untuk entri progres tertentu, digunakan untuk mengaitkan entri dengan jenis progres yang spesifik.
- **ID_KATEGORI**: Identifikasi unik untuk kategori progres, digunakan untuk mengelompokkan entri progres berdasarkan kategori tertentu.
- **NIP**: Nomor Induk Pegawai, digunakan untuk identifikasi pegawai.
- **NAMA**: Nama pegawai atau entitas yang sedang dilacak.
- **TANGGAL**: Tanggal terkait dengan entri progres.
- **KINERJA**: Deskripsi atau nilai kinerja yang dicapai.
- **BOBOT**: Bobot atau nilai yang diberikan untuk kinerja tersebut.
- **STATUS**: Status dari entri progres, misalnya "Selesai", "Dalam Proses", atau "Ditolak".
- **KETERANGAN**: Penjelasan tambahan mengenai entri progres.

# model kolom user
The model for the user entries includes the following columns:
- **ID**: Identifikasi unik untuk setiap pengguna, sering kali berupa string atau angka.
- **USERNAME**: Nama pengguna yang digunakan untuk login.
- **PASSWORD**: Kata sandi yang digunakan untuk autentikasi pengguna.
- **NIP**: Nomor Induk Pegawai, digunakan untuk identifikasi pegawai.
- **NAMA**: Nama lengkap pengguna.
- **ROLE**: Peran pengguna dalam sistem, misalnya "admin" atau "user".

# additional instructions
- Ensure that all API calls are properly authenticated.
- Validate all user inputs on both client and server sides.
- Implement error handling for network requests.
- Write unit tests for all new features and bug fixes.
- auto commit and push changes to the repository after completing tasks.
