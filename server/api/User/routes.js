import { Router } from 'express';
import service from './User.service';

export default Router()
  .get('/', (req, res) => res.json(service.getAll()))
  .get('/:id', (req, res) => res.json(service.first(x => true)))
  .post('/', (req, res) => res.json(service.save(req.body)))
  .put('/:id', (req, res) => res.json(service.update(req.params.id, req.body)))
  .delete('/:id', (req, res) => res.json(service.delete(req.params.id)));