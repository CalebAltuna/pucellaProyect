from odoo import models, fields

class HrExpense(models.Model):
    _inherit = 'hr.expense'

    # Campo NUEVO y ÚNICO: x_worker_ids
    x_worker_ids = fields.Many2many(
        'hr.employee',
        string='Miembros a pagar',
        help='Empleados involucrados en este gasto'
    )

    custom_note = fields.Text(string='Notas')