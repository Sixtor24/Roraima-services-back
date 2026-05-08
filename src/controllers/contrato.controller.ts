import { Request, Response } from 'express';
import { contratoService } from '../services/contrato.service';
import { generateContratoPdf } from '../services/pdfService';

export class ContratoController {
  async create(req: Request, res: Response) {
    const contrato = await contratoService.create(req.body);
    res.status(201).json(contrato);
  }

  async getAll(_req: Request, res: Response) {
    const contratos = await contratoService.findAll();
    res.json(contratos);
  }

  async getActivos(_req: Request, res: Response) {
    const contratos = await contratoService.findActivos();
    res.json(contratos);
  }

  async getById(req: Request, res: Response) {
    const contrato = await contratoService.findById(Number(req.params.id));
    res.json(contrato);
  }

  async finalizar(req: Request, res: Response) {
    const updated = await contratoService.finalizar(Number(req.params.id), req.body);
    res.json(updated);
  }

  async getPdf(req: Request, res: Response) {
    const contrato = await contratoService.findById(Number(req.params.id));
    const pdfBuffer = await generateContratoPdf(contrato);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="contrato-${contrato.id}.pdf"`);
    res.send(pdfBuffer);
  }
}

export const contratoController = new ContratoController();
