# Topic 11: Transactions & Concurrency — Notes & Concepts

## 1. ACID Properties
- **Atomicity**: All operations in a transaction succeed or all fail together.
- **Consistency**: The database transitions from one valid state to another, satisfying all constraints.
- **Isolation**: Concurrent transactions execute without interfering with one another.
- **Durability**: Once committed, changes survive system crashes or power failures.

---

## 2. PostgreSQL Transaction Syntax
```sql
BEGIN; -- or BEGIN TRANSACTION;

UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;

COMMIT; -- or ROLLBACK;
```

---

## 3. Savepoints (Nested Rollbacks)
```sql
BEGIN;
INSERT INTO logs VALUES ('Step 1');
SAVEPOINT s1;

-- Risky operation
UPDATE records SET status = 'migrated';
-- Oops, encountered error!
ROLLBACK TO SAVEPOINT s1;

-- Clean finish
COMMIT;
```

---

## 4. SQL Isolation Levels
1. `READ UNCOMMITTED` (PostgreSQL treats this as `READ COMMITTED`)
2. `READ COMMITTED` (PostgreSQL default: statements see snapshots at start of each statement)
3. `REPEATABLE READ` (Transactions see snapshots at start of entire transaction)
4. `SERIALIZABLE` (Strictest level: guarantees serializable order, throws serialization failures if concurrency conflict detected)
