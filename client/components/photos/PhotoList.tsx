import {Empty} from 'antd';

import style from './PhotoList.module.scss';

export default function PhotosList({ photoList }) {
    return (
        <>
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
