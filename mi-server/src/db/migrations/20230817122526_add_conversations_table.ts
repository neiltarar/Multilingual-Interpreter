import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
	const query = `
        -- create conversations table
        CREATE TABLE IF NOT EXISTS conversations 
    (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE, -- ensures that if a user is deleted, their conversations are deleted as well
        topic VARCHAR(255), 
        created_at TIMESTAMPTZ DEFAULT NOW()
    );
    `;

	return await knex.raw(query);
}

export async function down(knex: Knex): Promise<void> {
	const query = `
        -- delete conversations table
        DROP TABLE IF EXISTS conversations;
    `;

	return await knex.raw(query);
}
