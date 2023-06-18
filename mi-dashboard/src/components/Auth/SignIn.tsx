import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

interface MyFormValues {
	email: string;
	password: string;
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

export default function SignIn() {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [responseMessage, setResponseMessage] =
		useState<MyVariables["responseMessage"]>(false);

	const navigate = useNavigate();

	// @ts-ignore
	const { signin } = useAuth();

	const initialValues: MyFormValues = {
		email: "",
		password: "",
	};

	const validationSchema = Yup.object({
		email: Yup.string().email("Invalid email address").required("Required"),
		password: Yup.string().required("Required"),
	});

	const handleSubmit = async (values: MyFormValues) => {
		setIsSubmitting(false);
		// @ts-ignore
		const response = await signin(values);
		if (response.status !== 200) {
			setResponseMessage(response.response.data.message);
		} else {
			const data = await response;
			setResponseMessage("Logged in");
			navigate("/"); // This line will navigate to the home page
		}
	};

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
											type='email'
											id='email'
											label='Email'
											name='email'
										/>
										<ErrorMessage name='email' component='div' />

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
										<ErrorMessage name='password' component='div' />

										<Button
											type='submit'
											fullWidth
											variant='contained'
											sx={{ mt: 3, mb: 2 }}
											disabled={isSubmitting}
										>
											Sing In
										</Button>
										<Grid container>
											<Grid item>
												<Link href='../signup/' variant='body2'>
													Don't have an account? Sign Up
												</Link>
											</Grid>
										</Grid>
										<Copyright sx={{ mt: 3 }} />
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
