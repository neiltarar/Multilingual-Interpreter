export interface UserDto {
	firstName: string;
	lastName: string;
	email: string;
	passwordHash: string;
	password?: string | any;
	passwordRepeat?: string | any;
}
