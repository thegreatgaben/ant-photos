import {Layout, Menu} from 'antd';
import { useState } from 'react';
import {FileImageOutlined, FolderOpenOutlined, StarOutlined} from '@ant-design/icons';

import style from './AppLayout.module.scss';
import {useRouter} from 'next/router';

const { Content, Sider } = Layout;

export default function AppLayout({ children }) {
    const router = useRouter();
    const [showMask, setShowMask] = useState(false);

    const pathnameSelectedMenuItemMap = {
        '/': ['1'],
        '/favorites': ['2'],
        '/albums': ['3'],
        '/albums/[id]': ['3']
    }
    const selectedMenuItem = pathnameSelectedMenuItemMap[router.pathname]

    return (
        <Layout className={style.layout}>
            { showMask &&
                <div className={style.drawerMask}></div>
            }
            <Sider 
                breakpoint="lg"
                collapsedWidth="0"
                className={style.sider} 
                onCollapse={collapsed => setShowMask(!collapsed)}
            >
                <div className={style.logoContainer}>
                    <img alt="Logo" src="/images/logo.svg"/>
                    <h5>Ant Photos</h5>
                </div>
                <Menu
                    className={style.menu}
                    theme="dark"
                    mode="inline"
                    selectedKeys={selectedMenuItem}
                >
                    <Menu.Item key="1" icon={<FileImageOutlined/>} onClick={() => router.push('/')}>
                        Photos
                    </Menu.Item>
                    <Menu.Item key="2" icon={<StarOutlined/>} onClick={() => router.push('/favorites')}>
                        Favorites
                    </Menu.Item>
                    <Menu.Item key="3" icon={<FolderOpenOutlined/>} onClick={() => router.push('/albums')}>
                        Albums
                    </Menu.Item>
                </Menu>
            </Sider>
            <Layout className={style.contentLayout}>
                <Content className={style.content}>
                    {children}
                </Content>
            </Layout>
        </Layout>
    );
}
