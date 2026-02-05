from odoo import models, fields

class Ataza(models.Model):
    _name = 'task_tracer.ataza'
    _description = 'Ataza kudeaketa'

    izena = fields.Char(string='Tarea', required=True)
    
    # En Odoo res.users es la tabla estándar de usuarios
    user_id = fields.Many2one('res.users', string='Egilea (Creador)')
    arduraduna_id = fields.Many2one('res.users', string='Arduraduna (Responsable)')
    
    # Usamos Selection para replicar tu Enum Egoera
    egoera = fields.Selection([
        ('egiten', 'Egiten'),
        ('eginda', 'Eginda')
    ], string='Egoera', default='egiteko')
    
    data = fields.Date(string='Data')
    laravel_id = fields.Integer(string='Laravel ID Reference')