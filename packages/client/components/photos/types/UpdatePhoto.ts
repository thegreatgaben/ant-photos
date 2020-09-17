/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdatePhoto
// ====================================================

export interface UpdatePhoto_updatePhoto {
  __typename: "Photo";
  id: string;
  caption: string | null;
}

export interface UpdatePhoto {
  updatePhoto: UpdatePhoto_updatePhoto | null;
}

export interface UpdatePhotoVariables {
  id: string;
  caption?: string | null;
  albumId?: string | null;
}
