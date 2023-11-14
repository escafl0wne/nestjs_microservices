import { AbstractDocument } from "@app/common/database/abstract.schema";
import { SchemaFactory } from "@nestjs/mongoose";
import { Prop, Schema } from "@nestjs/mongoose/dist/decorators";


@Schema({
    versionKey:false
})
export class UserDocument extends AbstractDocument {
  @Prop({
    unique: true,
   
})
    email:string;
    @Prop()
    password:string;
}
export const UserSchema=SchemaFactory.createForClass(UserDocument)