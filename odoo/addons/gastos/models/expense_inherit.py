from odoo import models, fields
# --- FICHA DEL EMPLEADO ---
class HrEmployee(models.Model):
    _inherit = 'hr.employee'  
    pisua_id = fields.Many2one('pisua.pisua', string='Piso asignado')
# --- FICHA DE GASTOS ---
class HrExpense(models.Model):
    _inherit = 'hr.expense'  
    pisua_id = fields.Many2one('pisua.pisua', string='Piso')
    x_worker_ids = fields.Many2many('hr.employee', string='Miembros a pagar')
    custom_note = fields.Text(string='Notas')