from odoo import models, fields, api

class HrEmployee(models.Model):
    """ Heredamos el empleado para que Odoo sepa a qué piso pertenece """
    _inherit = 'hr.employee'

    pisua_id = fields.Many2one(
        'pisua.pisua', 
        string='Piso asignado'
    )

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

    @api.onchange('pisua_id')
    def _onchange_pisua_id(self):
        """
        Al seleccionar un piso, rellena automáticamente los trabajadores 
        que están asignados a ese piso.
        """
        if self.pisua_id:
            employees = self.env['hr.employee'].search([('pisua_id', '=', self.pisua_id.id)])
            self.x_worker_ids = [(6, 0, employees.ids)]
        else:
            self.x_worker_ids = [(5, 0, 0)]