import {Layout, Menu} from 'antd';
import { useState } from 'react';
import {FileImageOutlined, FolderOpenOutlined} from '@ant-design/icons';

import style from './AppLayout.module.scss';
import {useRouter} from 'next/router';

const { Content, Sider } = Layout;

export default function AppLayout({ children }) {
    const router = useRouter();
    const [showMask, setShowMask] = useState(false);

    let selectedMenuItem = ['1'];
    if (router.pathname.includes('/albums')) selectedMenuItem = ['2'];

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
                    <Menu.Item key="2" icon={<FolderOpenOutlined/>} onClick={() => router.push('/albums')}>
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
