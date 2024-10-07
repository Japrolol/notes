# Notes

-- aby odpalić wymagany jest pobrany python na komputerze oraz node.js.
-- utworzyc bazę danych za pomocą pliku notes.sql. Utworzone jest już tam domyślne konto o emailu admin@gmail.com i haśle admin123
-- Domyślne konto spowodowane jest tym, że mam już na serwerze taką samą bazę danych, lecz rejestracja odbywa się poprzez moją strone, co nie bedzię możliwe w przypadku lokalnej bazy

-- Po utworzeniu bazy należy w root-folderze utworzyć plik .env z polami:
-- DB_HOST=w przypadku lokalnej bazy localhost
-- DB_USER=uzytkownik bazy
-- DB_PORT=3306
-- DB_NAME=nazwa bazy danych
-- DB_PASSWORD=puste
-- SECRET_KEY=cokolwiek tu wpisac

-- Następnie w folderze Notes należy utworzyć kolejny plik .env z polem:
-- VITE_API_URL="http://localhost:8000/api"

-- Teraz w terminalu należy wpisać pip install -r requirements.txt
-- Po pobraniu wymaganych modułów należy wejść do folderu Notes --> cd Notes 
-- W folderze Notes należy wpisać npm i

-- Po wymaganych przygotowaniach trzeba w folderze notes do terminalu wpisać: npm run dev
-- Następnie w root-folderze w nowym okienku terminalu wpisać: python server.py 
-- Teraz wystarczy wejść w strone http://localhost:5173 i tylko się zalogować za pomocą admina.

