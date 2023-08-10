import jwt from "jsonwebtoken";

interface User {
	id: number;
	first_name: string;
	last_name: string;
	email: string;
	password_hash: string;
	is_activated: boolean;
	unlimited_req: boolean;
	total_req_left: number;
}
export const verifyJWTToken = (token: string, secret: string): Promise<User> =>
	new Promise<User>((resolve, reject) => {
		jwt.verify(token, secret, (err, userData) => {
			if (err) {
				reject(err);
			} else {
				resolve(userData as User);
			}
		});
	});
