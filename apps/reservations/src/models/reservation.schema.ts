import { AbstractDocument } from "@app/common/database/abstract.schema";
import { SchemaFactory } from "@nestjs/mongoose";
import { Prop, Schema } from "@nestjs/mongoose/dist/decorators";


@Schema({
    versionKey:false
})
export class ReservationDocument extends AbstractDocument {
    @Prop()
    timesStamp:Date;
    @Prop()
    startDate:Date;
    @Prop()
    endDate:Date;
    @Prop()
    userId:string;
    @Prop()
    placeId:string
    @Prop()
    invoiceId:string
}
export const ReservationSchema=SchemaFactory.createForClass(ReservationDocument)