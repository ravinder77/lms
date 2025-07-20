import { LoginSchemaInput, RegisterSchemaInput } from 'src/schema/authSchema.js';
import UserModel from '../models/userModel.js';
import { Request, Response } from 'express';
import { jwtService } from 'src/index.js';
import RefreshToken from 'src/models/refreshTokenModel.js';

export const registerHandler = async (
  req: Request,
  res: Response
) => {
  const { email, password, firstName, lastName, role } =
    req.body as RegisterSchemaInput;

  const body = req.body as RegisterSchemaInput;

  const existingUser = await UserModel.findOne({ email: body.email });
  if (existingUser) {
		res.status(409).json({ message: 'User already exists' });
		return;
  }

  try {
    const user = new UserModel({
      email,
      password,
      firstName,
      lastName,
      role,
		});

			await user.save();
		

		const tokens = jwtService.generateTokenPair({
			userId: user._id.toString(),
			email: user.email,
			role: user.role,
		})

		await RefreshToken.create({
			user: user._id,
			token: tokens.refreshToken,
			expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
		})
	

		res.cookie('refreshToken', tokens.refreshToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			maxAge: 7 * 24 * 60 * 60 * 1000,
			sameSite: 'strict',
		})

		res.status(201).json({
			success: true,
			data: {
			  user: user.toJSON(),
				accessToken: tokens.accessToken,
			}
		});
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

export const loginHandler = async (req: Request, res: Response) => {

	try {
		const { email, password } = req.body as LoginSchemaInput;

		const user = await UserModel.findOne({ email });

		if (!user) {
			res.status(404).json({ message: 'User not found' });
			return;
		}

		const isPasswordValid = await user.comparePassword(password);

		if (!isPasswordValid) {
			res.status(401).json({ message: 'Invalid password' });
			return;
		}

		const tokens = jwtService.generateTokenPair({
			userId: user._id.toString(),
			email: user.email,
			role: user.role,
		})

		await RefreshToken.create({
			user: user._id,
			token: tokens.refreshToken,
			expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
		})

    // 
		res.cookie('refreshToken', tokens.refreshToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			maxAge: 7 * 24 * 60 * 60 * 1000,
			sameSite: 'strict',
		})

		res.status(200).json({
			success: true,
			data: {
				user: user.toJSON(),
				accessToken: tokens.accessToken,
			}
		})

	} catch (error) {
		console.log(error);
		res.status(500).json({ message: 'Internal server error' });
	}
};
