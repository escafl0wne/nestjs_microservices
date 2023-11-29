import { Module } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { DatabaseModule, LoggerModule } from '@app/common';
import { ReservationRepository } from './reservations.repository';
import {
  ReservationDocument,
  ReservationSchema,
} from './models/reservation.schema';
import { ConfigModule, ConfigService } from '@nestjs/config';

import * as Joi from 'joi';

import { ClientsModule, Transport } from '@nestjs/microservices';
import { AUTH_SERVICE, PAYMENTS_SERVICE } from 'libs/common/constants/services';



@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([
      { name: ReservationDocument.name, schema: ReservationSchema },
    ]),
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema:Joi.object({
        MONGODB_URL:Joi.string().required(),
        PORT:Joi.number().required(),
        AUTH_PORT:Joi.number().required(),
        PAYMENTS_PORT:Joi.number().required(),
      }),
      envFilePath:'./apps/reservations/.env'
     
    }),

    ClientsModule.registerAsync([{
      name: AUTH_SERVICE,
      useFactory: (configService: ConfigService) => ({
        transport: Transport.TCP,
        options: {
          host:'0.0.0.0',
          port:configService.get("AUTH_PORT")
        }
      }),
      inject: [ConfigService]
    },{
      name: PAYMENTS_SERVICE,
      useFactory: (configService: ConfigService) => ({
        transport: Transport.TCP,
        options: {
          host:'0.0.0.0',
          port:configService.get("PAYMENTS_PORT")
        }
      }),  inject: [ConfigService]
    }]),
  ],
  controllers: [ReservationsController],
  providers: [ReservationsService, ReservationRepository],
})
export class ReservationsModule {}
