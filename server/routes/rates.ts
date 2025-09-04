import { RequestHandler } from "express";

export interface RoamingRateRow {
  country: string;
  callToEthiopia: number; // Birr/min
  callToLocal: number; // Birr/min
  callToOther: number; // Birr/min
  receivingCall: number; // Birr/min
  dataMb: number; // Birr/MB
  sendingSms: number; // Birr/SMS
  receivingSms: number; // Birr/SMS
}

export interface InternationalRateRow {
  country: string;
  callToEthiopia: number;
  callToLocal: number;
  callToOther: number;
  receivingCall: number;
  dataMb: number;
  sendingSms: number;
  receivingSms: number;
}

export interface MappingRow {
  tariffPlanKey: string;
  callTypeKey: string;
  originationTypeKey: string;
  destinationTypeKey: string;
  peakKey: string;
  rateIdValue: string;
}

interface RateVersionMeta {
  id: string;
  createdAt: string;
}

let processedRates: RoamingRateRow[] = [];
let mappingTable: MappingRow[] = [];
let excelFileName: string | null = null;
let zipFileName: string | null = null;

const versionDatasets: Record<string, RoamingRateRow[]> = {};
let versions: RateVersionMeta[] = [];

const intlVersionDatasets: Record<string, InternationalRateRow[]> = {};
let intlVersions: RateVersionMeta[] = [];

function seedSample() {
  const v1: RoamingRateRow[] = [
    {
      country: "Kenya",
      callToEthiopia: 35,
      callToLocal: 15,
      callToOther: 45,
      receivingCall: 10,
      dataMb: 2,
      sendingSms: 1,
      receivingSms: 0.5,
    },
    {
      country: "Tanzania",
      callToEthiopia: 33,
      callToLocal: 14,
      callToOther: 44,
      receivingCall: 9,
      dataMb: 1.8,
      sendingSms: 1,
      receivingSms: 0.5,
    },
  ];
  const v2: RoamingRateRow[] = [
    {
      country: "Kenya",
      callToEthiopia: 36,
      callToLocal: 16,
      callToOther: 46,
      receivingCall: 10,
      dataMb: 2.1,
      sendingSms: 1.1,
      receivingSms: 0.5,
    },
    {
      country: "Tanzania",
      callToEthiopia: 34,
      callToLocal: 14,
      callToOther: 44,
      receivingCall: 9,
      dataMb: 1.85,
      sendingSms: 1,
      receivingSms: 0.5,
    },
    {
      country: "Uganda",
      callToEthiopia: 32,
      callToLocal: 13,
      callToOther: 42,
      receivingCall: 8.5,
      dataMb: 1.7,
      sendingSms: 0.9,
      receivingSms: 0.5,
    },
  ];
  versionDatasets["v1"] = v1;
  versionDatasets["v2"] = v2;
  versions = [
    {
      id: "v2",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
    },
    {
      id: "v1",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
    },
  ];

  processedRates = v2;

  mappingTable = [
    {
      tariffPlanKey: "ROAM_STANDARD",
      callTypeKey: "VOICE",
      originationTypeKey: "ROAMING",
      destinationTypeKey: "ETH",
      peakKey: "PEAK",
      rateIdValue: "RATE001",
    },
    {
      tariffPlanKey: "ROAM_STANDARD",
      callTypeKey: "DATA",
      originationTypeKey: "ROAMING",
      destinationTypeKey: "ANY",
      peakKey: "OFFPEAK",
      rateIdValue: "RATE002",
    },
  ];
  excelFileName = "roaming_rates.csv";
  zipFileName = "rate_ids.zip";

  // International versions
  const iv1: InternationalRateRow[] = [
    {
      country: "Kenya",
      callToEthiopia: 30,
      callToLocal: 20,
      callToOther: 40,
      receivingCall: 12,
      dataMb: 2.2,
      sendingSms: 1.2,
      receivingSms: 0.6,
    },
    {
      country: "Tanzania",
      callToEthiopia: 29,
      callToLocal: 19,
      callToOther: 39,
      receivingCall: 11,
      dataMb: 2.0,
      sendingSms: 1.1,
      receivingSms: 0.6,
    },
  ];
  const iv2: InternationalRateRow[] = [
    {
      country: "Kenya",
      callToEthiopia: 31,
      callToLocal: 21,
      callToOther: 41,
      receivingCall: 12,
      dataMb: 2.3,
      sendingSms: 1.3,
      receivingSms: 0.6,
    },
    {
      country: "Tanzania",
      callToEthiopia: 30,
      callToLocal: 20,
      callToOther: 40,
      receivingCall: 11,
      dataMb: 2.05,
      sendingSms: 1.15,
      receivingSms: 0.6,
    },
    {
      country: "Uganda",
      callToEthiopia: 28,
      callToLocal: 18,
      callToOther: 38,
      receivingCall: 10,
      dataMb: 1.9,
      sendingSms: 1.0,
      receivingSms: 0.6,
    },
  ];
  intlVersionDatasets["v1"] = iv1;
  intlVersionDatasets["v2"] = iv2;
  intlVersions = [
    {
      id: "v2",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    },
    {
      id: "v1",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 40).toISOString(),
    },
  ];
}
seedSample();

