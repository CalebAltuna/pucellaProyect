from odoo import models, fields

class Task(models.Model):
    _name = 'task.tracker'
    _description = 'Task Tracker'
    # 
    # 
    name = fields.Char(String='Ataza', required=True)
    done = fields.Boolean(string='Eginda', default=False)