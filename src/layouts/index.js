import Settings from '@/components/Settings';
import {Button, Divider, Drawer, Layout, Space} from '@arco-design/web-react';
import {
    IconFile,
    IconFolder,
    IconQuestionCircle,
    IconRightCircle,
    IconSave,
    IconSettings
} from '@arco-design/web-react/icon';
import {invoke} from '@tauri-apps/api/tauri';
import {useEffect, useState} from 'react';
import {Outlet} from 'umi';

export default () =>
{
    const [drawerVisible, setDrawerVisible] = useState(false);

    useEffect(() =>
    {
        invoke('close_splashscreen').then(() =>
        {
            console.log('HurlEditor is ready');
        });
    }, []);

    //https://github.com/matprec/rust-font-loader/blob/master/examples/list-fonts.rs
    //https://stackoverflow.com/questions/304319/is-there-an-equivalent-of-which-on-the-windows-command-line

    return <Layout>
        <Layout.Header>
            <div className={'toolbar dashed-bottom'}>
                <Space size={'mini'}>
                    <Button icon={<IconFile/>}/>
                    <Button icon={<IconFolder/>}/>
                    <Button icon={<IconSave/>}/>
                    <Divider type={'vertical'}/>
                    <Button icon={<IconRightCircle/>}/>
                    <Divider type={'vertical'}/>
                    <Button icon={<IconSettings/>}
                            onClick={() => setDrawerVisible(true)}/>
                    <Button icon={<IconQuestionCircle/>}/>
                </Space>
            </div>
        </Layout.Header>

        <Layout.Content className={'app-workspace'}>
            <Outlet/>

            <Drawer visible={drawerVisible}
                    style={{
                        width: 400
                    }}
                    title={'Settings'}
                    cancelText={'Cancel'}
                    okText={'Save'}
                    onOk={() =>
                    {
                        setDrawerVisible(false);
                    }}
                    onCancel={() =>
                    {
                        setDrawerVisible(false);
                    }}>
                <Settings/>
            </Drawer>
        </Layout.Content>

        <Layout.Footer>
            HurlEditor v.1.0.0beta
        </Layout.Footer>
    </Layout>;
};