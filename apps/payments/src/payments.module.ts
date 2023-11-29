import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import * as Joi from 'joi';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from '@app/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { NOTIFICATION_SERVICE } from 'libs/common';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().required(),
        STRIPE_API_KEY: Joi.string().required(),
      }),
      envFilePath: './apps/payments/.env',
    }),
    LoggerModule,
    ClientsModule.registerAsync([{
      name: NOTIFICATION_SERVICE,
      useFactory:(configService:ConfigService)=>({
        transport: Transport.TCP,
        options: {
          host:'0.0.0.0',
          port:configService.get("NOTIFICATION_PORT")
        }
      })
      
    }])
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
