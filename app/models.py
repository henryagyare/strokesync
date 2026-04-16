# UserAccount Class
class UserAccount(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), nullable=False, unique=True)
    password = db.Column(db.String(120), nullable=False)  # Consider hashing this in production
    first_name = db.Column(db.String(80), nullable=False)
    last_name = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(120), nullable=False, unique=True)
    role = db.Column(db.String(50), nullable=False)

# Patients Class
class Patient(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    fullname = db.Column(db.String(300))
    age = db.Column(db.Integer)
    sex = db.Column(db.String(300))
    arrival = db.Column(db.Integer)
    systolic = db.Column(db.Integer)
    diastolic = db.Column(db.Integer)
    heart_rate = db.Column(db.Integer)
    temperature = db.Column(db.Integer)    
    oxygen_saturation = db.Column(db.Integer)
    glucose = db.Column(db.Integer)
    current_medications = db.Column(db.String(300))
    allergies = db.Column(db.String(300))
    stroke_history = db.Column(db.String(500))
    medical_history = db.Column(db.String(500))
    radiologist_notes = db.Column(db.String(500))
    nhiss_score = db.Column(db.Integer)
    diagnosis = db.Column(db.String(500))
    treatment = db.Column(db.String(500))
    neuro_approved = db.Column(db.Boolean, default=False)
    ct_scan_filename = db.Column(db.String(255))

#appointment scheduling with neurologists. 
class Appointment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('patient.id'), nullable=False)
    datetime = db.Column(db.String(100), nullable=False)
    purpose = db.Column(db.String(300), nullable=False)
    notes = db.Column(db.String(500))
    status = db.Column(db.String(50), default='Scheduled')

    patient = db.relationship('Patient', backref='appointments')

