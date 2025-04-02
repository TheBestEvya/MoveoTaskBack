import { Request, Response } from 'express';
import  {IBlock , codeBlock} from '../models/codeBlockModel';


const createCodeBlock = async (req: Request, res: Response) => {
    const { code, title, solution } = req.body;
    try {
        const newCodeBlock = await codeBlock.create({ code, title, solution });
        res.status(201).json(newCodeBlock);
    } catch (error) {
        res.status(500).json({ message: 'Error creating code block', error });
    }
}
const getAllCodeBlocks = async (req: Request, res: Response) => {
    try {
        const codeBlocks = await codeBlock.find();
        res.status(200).json(codeBlocks);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching code blocks', error });
    }

}
const getCodeBlockById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const codeBlockObj  = await codeBlock.findById(id);
        if (!codeBlockObj) {
            return res.status(404).json({ message: 'Code block not found' });
        }
        res.status(200).json(codeBlockObj);
    }catch (error) {
        res.status(500).json({ message: 'Error fetching code block', error });
    }
}

const updateCodeBlock = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { code, title, solution } = req.body;
    try {
        const updatedCodeBlock = await codeBlock.findByIdAndUpdate(id, { code, title, solution }, { new: true });
        if (!updatedCodeBlock) {
            return res.status(404).json({ message: 'Code block not found' });
        }
        res.status(200).json(updatedCodeBlock);
    } catch (error) {
        res.status(500).json({ message: 'Error updating code block', error });
    }
}
const delteCodeBlock = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const deletedCodeBlock = await codeBlock.findByIdAndDelete(id);
        if (!deletedCodeBlock) {
            return res.status(404).json({ message: 'Code block not found' });
        }
        res.status(200).json({ message: 'Code block deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting code block', error });
    }
}

export default {createCodeBlock , getAllCodeBlocks , getCodeBlockById , updateCodeBlock , delteCodeBlock};