import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
	const query = `-- alter use table to limit api requests
        ALTER TABLE IF EXISTS users
        ADD COLUMN IF NOT EXISTS unlimited_req BOOLEAN DEFAULT false,
        ADD COLUMN IF NOT EXISTS total_req_left INTEGER DEFAULT 30;
    `;
	return await knex.raw(query);
}

export async function down(knex: Knex): Promise<void> {
	const query = `-- reverse the alteration
        ALTER TABLE IF EXISTS users
        DROP COLUMN IF EXISTS unlimited_req,
        DROP COLUMN IF EXISTS total_req_left;
    `;
	return await knex.raw(query);
}
