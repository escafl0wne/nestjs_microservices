import { Inject, Injectable } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationRepository } from './reservations.repository';
import { PaymentsService } from 'apps/payments/src/payments.service';
import { PAYMENTS_SERVICE } from 'libs/common';
import { ClientProxy } from '@nestjs/microservices';
import { map } from 'rxjs';

@Injectable()
export class ReservationsService {
  constructor(private readonly reservationRepository:ReservationRepository, @Inject(PAYMENTS_SERVICE) private readonly paymentsService:ClientProxy){}
  async create(createReservationDto: CreateReservationDto,userId:string) {
    console.log(createReservationDto)
    return this.paymentsService.send('create_charge',createReservationDto.charge).pipe(
      map( (res)=>{
       
          console.log({res})
          return this.reservationRepository.create({...createReservationDto,invoiceId:res.id,timesStamp:new Date(),userId})
          
         
      })
    )
    
    
  }

  async findAll() {
  return this.reservationRepository.find({});
  }

  findOne(_id:string) {
    return this.reservationRepository.findOne({_id});
  }

  update(_id:string, updateReservationDto: UpdateReservationDto) {
    return this.reservationRepository.findOneAndUpdate({_id},{$set:updateReservationDto});
  }

  remove(_id:string) {
    return this.reservationRepository.findOneAndDelete({_id})
  }
}
