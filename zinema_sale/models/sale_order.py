from odoo import models, fields

class SaleOrder(models.Model):

    _inherit = 'sale.order'

    pelikula_id = fields.Many2one('zinema.pelikula', string='Pelikula')
