import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';

import { UserDocument, UserSchema } from './models/users.schema';
import { DatabaseModule, LoggerModule } from '@app/common';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([
      { name: UserDocument.name, schema: UserSchema },
    ]),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema:Joi.object({
        MONGODB_URL:Joi.string().required(),
        
      }),
      envFilePath:'./apps/auth/.env'
     
    }),
    LoggerModule
  ],
  controllers: [UsersController],
  providers: [UsersService,UsersRepository],
  exports:[UsersService,UsersRepository]
})
export class UsersModule {}
