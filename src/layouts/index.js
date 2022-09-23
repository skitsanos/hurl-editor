import AboutDialog from '@/components/AboutDialog';
import Settings from '@/components/Settings';
import {fileDialogOptions} from '@/defaults';
import {Button, Divider, Drawer, Layout, Modal, Space, Tooltip} from '@arco-design/web-react';
import {
    IconFile,
    IconFolder,
    IconQuestionCircle,
    IconRightCircle,
    IconSave,
    IconSettings
} from '@arco-design/web-react/icon';
import {dialog, fs} from '@tauri-apps/api';
import {arch, platform} from '@tauri-apps/api/os';
import {invoke} from '@tauri-apps/api/tauri';
import {appWindow} from '@tauri-apps/api/window';
import {useAsyncEffect, useSetState} from 'ahooks';
import {Outlet} from 'umi';

export default () =>
{
    const [state, setState] = useSetState({
        drawerVisible: false,

        arch: null,
        platform: null,

        currentFile: null,
        currentFileContent: null,
        currentFileModified: null,

        fileIsSaving: false,
        fileIsLoading: false
    });

    useAsyncEffect(async () =>
    {
        setState({
            arch: await arch(),
            platform: await platform()
        });

        await invoke('close_splashscreen');
    }, []);

    //
    // Create a new file
    //
    const newFile = async () =>
    {
        setState({
            currentFile: null,
            currentFileContent: null
        });

        await appWindow.setTitle(`Hurl Editor`);
    };

    //
    // Open existing file
    //
    const openFile = async () =>
    {
        setState({fileIsLoading: true});

        const fileSelected = await dialog.open({
            title: 'Open file',
            ...fileDialogOptions
        });

        if (fileSelected)
        {
            setState({
                currentFile: fileSelected,
                currentFileContent: await fs.readTextFile(fileSelected.toString())
            });
        }

        setState({fileIsLoading: false});

        await appWindow.setTitle(`Hurl Editor (${fileSelected})`);
    };

    const editorContentChanged = data => setState({currentFileModified: data});

    //
    // Save file
    //
    const saveFile = async () =>
    {
        setState({fileIsSaving: true});

        let fileSelected = state.currentFile;

        if (fileSelected === null)
        {
            //saving new file
            fileSelected = await dialog.save({
                title: 'Save file',
                ...fileDialogOptions
            });
        }

        if (fileSelected)
        {
            await fs.writeTextFile({
                path: fileSelected,
                contents: state.currentFileModified
            });

            setState({
                currentFile: fileSelected,
                currentFileModified: null
            });

            await appWindow.setTitle(`Hurl Editor (${fileSelected})`);
        }

        setState({
            fileIsSaving: false
        });
    };

    //https://github.com/matprec/rust-font-loader/blob/master/examples/list-fonts.rs
    //https://stackoverflow.com/questions/304319/is-there-an-equivalent-of-which-on-the-windows-command-line

    return <Layout>
        <Layout.Header>
            <div className={'toolbar dashed-bottom'}>
                <Space>
                    <Tooltip content={'New file'}>
                        <Button icon={<IconFile/>}
                                onClick={newFile}/>
                    </Tooltip>


                    <Tooltip content={'Open file'}>
                        <Button icon={<IconFolder/>}
                                loading={state.fileIsLoading}
                                onClick={openFile}/>
                    </Tooltip>

                    <Tooltip content={'Save file'}>
                        <Button icon={<IconSave/>}
                                loading={state.fileIsSaving}
                                onClick={saveFile}/>
                    </Tooltip>

                    <Divider type={'vertical'}/>

                    <Button icon={<IconRightCircle/>}/>

                    <Divider type={'vertical'}/>

                    <Button icon={<IconSettings/>}
                            onClick={() => setState({drawerVisible: true})}/>

                    <Button icon={<IconQuestionCircle/>}
                            onClick={() => Modal.info({
                                title: 'About...',
                                icon: null,
                                okText: 'Close',
                                content: <AboutDialog/>
                            })}/>
                </Space>
            </div>
        </Layout.Header>

        <Layout.Content className={'app-workspace'}>
            <Outlet context={{
                file: state.currentFile,
                fileContent: state.currentFileContent,

                onChange: editorContentChanged
            }}/>

            <Drawer visible={state.drawerVisible}
                    style={{
                        width: 400
                    }}
                    title={'Settings'}
                    cancelText={'Cancel'}
                    okText={'Save'}
                    onOk={() =>
                    {
                        setState({drawerVisible: false});
                    }}
                    onCancel={() =>
                    {
                        setState({drawerVisible: false});
                    }}>
                <Settings/>
            </Drawer>
        </Layout.Content>

        <Layout.Footer>
            HurlEditor v.1.0.0beta ({state.platform}_{state.arch})
        </Layout.Footer>
    </Layout>;
};