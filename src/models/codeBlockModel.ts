import mongoose, { Document, Schema } from 'mongoose';

export interface IBlock{
id: mongoose.Types.ObjectId;
code: string;
title: string;
solution: string;
}
const codeBlockSchema = new Schema<IBlock>({
    code: {
        type: String
    },
    title: {
        type: String,
        required: true,
    },
    solution: {
        type: String,
        required: true,
    },
})

export const codeBlock = mongoose.model<IBlock>('Code-Block', codeBlockSchema);