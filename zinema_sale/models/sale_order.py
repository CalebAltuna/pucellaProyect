from odoo import models, fields

class SaleOrder(models.Model):

    _inherit = 'sale.order.line'

    pelikula_id = fields.Many2one('zinea.pelikula', string='Pelikula')
