begin;

-- The remote 20260331163203 migration created an early RPC that was superseded
-- by the 20260401124409 write-model migration. The final schema is reproduced
-- by the later migrations, so this local file only preserves the remote version
-- history for migration consistency.

commit;
