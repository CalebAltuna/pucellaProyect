from odoo import models, fields

class HrExpense(models.Model):
    _inherit = 'hr.expense'
    pisua_id = fields.Many2one(
        'pisua.pisua',       
        string='Piso',
        help='Piso al que pertenece este gasto'
    )
    x_worker_ids = fields.Many2many(
        'hr.employee',
        string='Miembros a pagar',
        help='Empleados involucrados en este gasto'
    )
    custom_note = fields.Text(string='Notas')