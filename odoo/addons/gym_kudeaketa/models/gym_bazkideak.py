from odoo import models, fields

class GymBazkideak(models.Model):
    _name = 'gym.bazkideak'
    _description = 'Gym Bazkideak'
    
    # defino los campos por tipos.
    name = fields.Char(string='name', required=True)
    birth_date = fields.Date(string='birth_date', required=True)
    member_number =  fields.Char(string='member_number', required=True)
    subscription_type = fields.Selection([
        ('monthly', 'Hilerokoa'),
        ('yearly', 'Urtekoa'),
        ('student', 'Ikaslea'),
], string='Harpidetza Mota', default='monthly')
    # pongo ordenadamente el tema de los selections y tal. Copiado del pdf...
    active = fields.Boolean(string='active', required=True)
    notes = fields.Text(string = 'notes')