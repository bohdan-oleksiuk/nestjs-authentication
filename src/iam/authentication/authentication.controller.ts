import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { Response } from 'express';
import { Auth } from './decorators/auth.decorator';
import { AuthType } from './enums/auth-type.enum';
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { OtpAuthenticationService } from "./opt-authentication/opt-authentication.service";
import { ActiveUser } from "../decorators/active-user.decorator";
import { ActiveUserData } from "../interfaces/active-user-data.interface";
import { toFileStream } from "qrcode";

@ApiTags('Authentication')
@ApiBearerAuth()
@Auth(AuthType.None)
@Controller('authentication')
export class AuthenticationController {
  constructor(
    private readonly authService: AuthenticationService,
    private readonly otpAuthService: OtpAuthenticationService,
  ) {}

  @ApiOperation({ summary: 'sign-up' })
  @Post('sign-up')
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @ApiOperation({ summary: 'sign-in' })
  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @ApiOperation({ summary: 'sign-in and store token in cookie' })
  @HttpCode(HttpStatus.OK)
  @Post('sign-in-cookie')
  async signInCookies(
    @Res({ passthrough: true }) response: Response,
    @Body() signInDto: SignInDto,
  ) {
    const accessToken = await this.authService.signIn(signInDto);
    response.cookie('accessToken', accessToken, {
      httpOnly: true,
      sameSite: true,
      secure: true,
    });
  }

  @ApiOperation({ summary: 'refresh token' })
  @HttpCode(HttpStatus.OK)
  @Post('refresh-tokens')
  refreshTokens(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshTokens(refreshTokenDto);
  }

  @Auth(AuthType.Bearer)
  @HttpCode(HttpStatus.OK)
  @Post('2fa/generate')
  async generateQrCode(
    @ActiveUser() activeUser: ActiveUserData,
    @Res() response: Response
  ) {
    const { secret, uri } = await this.otpAuthService.generateSecret(
      activeUser.email,
    );
    await this.otpAuthService.enableTfaForUser(activeUser.email, secret);
    response.type( 'png');
    return toFileStream(response, uri);
  }
}
