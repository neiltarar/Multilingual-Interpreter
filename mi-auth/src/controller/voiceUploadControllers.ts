import http from "http";

export const uploadVoice = async (req: any, res: any): Promise<any> => {
	console.log("hit api route");
	const proxy = await http.request(
		{
			host: "localhost",
			port: 5000,
			path: "/api/upload",
			method: "POST",
			headers: req.headers,
		},
		(response) => {
			response.pipe(res);
		}
	);
	req.pipe(proxy);
};
