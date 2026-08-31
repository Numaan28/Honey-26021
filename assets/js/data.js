/**
 * HONEYCHAIN — Central Default Data Source (SIH 2026)
 * Single source of truth for batches, hives, AI diagnostics, and timeline records.
 */

const DEFAULT_HONEYCHAIN_DATA = {
  version: "1.0.0",
  lastReset: new Date().toISOString(),

  // Primary and secondary batches
  batches: {
    "HC-2026-00125": {
      batchId: "HC-2026-00125",
      honeyType: "Raw Honey",
      floralOrigin: "Mustard",
      sourceHive: "HIVE-001",
      harvestDate: "2026-08-15",
      quantity: 42,
      location: "Kashmir Valley Apiary #4, India",
      processingStatus: "Completed",
      qualityStatus: "Verified",
      moisture: 17.2,
      purity: 99.4,
      certificateStatus: "Verified",
      labCertificateId: "CERT-IND-90241",
      labTestedDate: "2026-08-18",
      haccpCompliant: true,
      pollenCount: "45,000 grains/g",
      fructoseGlucoseRatio: "1.22",
      notes: "Unheated, raw cold-extracted honey with optimal enzyme preservation.",
      blockchainHash: "0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9060",
      events: [
        {
          id: "evt-1",
          stage: "Hive Origin",
          title: "Colony Telemetry Monitored",
          date: "2026-08-01",
          location: "Kashmir Apiary Zone B, Hive-001",
          description: "Internal hive microclimate sustained at 34.8°C with strong colony foraging rate.",
          status: "Verified"
        },
        {
          id: "evt-2",
          stage: "Harvest",
          title: "Super Comb Harvested",
          date: "2026-08-15",
          location: "Kashmir Valley Extraction Facility",
          description: "82% capped comb harvested. Cold spin extraction operated under food safety protocols.",
          status: "Verified"
        },
        {
          id: "evt-3",
          stage: "Processing",
          title: "Micro-filtration & Settling",
          date: "2026-08-16",
          location: "Kashmir Certified Processing Station",
          description: "Coarse mesh filtered to preserve bioactive bee pollen and natural enzymes.",
          status: "Verified"
        },
        {
          id: "evt-4",
          stage: "Quality",
          title: "Mass Spectrometry Lab Testing",
          date: "2026-08-18",
          location: "National Ag-Food Quality Laboratory",
          description: "Moisture verified at 17.2%. Verified 0% C4 corn syrup or sucrose adulteration.",
          status: "Verified"
        },
        {
          id: "evt-5",
          stage: "Packaging",
          title: "Tamper-Proof Amber Jar Packing",
          date: "2026-08-20",
          location: "HoneyChain Traceability Bottling Hub",
          description: "Packed into UV-protective food-grade jars with cryptographic NFC & QR verification seals.",
          status: "Verified"
        },
        {
          id: "evt-6",
          stage: "Distribution",
          title: "Cold-Chain Logistics Dispatched",
          date: "2026-08-22",
          location: "Regional Cold Logistics Terminal",
          description: "Dispatched under continuous IoT temperature-controlled freight at 20°C.",
          status: "Completed"
        }
      ]
    },
    "HC-2026-00088": {
      batchId: "HC-2026-00088",
      honeyType: "Acacia Monofloral",
      floralOrigin: "Acacia",
      sourceHive: "HIVE-002",
      harvestDate: "2026-07-28",
      quantity: 38,
      location: "Himachal Highlands Sector 2",
      processingStatus: "Completed",
      qualityStatus: "Verified",
      moisture: 16.8,
      purity: 99.8,
      certificateStatus: "Verified",
      labCertificateId: "CERT-IND-88102",
      labTestedDate: "2026-07-30",
      haccpCompliant: true,
      pollenCount: "52,000 grains/g",
      fructoseGlucoseRatio: "1.35",
      notes: "Light golden acacia honey with delicate floral aroma and slow crystallization index.",
      blockchainHash: "0x3e18a992bc09f18a6198fcd44321098efca11082c918a223bb381aef11082ab9",
      events: [
        { id: "evt-88-1", stage: "Hive Origin", title: "Acacia Bloom Foraging", date: "2026-07-10", location: "Himachal Apiary #2", description: "Colony foraging during peak Robinia pseudoacacia flowering.", status: "Verified" },
        { id: "evt-88-2", stage: "Harvest", title: "Comb Super Harvest", date: "2026-07-28", location: "Himachal Facility", description: "Harvested at 88% comb capping.", status: "Verified" },
        { id: "evt-88-3", stage: "Processing", title: "Cold Extraction", date: "2026-07-29", location: "Himachal Facility", description: "Gentle cold centrifugation.", status: "Verified" },
        { id: "evt-88-4", stage: "Quality", title: "Lab Certification", date: "2026-07-30", location: "National Quality Lab", description: "Moisture 16.8%, 99.8% pure.", status: "Verified" }
      ]
    },
    "HC-2026-00142": {
      batchId: "HC-2026-00142",
      honeyType: "Wildflower Multifloral",
      floralOrigin: "Multifloral",
      sourceHive: "HIVE-004",
      harvestDate: "2026-08-26",
      quantity: 64,
      location: "Nilgiri Mountain Biosphere",
      processingStatus: "Processing",
      qualityStatus: "Verified",
      moisture: 18.0,
      purity: 98.9,
      certificateStatus: "Verified",
      labCertificateId: "CERT-IND-91044",
      labTestedDate: "2026-08-28",
      haccpCompliant: true,
      pollenCount: "38,000 grains/g",
      fructoseGlucoseRatio: "1.18",
      notes: "Dark rich multifloral honey gathered from wild high-altitude herbs.",
      blockchainHash: "0x918aa02c1ef893716298ef99102cba33901928374aef10293847561029384756",
      events: [
        { id: "evt-142-1", stage: "Hive Origin", title: "Forest Foraging Active", date: "2026-08-12", location: "Nilgiri Biosphere", description: "Diverse floral nectar flow monitored via hive scales.", status: "Verified" },
        { id: "evt-142-2", stage: "Harvest", title: "Seasonal Extraction", date: "2026-08-26", location: "Nilgiri Processing Post", description: "64 kg raw comb harvested.", status: "Verified" },
        { id: "evt-142-3", stage: "Processing", title: "Filtration & Settling", date: "2026-08-27", location: "Nilgiri Processing Post", description: "In settling tanks undergoing filtration.", status: "Processing" }
      ]
    },
    "HC-2026-00055": {
      batchId: "HC-2026-00055",
      honeyType: "Sidr (Beri) Monofloral",
      floralOrigin: "Sidr",
      sourceHive: "HIVE-003",
      harvestDate: "2026-08-29",
      quantity: 29,
      location: "Thar Basin Apiary #1",
      processingStatus: "Pending",
      qualityStatus: "Pending",
      moisture: 19.1,
      purity: 97.5,
      certificateStatus: "Pending",
      labCertificateId: "CERT-PENDING",
      labTestedDate: "Pending Laboratory Slot",
      haccpCompliant: true,
      pollenCount: "31,000 grains/g",
      fructoseGlucoseRatio: "1.15",
      notes: "Aromatic Sidr nectar extracted from Ziziphus blossoms, awaiting spectrometer certificate.",
      blockchainHash: "0x1102983746501928374650192837465019283746501928374650192837465019",
      events: [
        { id: "evt-55-1", stage: "Hive Origin", title: "Sidr Bloom Telemetry", date: "2026-08-20", location: "Thar Apiary", description: "High temperature conditions logged and adjusted with shade ventilation.", status: "Verified" },
        { id: "evt-55-2", stage: "Harvest", title: "Comb Harvested", date: "2026-08-29", location: "Thar Regional Unit", description: "29 kg harvested, queued for lab verification.", status: "Pending" }
      ]
    }
  },

  // Hives state
  hives: {
    "HIVE-001": {
      hiveId: "HIVE-001",
      name: "Cedar Ridge Hive Alpha",
      status: "Healthy",
      temp: 34.8,
      humidity: 58,
      weight: 44.2,
      activity: "Optimal (98%)",
      battery: 94,
      healthScore: 98,
      queenStatus: "Active / Marked Green",
      colonyAge: "14 months",
      lastSync: "Just now",
      location: "Kashmir Apiary Zone B (GPS: 34.0837° N, 74.7973° E)",
      alertMessage: null,
      alertResolved: true
    },
    "HIVE-002": {
      hiveId: "HIVE-002",
      name: "Wildflower Meadow Hive Beta",
      status: "Healthy",
      temp: 35.1,
      humidity: 62,
      weight: 39.7,
      activity: "Active (92%)",
      battery: 88,
      healthScore: 95,
      queenStatus: "Active / Marked Yellow",
      colonyAge: "10 months",
      lastSync: "12 mins ago",
      location: "Himachal Sector 2 (GPS: 31.1048° N, 77.1734° E)",
      alertMessage: null,
      alertResolved: true
    },
    "HIVE-003": {
      hiveId: "HIVE-003",
      name: "Highland Pine Hive Gamma",
      status: "Warning",
      temp: 37.8,
      humidity: 76,
      weight: 31.4,
      activity: "Irregular (64%)",
      battery: 72,
      healthScore: 92,
      queenStatus: "Check Recommended",
      colonyAge: "18 months",
      lastSync: "2 mins ago",
      location: "Thar Basin Outpost (GPS: 26.9157° N, 70.9083° E)",
      alertMessage: "Possible abnormal hive temperature elevation & humidity spike detected.",
      alertResolved: false
    },
    "HIVE-004": {
      hiveId: "HIVE-004",
      name: "Riverbend Clover Hive Delta",
      status: "Healthy",
      temp: 34.2,
      humidity: 55,
      weight: 51.0,
      activity: "Optimal (96%)",
      battery: 91,
      healthScore: 97,
      queenStatus: "Active / Marked Red",
      colonyAge: "6 months",
      lastSync: "18 mins ago",
      location: "Nilgiri Sector 4 (GPS: 11.4916° N, 76.7337° E)",
      alertMessage: null,
      alertResolved: true
    }
  },

  // AI Diagnostic Simulation State
  aiAnalysis: {
    "HIVE-003": {
      hiveId: "HIVE-003",
      status: "WARNING",
      healthScore: 92,
      confidence: 87,
      riskLevel: "Medium",
      title: "Abnormal Colony Microclimate & Brood Thermoregulation Shift",
      summary: "Simulated acoustic and thermal sensor patterns indicate potential cluster stress or ventilation constriction.",
      reviewed: false,
      reviewedTimestamp: null,
      signals: [
        { title: "Core Temperature Spike", metric: "+3.2°C above baseline (37.8°C)", severity: "warning", detail: "Exceeds optimal brood comb threshold of 34.5°C–35.5°C." },
        { title: "Acoustic Wing-Beat Anomaly", metric: "Frequency shift to 230 Hz", severity: "warning", detail: "Elevated fanning frequency detected across bottom entrance microphones." },
        { title: "Humidity Condensation Risk", metric: "76% Relative Humidity", severity: "warning", detail: "Moisture retention detected in upper ventilation super." },
        { title: "Foraging Outflow Variance", metric: "-35% gate transit rate", severity: "info", detail: "Reduced pollen carrier departures over the last 4 hour monitoring cycle." }
      ],
      recommendation: "Inspect hive ventilation entrance screen for propolis blockage; verify water source availability within 200 meters."
    }
  },

  // Notifications
  notifications: [
    {
      id: "notif-1",
      title: "HIVE-003 requires attention",
      message: "Microclimate thermal alert (+3.2°C) detected by IoT telemetry.",
      type: "warning",
      timestamp: "10 mins ago",
      read: false,
      link: "hives.html?hive=HIVE-003"
    },
    {
      id: "notif-2",
      title: "HC-2026-00125 ready for QR generation",
      message: "Laboratory certificate CERT-IND-90241 verified on blockchain.",
      type: "success",
      timestamp: "1 hour ago",
      read: false,
      link: "qr-generator.html?batch=HC-2026-00125"
    },
    {
      id: "notif-3",
      title: "Batch HC-2026-00142 entered filtration",
      message: "64 kg Multifloral honey batch progressing in settling tanks.",
      type: "info",
      timestamp: "3 hours ago",
      read: true,
      link: "batch-details.html?batch=HC-2026-00142"
    }
  ],

  // Verification Log
  verifications: [
    {
      id: "v-1",
      batchId: "HC-2026-00125",
      honeyType: "Raw Honey",
      floralOrigin: "Mustard",
      quantity: 42,
      qualityStatus: "Verified",
      verifiedAt: new Date(Date.now() - 3600000).toISOString(),
      displayTime: "1 hour ago"
    }
  ]
};
