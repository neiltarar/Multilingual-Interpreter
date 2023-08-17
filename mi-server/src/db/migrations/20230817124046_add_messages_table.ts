import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
	const query = `
        -- create messages table
        CREATE TABLE IF NOT EXISTS messages 
        (
            id SERIAL PRIMARY KEY,
            conversation_id INTEGER REFERENCES conversations(id) ON DELETE CASCADE, -- if a conversation is deleted, its associated messages will also be deleted
            role VARCHAR(50) NOT NULL CHECK (role IN ('user', 'system', 'assistant')), -- included 'assistant' to differentiate from 'system' messages
            content TEXT NOT NULL,
            created_at TIMESTAMPTZ DEFAULT NOW()
        );
    `;

	return await knex.raw(query);
}

export async function down(knex: Knex): Promise<void> {
	const query = `
        -- delete messages table
        DROP TABLE IF EXISTS messages;
    `;

	return await knex.raw(query);
}
