# Topic 11: Transactions & Concurrency — Exercises

> [!NOTE]
> Write your queries in `attempts.sql` and execute them against PostgreSQL (`sql_practice`).
> Share your query with Antigravity for evaluation.

---

### Question 1 (Level 1: Basic Transaction with COMMIT)
Write a transaction that:
1. Starts a transaction block (`BEGIN`).
2. Deducts `$50,000` from the Business department budget (`budget = budget - 50000`).
3. Adds `$50,000` to the Computer Science department budget (`budget = budget + 50000`).
4. Commits the transaction (`COMMIT`).

---

### Question 2 (Level 2: Transaction Abort with ROLLBACK)
Write a transaction that:
1. Starts a transaction (`BEGIN`).
2. Increases all instructor salaries by `20%`.
3. Verifies the updated salaries within the transaction.
4. Rolls back the transaction (`ROLLBACK`) so no changes persist to the database.

---

### Question 3 (Level 3: Using SAVEPOINTs)
Demonstrate partial rollback using a `SAVEPOINT`:
1. `BEGIN;`
2. Insert a new department `'AI'`, `'Artificial Intelligence'`, `'Turing Hall'`, `500000.00`.
3. Create a `SAVEPOINT sp_ai_created;`
4. Attempt to insert an invalid instructor with a negative salary (`salary = -50000`) or invalid department.
5. Rollback to the savepoint (`ROLLBACK TO SAVEPOINT sp_ai_created;`).
6. `COMMIT;` and verify that the AI department exists but no corrupted instructor record was created.

---

### Question 4 (Level 4: Transaction Isolation Levels)
Write a query setting the transaction isolation level to `SERIALIZABLE` and execute a multi-table consistency check across department budgets vs instructor salary totals.
