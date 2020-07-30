/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UploadPhotos
// ====================================================

export interface UploadPhotos_uploadPhotos {
  __typename: "PhotoUploadedResponse";
  filename: string;
  uploaded: boolean;
}

export interface UploadPhotos {
  uploadPhotos: (UploadPhotos_uploadPhotos | null)[] | null;
}

export interface UploadPhotosVariables {
  files: (any | null)[];
  albumId?: string | null;
}
