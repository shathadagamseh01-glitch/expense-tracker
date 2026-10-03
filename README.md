 # Expense Tracker

A simple app to track my daily expenses. I can add an expense, see all
of them in a table, filter by category, and see the total amount and
the highest expense. The data is saved in a PostgreSQL database.

## How to run

**Backend**

1. Create a database in pgAdmin named `expense_tracker`.
2. Run `backend/schema.sql` on it to create the table.
3. Copy `backend/.env.example` to `backend/.env` and add your PostgreSQL
   password.
4. Open a terminal in `backend/` and run:
   ```
   npm install express cors pg dotenv
   node server.js
   ```

**Frontend**

1. Open `frontend/index.html` with Live Server in VS Code.
2. Make sure the backend is still running.

## Features

- [ ] Add an expense (with validation)
- [ ] Delete an expense
- [ ] Edit an expense
- [ ] Filter by category
- [ ] Summary cards (total, count, highest)
- [ ] Data is saved in a PostgreSQL database

<!-- tick [x] only the ones you actually tested yourself -->

## Screenshots
## Screenshots

![Main page](frontend/screenshot/main-page.png)
![Add expense](frontend/screenshot/add-expense.png)
![Edit modal](frontend/screenshot/edit-modal.png)

## What was the hardest part?

<!-- Write 2-3 sentences about something that actually happened to YOU
     while building this project (a bug, an error message, something
     you got stuck on) and how you solved it. This needs to be your own
     experience, because this is usually the first thing asked about in
     the demo. --> 

     ## Demo Video

[Watch the demo on Google Drive](https://drive.google.com/file/d/1ApN10Rw1zRIyZ1ikWME-m8X2Pb_v39cq/view?usp=drive_link)
