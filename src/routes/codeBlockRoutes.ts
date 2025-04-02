import express from 'express';
import codeBlockController from '../controllers/codeController';

const router = express.Router();

//TODO :: Finish codeBlock routes - after controller implementation
router.get('/all',codeBlockController.getAllCodeBlocks)
router.get('/:id',codeBlockController.getCodeBlockById)
router.post('/',codeBlockController.createCodeBlock)
router.put('/:id',codeBlockController.updateCodeBlock)
router.delete('/:id',codeBlockController.delteCodeBlock)

export default router;