export const uploadRoamingRates: RequestHandler = (_req, res) => {
  seedSample();
  return res.json({
    message: "Upload received. File validated and processed successfully.",
  });
};

export const uploadInternationalRates: RequestHandler = (_req, res) => {
  seedSample();
  return res.json({ message: "International rates uploaded successfully." });
};

export const getRoamingRates: RequestHandler = (req, res) => {
  const version = (req.query.version as string) || versions[0]?.id || "v1";
  const items = versionDatasets[version] || processedRates;
  return res.json({ items, version });
};

export const downloadRoamingExcel: RequestHandler = (_req, res) => {
  const header =
    "Country,Call to Ethiopia,Call to Local,Call to Other Countries,Receiving Call,Data (MB),Sending SMS,Receiving SMS\n";
  const body = processedRates
    .map((r) =>
      [
        r.country,
        r.callToEthiopia,
        r.callToLocal,
        r.callToOther,
        r.receivingCall,
        r.dataMb,
        r.sendingSms,
        r.receivingSms,
      ].join(","),
    )
    .join("\n");
  const content = header + body + "\n";
  res.setHeader("Content-Type", "text/csv");
  res.setHeader(
    "Content-Disposition",
    'attachment; filename="roaming_rates.csv"',
  );
  res.send(content);
};

export const downloadRateIdsZip: RequestHandler = (_req, res) => {
  const content = "This is a mock ZIP content with Rate IDs.";
  res.setHeader("Content-Type", "application/octet-stream");
  res.setHeader("Content-Disposition", 'attachment; filename="rate_ids.zip"');
  res.send(content);
};

export const getMappingTable: RequestHandler = (_req, res) => {
  return res.json({ items: mappingTable });
};

export const downloadMappingCsv: RequestHandler = (_req, res) => {
  const header =
    "TariffPlan::key,Call_Type::key,Origination_Type::key,Destination_Type::key,Peak::key,Rate_ID::value\n";
  const body = mappingTable
    .map((m) =>
      [
        m.tariffPlanKey,
        m.callTypeKey,
        m.originationTypeKey,
        m.destinationTypeKey,
        m.peakKey,
        m.rateIdValue,
      ].join(","),
    )
    .join("\n");
  const content = header + body + "\n";
  res.setHeader("Content-Type", "text/csv");
  res.setHeader(
    "Content-Disposition",
    'attachment; filename="mapping_table.csv"',
  );
  res.send(content);
};

export const compareMappingTables: RequestHandler = (_req, res) => {
  // Mock differences
  return res.json({
    summary: { added: 1, removed: 0, updated: 2 },
    added: [
      {
        tariffPlanKey: "ROAM_PLUS",
        callTypeKey: "SMS",
        originationTypeKey: "ROAMING",
        destinationTypeKey: "ANY",
        peakKey: "ANY",
        rateIdValue: "RATE100",
      },
    ],
    removed: [],
    updated: [
      {
        key: "ROAM_STANDARD|VOICE|ROAMING|ETH|PEAK",
        oldRateId: "RATE001",
        newRateId: "RATE003",
      },
      {
        key: "ROAM_STANDARD|DATA|ROAMING|ANY|OFFPEAK",
        oldRateId: "RATE002",
        newRateId: "RATE004",
      },
    ],
  });
};

export const getRoamingVersions: RequestHandler = (_req, res) => {
  return res.json({ versions });
};

export const getInternationalRates: RequestHandler = (req, res) => {
  const version = (req.query.version as string) || intlVersions[0]?.id || "v1";
  const items =
    intlVersionDatasets[version] ||
    intlVersionDatasets[intlVersions[0]?.id || "v1"] ||
    [];
  return res.json({ items, version });
};

export const getInternationalVersions: RequestHandler = (_req, res) => {
  return res.json({ versions: intlVersions });
};
