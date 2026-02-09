from odoo import models, fields

class ProjectTask(models.Model):
    _inherit = 'event.event'

    baliabide_tresna_id = fields.Many2one(
        'logistika.materiala',
        string='Erabilitako tresna'
    )