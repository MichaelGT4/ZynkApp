import { useState } from 'react';
import {
	Box,
	Button,
	TextField,
	useMediaQuery,
	Typography,
	useTheme,
} from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setLogin } from '../../context';
import Dropzone from 'react-dropzone';
import FlexBetween from '../../components/FlexBetween';
import axiosInstance from '../../utils/axios';

const registerSchema = yup.object().shape({
	firstName: yup.string().required('required'),
	lastName: yup.string().required('required'),
	email: yup.string().email('Invalid email').required('required'),
	password: yup.string().required('required'),
	occupation: yup.string().required('required'),
	picture: yup.string().required('required'),
});

const loginSchema = yup.object().shape({
	email: yup.string().email('Invalid email').required('required'),
	password: yup.string().required('required'),
});

const initialValuesRegister = {
	firstName: '',
	lastName: '',
	email: '',
	password: '',
	occupation: '',
	picture: '',
};

const initialValuesLogin = {
	email: '',
	password: '',
};

const Form = () => {
	const [pageType, setPageType] = useState('login');
	const { palette } = useTheme();
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const isNonMobileScreens = useMediaQuery('(min-width:600px)');
	const isLogged = pageType === 'login';
	const isRegistered = pageType === 'register';

	const register = async (values, onSubmitProps) => {
		const formData = new FormData();
		for (let value in values) {
			formData.append(value, values[value]);
		}
		formData.append('picturePath', values.picture.name);

		axiosInstance.post('/auth/register', formData).then((res) => {
			const savedUser = res.data;
			onSubmitProps.resetForm();

			if (savedUser) {
				setPageType('login');
			}
		});
		// const savedUser = await savedUserResponse.json();
	};

	const login = async (values, onSubmitProps) => {
		axiosInstance
			.post('/auth/login', JSON.stringify(values), {
				headers: {
					'Content-Type': 'application/json',
				},
			})
			.then((res) => {
				const loggedIn = res.data;
				onSubmitProps.resetForm();

				if (loggedIn) {
					dispatch(
						setLogin({
							user: loggedIn.user,
							token: loggedIn.token,
						})
					);
					navigate('/home');
				}
			});
	};

	const handleFormSubmit = async (values, onSubmitProps) => {
		if (isLogged) await login(values, onSubmitProps);
		if (isRegistered) await register(values, onSubmitProps);
	};
	return (
		<Formik
			onSubmit={handleFormSubmit}
			initialValues={
				isLogged ? initialValuesLogin : initialValuesRegister
			}
			validationSchema={isLogged ? loginSchema : registerSchema}
		>
			{({
				values,
				errors,
				touched,
				handleBlur,
				handleChange,
				handleSubmit,
				setFieldValue,
				resetForm,
			}) => (
				<form onSubmit={handleSubmit}>
					<Box
						display="grid"
						gap="30px"
						gridTemplateColumns="repeat(4, minmax(0,1fr))"
						sx={{
							'& > div': {
								gridColumn: isNonMobileScreens
									? undefined
									: 'span 4',
							},
						}}
					>
						{isRegistered && (
							<>
								<TextField
									label="First Name"
									onBlur={handleBlur}
									onChange={handleChange}
									value={values.firstName}
									name="firstName"
									error={
										Boolean(touched.firstName) &&
										Boolean(errors.firstName)
									}
									helperText={
										touched.firstName && errors.firstName
									}
									sx={{ gridColumn: 'span 2' }}
								/>
								<TextField
									label="Last Name"
									onBlur={handleBlur}
									onChange={handleChange}
									value={values.lastName}
									name="lastName"
									error={
										Boolean(touched.lastName) &&
										Boolean(errors.lastName)
									}
									helperText={
										touched.lastName && errors.lastName
									}
									sx={{ gridColumn: 'span 2' }}
								/>
								<TextField
									label="Location"
									onBlur={handleBlur}
									onChange={handleChange}
									value={values.location}
									name="location"
									error={
										Boolean(touched.location) &&
										Boolean(errors.location)
									}
									helperText={
										touched.location && errors.location
									}
									sx={{ gridColumn: 'span 2' }}
								/>
								<TextField
									label="Occupation"
									onBlur={handleBlur}
									onChange={handleChange}
									value={values.occupation}
									name="occupation"
									error={
										Boolean(touched.occupation) &&
										Boolean(errors.occupation)
									}
									helperText={
										touched.occupation && errors.occupation
									}
									sx={{ gridColumn: 'span 2' }}
								/>
								<Box
									gridColumn="span 4"
									border={`1px solid ${palette.neutral.medium}`}
									borderRadius="5px"
									p="1rem"
								>
									<Dropzone
										acceptedFiles=".jpg, .png, .jpeg"
										multiple="false"
										onDrop={(acceptedFiles) =>
											setFieldValue(
												'picture',
												acceptedFiles[0]
											)
										}
									>
										{({ getRootProps, getInputProps }) => (
											<Box
												{...getRootProps()}
												border={`2px dashed ${palette.primary.main}`}
												p="1rem"
												sx={{
													'&:hover': {
														cursor: 'pointer',
													},
												}}
											>
												<input {...getInputProps()} />
												{!values.picture ? (
													<p>Add Picture Here</p>
												) : (
													<FlexBetween>
														<Typography>
															{
																values.picture
																	.name
															}
														</Typography>
														<EditOutlinedIcon />
													</FlexBetween>
												)}
											</Box>
										)}
									</Dropzone>
								</Box>
							</>
						)}

						<TextField
							label="Email"
							onBlur={handleBlur}
							onChange={handleChange}
							value={values.email}
							name="email"
							error={
								Boolean(touched.email) && Boolean(errors.email)
							}
							helperText={touched.email && errors.email}
							sx={{ gridColumn: 'span 4' }}
						/>
						<TextField
							label="Password"
							type="password"
							onBlur={handleBlur}
							onChange={handleChange}
							value={values.password}
							name="password"
							error={
								Boolean(touched.password) &&
								Boolean(errors.password)
							}
							helperText={touched.password && errors.password}
							sx={{ gridColumn: 'span 4' }}
						/>
					</Box>

					<Box>
						<Button
							fullWidth
							type="submit"
							sx={{
								m: '2rem 0',
								p: '1rem',
								backgroundColor: palette.primary.main,
								color: palette.background.alt,
								'&:hover': { color: palette.primary.main },
							}}
						>
							{isLogged ? 'LOGIN' : 'REGISTER'}
						</Button>
						<Typography
							onClick={() => {
								setPageType(isLogged ? 'register' : 'login');
								resetForm();
							}}
							sx={{
								textDecoration: 'underline',
								color: palette.primary.main,
								'&:hover': {
									cursor: 'pointer',
									color: palette.primary.light,
								},
							}}
						>
							{isLogged
								? "Doesn't have an account? Sign Up Here"
								: 'Already have an account? Log In Here'}
						</Typography>
					</Box>
				</form>
			)}
		</Formik>
	);
};

export default Form;
