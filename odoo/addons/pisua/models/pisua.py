from odoo import models, fields

class Pisua(models.Model):
    _name = 'pisua.pisua'
    _inherit = ['mail.thread', 'mail.activity.mixin'] 
    _description = 'Gestión de Pisos'

    name = fields.Char(string='Nombre del Piso', required=True)
    code = fields.Char(string='Código Referencia')
    coordinator_id = fields.Many2one('res.users', string='Coordinador')

    expense_ids = fields.One2many(
        'hr.expense', 
        'pisua_id', 
        string='Gastos del Piso'
    )