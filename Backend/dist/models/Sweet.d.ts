import mongoose, { Document } from "mongoose";
export interface ISweet extends Document {
    name: string;
    category: string;
    price: number;
    quantity: number;
    description?: string;
    imageUrl?: string;
    createdAt: Date;
    updatedAt: Date;
}
declare const Sweet: mongoose.Model<ISweet, {}, {}, {}, mongoose.Document<unknown, {}, ISweet, {}, {}> & ISweet & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default Sweet;
//# sourceMappingURL=Sweet.d.ts.map