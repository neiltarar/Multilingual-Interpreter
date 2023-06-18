import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

interface MyFormValues {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	passwordRepeat: string;
}

interface MyVariables {
	responseMessage: boolean | string;
}

function Copyright(props: any) {
	return (
		<Typography
			variant='body2'
			color='text.secondary'
			align='center'
			{...props}
		>
			{"Copyright © "}
			<Link color='inherit' href='https://neil-tarar.com/'>
				Neil Tarar - Blog
			</Link>{" "}
			{new Date().getFullYear()}
			{"."}
		</Typography>
	);
}

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function SignUp() {
	const navigate = useNavigate();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [responseMessage, setResponseMessage] =
		useState<MyVariables["responseMessage"]>(false);

	// @ts-ignore
	const { signup } = useAuth();

	const initialValues: MyFormValues = {
		firstName: "",
		lastName: "",
		email: "",
		password: "",
		passwordRepeat: "",
	};

	const validationSchema = Yup.object({
		firstName: Yup.string().required("Required"),
		lastName: Yup.string().required("Required"),
		email: Yup.string().email("Invalid email address").required("Required"),
		password: Yup.string()
			.min(3, "Password must be at least 8 characters")
			.required("Required"),
		passwordRepeat: Yup.string()
			.oneOf([Yup.ref("password")], "Passwords must match")
			.required("Required"),
	});

	const handleSubmit = (
		values: MyFormValues,
		{ setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
	) => {
		signup(values)
			.then((response: any) => {
				if (response.status !== 200) {
					console.log(response.status);
					setResponseMessage("Account couldn't be created.");
				} else {
					console.log(response.status);
					setResponseMessage("Account Created");
				}
			})
			.catch((error: any) => {
				console.error(error);
				setResponseMessage("An error occurred.");
			})
			.finally(() => {
				setSubmitting(false);
			});
	};

	useEffect(() => {
		if (responseMessage === "Account Created") {
			const timer = setTimeout(() => {
				navigate("/signin");
			}, 2000);
			return () => clearTimeout(timer);
		}
	}, [responseMessage, navigate]);

	return (
		<ThemeProvider theme={defaultTheme}>
			<Grid container component='main' sx={{ height: "100vh" }}>
				<CssBaseline />
				<Grid
					item
					xs={false}
					sm={4}
					md={7}
					sx={{
						backgroundImage:
							"url(https://source.unsplash.com/random?wallpapers)",
						backgroundRepeat: "no-repeat",
						backgroundColor: (t) =>
							t.palette.mode === "light"
								? t.palette.grey[50]
								: t.palette.grey[900],
						backgroundSize: "cover",
						backgroundPosition: "center",
					}}
				/>
				<Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
					<Box
						sx={{
							my: 4,
							mx: 4,
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
						}}
					>
						<Avatar sx={{ bgcolor: "secondary.main" }}>
							<LockOutlinedIcon />
						</Avatar>
						<Typography component='h1' variant='h5'>
							Sign in
						</Typography>
						<Formik
							initialValues={initialValues}
							validationSchema={validationSchema}
							onSubmit={handleSubmit}
						>
							{({ isSubmitting }) => (
								<Box
									sx={{
										my: 1,
										mx: 4,
										display: "flex",
										flexDirection: "column",
										alignItems: "center",
									}}
								>
									<Form>
										<Field
											as={TextField}
											variant='outlined'
											margin='normal'
											fullWidth
											id='firstName'
											label='First Name'
											name='firstName'
										/>
										<ErrorMessage
											name='firstName'
											variant='outlined'
											margin='normal'
											fullWidth
										/>

										<Field
											as={TextField}
											variant='outlined'
											margin='normal'
											fullWidth
											id='lastName'
											label='Last Name'
											name='lastName'
										/>
										<ErrorMessage
											name='lastName'
											variant='outlined'
											margin='normal'
											fullWidth
										/>

										<Field
											as={TextField}
											variant='outlined'
											margin='normal'
											fullWidth
											type='email'
											id='email'
											label='Email'
											name='email'
										/>
										<ErrorMessage
											name='email'
											variant='outlined'
											margin='normal'
											fullWidth
										/>

										<Field
											as={TextField}
											variant='outlined'
											margin='normal'
											fullWidth
											type='password'
											id='password'
											label='Password'
											name='password'
										/>
										<ErrorMessage
											name='password'
											variant='outlined'
											margin='normal'
											fullWidth
										/>

										<Field
											as={TextField}
											variant='outlined'
											margin='normal'
											fullWidth
											type='password'
											id='passwordRepeat'
											label='Password Repeat'
											name='passwordRepeat'
										/>
										<ErrorMessage
											name='passwordRepeat'
											variant='outlined'
											margin='normal'
											fullWidth
										/>

										<Button
											type='submit'
											fullWidth
											variant='contained'
											sx={{ mt: 3, mb: 2 }}
											disabled={isSubmitting}
										>
											Create Account
										</Button>
										<Grid container>
											<Grid item>
												<Link href='../signin/' variant='body2'>
													Already have an accoun? Sign In
												</Link>
											</Grid>
										</Grid>
										<Copyright sx={{ mt: 1 }} />
									</Form>
								</Box>
							)}
						</Formik>
					</Box>
				</Grid>
			</Grid>
		</ThemeProvider>
	);
}
