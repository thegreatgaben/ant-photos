import { useState } from 'react';
import { Layout, Menu, Button } from 'antd';
import { UploadOutlined, FileImageOutlined, FolderOpenOutlined, PlusOutlined } from '@ant-design/icons';

import style from './AppLayout.module.scss';
import UploadModal from './photos/UploadModal';
import { useRouter } from 'next/router';
import CreateAlbumModal from './albums/CreateAlbumModal';

const { Header, Content, Sider } = Layout;

export default function AppLayout({ children }) {
    const router = useRouter();
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [showCreateAlbumModal, setShowCreateAlbumModal] = useState(false);

    let selectedMenuItem = ['1'];
    if (router.pathname === '/albums') selectedMenuItem = ['2'];

    return (
        <Layout className={style.layout}>
            <Header className="header">
                <div className="logo" />
                <div className={style.headerRightCol}>
                    { router.pathname === '/' &&
                        <Button icon={<UploadOutlined/>} type="primary" onClick={() => setShowUploadModal(true)}>
                            Upload
                        </Button>
                    }
                    { router.pathname === '/albums' &&
                        <Button icon={<PlusOutlined/>} type="primary" onClick={() => setShowCreateAlbumModal(true)}>
                            Create Album
                        </Button>
                    }
                </div>
            </Header>
            <Layout>
                <Sider width={200}>
                    <Menu
                        mode="inline"
                        selectedKeys={selectedMenuItem}
                        style={{ height: '100%', borderRight: 0 }}
                    >
                        <Menu.Item key="1" icon={<FileImageOutlined/>} onClick={() => router.push('/')}>
                            Photos
                        </Menu.Item>
                        <Menu.Item key="2" icon={<FolderOpenOutlined/>} onClick={() => router.push('/albums')}>
                            Albums
                        </Menu.Item>
                    </Menu>
                </Sider>
                <Layout style={{ padding: '0 24px 24px' }}>
                    <Content
                        className="site-layout-background"
                        style={{
                            padding: 24,
                                margin: 0,
                                minHeight: 280,
                        }}
                    >
                        <UploadModal 
                            visible={showUploadModal}
                            setVisibility={(flag) => setShowUploadModal(flag)}
                        />
                        <CreateAlbumModal 
                            visible={showCreateAlbumModal}
                            setVisibility={(flag) => setShowCreateAlbumModal(flag)}
                        />
                        {children}
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
}
