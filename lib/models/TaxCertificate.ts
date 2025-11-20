import mongoose from "mongoose"

const TaxCertificateSchema = new mongoose.Schema(
  {
    donationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Donation",
      required: true,
      unique: true,
    },
    certificateNumber: {
      type: String,
      required: true,
      unique: true,
    },
    certificateType: {
      type: String,
      enum: ["80G", "12A", "FCRA"],
      required: true,
    },
    donorName: {
      type: String,
      required: true,
    },
    donorEmail: {
      type: String,
      required: true,
    },
    donorPan: {
      type: String,
      trim: true,
      uppercase: true,
    },
    donorAddress: {
      type: String,
      trim: true,
    },
    donationAmount: {
      type: Number,
      required: true,
    },
    donationDate: {
      type: Date,
      required: true,
    },
    financialYear: {
      type: String,
      required: true,
      match: /^\d{4}-\d{4}$/,
    },
    deductionPercentage: {
      type: Number,
      default: 50, // 50% for 80G
      min: 0,
      max: 100,
    },
    deductibleAmount: {
      type: Number,
      required: true,
    },
    organizationDetails: {
      name: {
        type: String,
        default: "Hope Foundation",
      },
      registrationNumber: {
        type: String,
        default: "HF12345",
      },
      panNumber: {
        type: String,
        default: "AABTH1234F",
      },
      address: {
        type: String,
        default: "123 Charity Lane, Bangalore, Karnataka - 560001",
      },
      eightyGNumber: {
        type: String,
        default: "80G/HF/2020-21/1234",
      },
      twelveANumber: {
        type: String,
        default: "12A/HF/2020-21/5678",
      },
    },
    status: {
      type: String,
      enum: ["pending", "issued", "cancelled"],
      default: "pending",
    },
    issuedDate: Date,
    cancelledDate: Date,
    cancellationReason: String,
    digitallySigned: {
      type: Boolean,
      default: false,
    },
    signatureDetails: {
      signatoryName: String,
      signatoryDesignation: String,
      digitalSignature: String,
    },
    generatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    verifiedDate: Date,
    auditTrail: [
      {
        action: {
          type: String,
          enum: ["created", "issued", "cancelled", "verified"],
          required: true,
        },
        performedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
        notes: String,
      },
    ],
    qrCode: String, // QR code for verification
    verificationUrl: String,
  },
  {
    timestamps: true,
  }
)

// Generate unique certificate number
TaxCertificateSchema.pre("save", async function (next) {
  if (!this.certificateNumber) {
    const year = new Date().getFullYear()
    const Model = this.constructor as mongoose.Model<any>
    const count = await Model.countDocuments({
      financialYear: `${year - 1}-${year}`,
    })
    this.certificateNumber = `HF-80G-${year}-${(count + 1).toString().padStart(6, "0")}`
  }
  next()
})

// Calculate deductible amount
TaxCertificateSchema.pre("save", function (next) {
  this.deductibleAmount = (this.donationAmount * this.deductionPercentage) / 100
  next()
})

// Index for performance
TaxCertificateSchema.index({ donationId: 1 })
TaxCertificateSchema.index({ certificateNumber: 1 })
TaxCertificateSchema.index({ donorEmail: 1 })
TaxCertificateSchema.index({ financialYear: 1 })
TaxCertificateSchema.index({ status: 1 })

export default mongoose.models.TaxCertificate ||
  mongoose.model("TaxCertificate", TaxCertificateSchema)