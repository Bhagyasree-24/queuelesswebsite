const mongoose = require('mongoose');

const holidaySchema = new mongoose.Schema(
  {
    date: {
      type: String,
      required: true,
      match: /^\d{4}-\d{2}-\d{2}$/
    },
    name: {
      type: String,
      trim: true
    }
  },
  { _id: false }
);

const officeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      required: true,
      enum: ["REVENUE", "DEVELOPMENT"],
    },

    description: {
      type: String,
      trim: true,
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    mandal: {
      type: String,
      required: true,
      trim: true,
    },

    district: {
      type: String,
      required: true,
      trim: true,
    },

    state: {
      type: String,
      required: true,
      trim: true,
    },

    // Token timing configuration. Defaults preserve existing Office records.
    workingDays: {
      type: [Number],
      default: [1, 2, 3, 4, 5], // Monday-Friday; Sunday=0
      validate: {
        validator: (days) => days.every((day) => Number.isInteger(day) && day >= 0 && day <= 6),
        message: 'workingDays values must be integers from 0 (Sunday) to 6 (Saturday)'
      }
    },

    openingTime: {
      type: String,
      default: '10:00',
      match: /^([01]\d|2[0-3]):[0-5]\d$/
    },

    closingTime: {
      type: String,
      default: '17:00',
      match: /^([01]\d|2[0-3]):[0-5]\d$/
    },

    tokenCutoffMinutes: {
      type: Number,
      min: 0,
      max: 180,
      default: 30
    },

    holidays: {
      type: [holidaySchema],
      default: []
    }
  },
  { timestamps: true }
);

officeSchema.pre('validate', function validateOfficeHours(next) {
  const toMinutes = (value) => {
    if (typeof value !== 'string' || !/^([01]\d|2[0-3]):[0-5]\d$/.test(value)) return null;
    const [hours, minutes] = value.split(':').map(Number);
    return hours * 60 + minutes;
  };
  const opening = toMinutes(this.openingTime);
  const closing = toMinutes(this.closingTime);
  if (opening !== null && closing !== null && closing <= opening) {
    this.invalidate('closingTime', 'closingTime must be later than openingTime');
  }
  next();
});

const Office = mongoose.model('Office', officeSchema);

module.exports = Office;
