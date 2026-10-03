 // Expense Tracker - frontend
const API_URL = "http://localhost:3000/api/expenses";

const tableBody = document.getElementById("expensesTableBody");
const spinner = document.getElementById("spinner");
const alertBox = document.getElementById("alertBox");
const categoryFilter = document.getElementById("categoryFilter");

let allExpenses = []; // keep every expense here, even when the table is filtered

// ---------- Helpers ----------

function showAlert(message) {
  alertBox.textContent = message;
  alertBox.classList.remove("d-none");
}

function hideAlert() {
  alertBox.classList.add("d-none");
}

function showSpinner() {
  spinner.classList.remove("d-none");
}

function hideSpinner() {
  spinner.classList.add("d-none");
}

// ---------- Load expenses (GET) ----------

async function loadExpenses() {
  showSpinner();
  hideAlert();
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error("Could not load expenses");
    }
    allExpenses = await response.json();
    renderSummary(allExpenses); // summary always uses ALL expenses
    renderTable(allExpenses);
  } catch (error) {
    showAlert("Could not connect to the server. Make sure it is running.");
  } finally {
    hideSpinner();
  }
}

// ---------- Summary cards ----------

function renderSummary(expenses) {
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  const highest = expenses.length
    ? Math.max(...expenses.map((e) => e.amount))
    : 0;

  document.getElementById("totalAmount").textContent = "$" + total.toFixed(2);
  document.getElementById("totalCount").textContent = expenses.length;
  document.getElementById("highestExpense").textContent = "$" + highest.toFixed(2);
}

// ---------- Table ----------

function renderTable(expenses) {
  tableBody.innerHTML = "";

  expenses.forEach((expense) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${expense.title}</td>
      <td>$${expense.amount.toFixed(2)}</td>
      <td><span class="badge badge-${expense.category}">${expense.category}</span></td>
      <td>${expense.date}</td>
      <td><button class="btn btn-sm btn-outline-primary edit-btn" data-id="${expense.id}">Edit</button></td>
      <td><button class="btn btn-sm btn-outline-danger delete-btn" data-id="${expense.id}">Delete</button></td>
    `;
    tableBody.appendChild(row);
  });
}

// ---------- Filter ----------

categoryFilter.addEventListener("change", () => {
  const value = categoryFilter.value;
  const filtered =
    value === "All" ? allExpenses : allExpenses.filter((e) => e.category === value);
  renderTable(filtered);
});

// ---------- Add expense (POST) ----------

const expenseForm = document.getElementById("expenseForm");

expenseForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const title = document.getElementById("title").value.trim();
  const amount = Number(document.getElementById("amount").value);
  const category = document.getElementById("category").value;
  const date = document.getElementById("date").value;

  // simple validation before sending
  let valid = true;
  document.getElementById("title").classList.toggle("is-invalid", !title);
  document.getElementById("amount").classList.toggle("is-invalid", !(amount > 0));
  document.getElementById("category").classList.toggle("is-invalid", !category);
  document.getElementById("date").classList.toggle("is-invalid", !date);
  if (!title || !(amount > 0) || !category || !date) valid = false;
  if (!valid) return;

  hideAlert();
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, amount, category, date }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Could not add the expense");
    }

    expenseForm.reset();
    await loadExpenses(); // refresh the list from the server
  } catch (error) {
    showAlert(error.message);
  }
});

// ---------- Delete expense (DELETE) ----------

tableBody.addEventListener("click", async (event) => {
  if (event.target.classList.contains("delete-btn")) {
    const id = event.target.dataset.id;
    hideAlert();
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!response.ok) {
        throw new Error("Could not delete the expense");
      }
      await loadExpenses();
    } catch (error) {
      showAlert(error.message);
    }
  }

  if (event.target.classList.contains("edit-btn")) {
    const id = event.target.dataset.id;
    const expense = allExpenses.find((e) => e.id === Number(id));
    openEditModal(expense);
  }
});

// ---------- Edit expense (PUT) ----------

const editModalEl = document.getElementById("editModal");
const editModal = new bootstrap.Modal(editModalEl);

function openEditModal(expense) {
  document.getElementById("editId").value = expense.id;
  document.getElementById("editTitle").value = expense.title;
  document.getElementById("editAmount").value = expense.amount;
  document.getElementById("editCategory").value = expense.category;
  document.getElementById("editDate").value = expense.date;
  editModal.show();
}

document.getElementById("saveEditBtn").addEventListener("click", async () => {
  const id = document.getElementById("editId").value;
  const title = document.getElementById("editTitle").value.trim();
  const amount = Number(document.getElementById("editAmount").value);
  const category = document.getElementById("editCategory").value;
  const date = document.getElementById("editDate").value;

  hideAlert();
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, amount, category, date }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Could not update the expense");
    }

    editModal.hide();
    await loadExpenses();
  } catch (error) {
    showAlert(error.message);
  }
});

// ---------- Start ----------

loadExpenses();
