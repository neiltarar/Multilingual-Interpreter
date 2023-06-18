export const isValidEmail = (email: string) => {
	const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
	return regex.test(email);
};

export const isMatchingPasswords = (password1: string, password2: string) => {
	return password1 === password2;
};
