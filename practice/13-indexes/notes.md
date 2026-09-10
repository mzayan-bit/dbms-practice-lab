# Topic 13: Indexes & Query Optimization — Notes & Concepts

## 1. Index Types in PostgreSQL
- **B-Tree (Default)**: Best for equality (`=`), range queries (`<`, `<=`, `>`, `>=`, `BETWEEN`), and sorting (`ORDER BY`).
- **Hash**: Fast equality (`=`) lookups only.
- **GIN / GiST**: Text search, JSONB, arrays, and geometric data.
- **BRIN**: Block Range Index for massive, physically ordered datasets (e.g. time-series).

---

## 2. Reading EXPLAIN and EXPLAIN ANALYZE

```sql
EXPLAIN ANALYZE SELECT * FROM students WHERE email = 'alice.smith@student.edu';
```

- **`EXPLAIN`**: Shows estimated query plan without executing the query.
- **`EXPLAIN ANALYZE`**: Actually runs the query and outputs actual execution times, loop counts, and memory/buffer usage.

### Key Plan Nodes:
- **`Seq Scan`**: Reads entire table from disk sequentially.
- **`Index Scan`**: Traverses index tree and fetches exact corresponding table tuples.
- **`Bitmap Index Scan`**: Collects matching page pointers in bitmap before scanning table heap.
- **`Index Only Scan`**: Fastest! All requested columns are found inside the index itself without visiting table pages.

---

## 3. Best Practices & Pitfalls
- **Don't index every column**: Indexes accelerate reads but slow down `INSERT`, `UPDATE`, and `DELETE`.
- **Function wrapping breaks index usage**: `WHERE LOWER(email) = '...'` cannot use standard index on `email`. You must create an expression index `CREATE INDEX ON students (LOWER(email));`.
