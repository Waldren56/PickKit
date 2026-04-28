# 🛒 Pickit - Smart Shopping List

Progetto full-stack: backend Spring Boot + frontend HTML/JS vanilla.

---

## Requisiti

- Java 17+
- Maven 3.8+
- Un browser moderno

---

## Avvio rapido

### 1. Backend (Spring Boot)

```bash
cd backend
mvn spring-boot:run
```

Il server parte su **http://localhost:8080**

Al primo avvio carica automaticamente il catalogo (35 prodotti, 9 categorie) e 2 liste di esempio.

**H2 Console** (per ispezionare il database in sviluppo):
→ http://localhost:8080/h2-console
→ JDBC URL: `jdbc:h2:mem:pickitdb`
→ User: `sa`, Password: (vuota)

---

### 2. Frontend

Apri `frontend/index.html` direttamente nel browser oppure usa un server locale:

```bash
# con Python
cd frontend
python3 -m http.server 5500

# con Node.js
npx serve frontend
```

Poi apri: **http://localhost:5500**

---

## API REST

Base URL: `http://localhost:8080/api`

| Metodo | Endpoint | Descrizione |
|--------|----------|-------------|
| GET | `/lists` | Tutte le liste |
| POST | `/lists` | Crea lista `{ "name": "..." }` |
| GET | `/lists/{id}` | Lista con items |
| PUT | `/lists/{id}` | Rinomina lista |
| DELETE | `/lists/{id}` | Elimina lista |
| POST | `/lists/{id}/items` | Aggiungi item |
| PATCH | `/lists/{id}/items/{itemId}/toggle` | Spunta/despunta |
| PATCH | `/lists/{id}/items/{itemId}` | Aggiorna qty/unit/done |
| DELETE | `/lists/{id}/items/{itemId}` | Rimuovi item |
| GET | `/products?q=pasta` | Cerca nel catalogo |

---

## Passaggio a PostgreSQL (produzione)

1. Crea il database:
```sql
CREATE DATABASE pickitdb;
```

2. Avvia con il profilo prod:
```bash
mvn spring-boot:run -Dspring-boot.run.profiles=prod \
  -Dspring-boot.run.arguments="--DB_USER=tuouser --DB_PASSWORD=tuapassword"
```

---

## Struttura del progetto

```
pickit/
├── backend/
│   ├── pom.xml
│   └── src/main/java/com/pickit/
│       ├── PickitApplication.java
│       ├── model/          # Category, Product, ShoppingList, ListItem
│       ├── repository/     # JPA Repositories
│       ├── service/        # PickitService (logica di business)
│       ├── controller/     # REST Controllers
│       └── config/         # CORS, DataSeeder
└── frontend/
    └── index.html          # App completa (vanilla JS, nessuna dipendenza)
```
