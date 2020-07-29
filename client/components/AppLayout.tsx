import {Layout, Menu} from 'antd';
import {FileImageOutlined, FolderOpenOutlined} from '@ant-design/icons';

import style from './AppLayout.module.scss';
import {useRouter} from 'next/router';

const { Content, Sider } = Layout;

export default function AppLayout({ children }) {
    const router = useRouter();

    let selectedMenuItem = ['1'];
    if (router.pathname.includes('/albums')) selectedMenuItem = ['2'];

    return (
        <Layout className={style.layout}>
            <Layout>
                <Sider width={200}>
                    <Menu
                        theme="dark"
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
                        {children}
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
}
