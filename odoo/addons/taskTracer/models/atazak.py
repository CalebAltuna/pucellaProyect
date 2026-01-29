from odoo import models, fields

class Ataza(models.Model):
    _name = 'task_tracer.ataza'
    _description = 'Ataza Laravel'

    izena = fields.Char(string='Izena / Tarea', required=True)
    
    # Estados exactos de tu Enum de Laravel
    egoera = fields.Selection([
        ('egiteko', 'Egiteko'),
        ('egiten', 'Egiten'),
        ('eginda', 'Eginda'),
        ('atzeratua', 'Atzeratua')
    ], string='Egoera', default='egiteko')
    
    data = fields.Date(string='Data')
    
    # ID para saber cuál es en Laravel
    laravel_id = fields.Integer(string='Laravel ID', index=True)
    
    # Relaciones (Opcional: Si quieres mapear usuarios)
    # user_id = fields.Many2one('res.users', string='Egilea')