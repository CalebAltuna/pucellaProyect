from odoo import models, fields

class SaleOrderLine(models.Model):
    _inherit = 'sale.order.line'
    
    member_id = fields.Many2one('gym.bazkideak', string='Gym Bazkideak')