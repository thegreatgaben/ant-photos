import { useCallback } from 'react';
import { useDropzone } from "react-dropzone";
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

const uploadFileMutation = gql`
  mutation UploadFile($files: [Upload]!) {
      uploadPhotos(files: $files) {
          filename
          uploaded
      }
  }
`;

export default function PhotoUpload() {
    const [uploadFile] = useMutation(uploadFileMutation);
    const onDrop = useCallback(
        (files) => {
            uploadFile({ variables: { files } });
        },
        [uploadFile]
    );
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    return (
        <>
            <div {...getRootProps()}>
                <input {...getInputProps()} />
                {isDragActive ? (
                    <p>Drop the files here ...</p>
                ) : (
                    <p>Drag 'n' drop some files here, or click to select files</p>
                )}
            </div>
        </>
    );
}
