import pkg from "pg";

const { Pool } = pkg;

const pool = new Pool({
	user: process.env.DB_USER,
	host: process.env.DB_HOST,
	database: process.env.DB_NAME,
	password: process.env.DB_PASSWORD,
	port: Number(process.env.DB_PORT),
});

const db = async (sqlQuery: string, values: any) => {
	const client = await pool.connect();
	try {
		const res = await client.query(sqlQuery, values);
		return res.rows;
	} catch (error) {
		console.log(error);
	} finally {
		client.release();
	}
};

export default db;
