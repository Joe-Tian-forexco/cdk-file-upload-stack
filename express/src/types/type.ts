enum PtxFileCategory {
  Transaction = "transaction",
  Profile = "profile",
  Report = "report",
  Receipt = "receipt",
  Others = "others",
}

export type UploadParams = {
  userId: string;
  category: PtxFileCategory;
  fileName: string;
  extension: string;
};

export type DeleteParams = {
  userId: string;
  category: PtxFileCategory;
  fileName: string;
  extension: string;
};

export type GetObParams = {
  userId: string;
  category: PtxFileCategory;
  fileName: string;
  extension: string;
};

