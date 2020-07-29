import {useState} from 'react';
import {Empty, Button} from 'antd';
import {UploadOutlined} from '@ant-design/icons';

import UploadModal from './UploadModal';
import style from './PhotoList.module.scss';

export default function PhotosList({ photoList }) {
    const [showUploadModal, setShowUploadModal] = useState(false);

    return (
        <>
            <div className="d-flex justify-content-end mb-3">
                <Button icon={<UploadOutlined/>} type="primary" onClick={() => setShowUploadModal(true)}>
                    Upload
                </Button>
            </div>

            <UploadModal 
                visible={showUploadModal}
                setVisibility={(flag) => setShowUploadModal(flag)}
            />

            {
                photoList.length === 0 ?
                <Empty 
                    className={style.photoListEmpty}
                    image="/images/photos_empty.svg"
                    description="Put all your memories in a safe place here. Upload some photos now."
                />
                :
                <div className={style.photoListContainer}>
                    {photoList.map(photo => { 
                        return <img key={photo.id} className={style.photoItem} src={photo.url}/>
                    })}
                </div>
            }
        </>
    );
}
