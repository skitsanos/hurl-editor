import {invoke} from '@tauri-apps/api/tauri';
import {useEffect} from 'react';
import {Outlet} from 'umi';

export default () =>
{
    useEffect(() =>
    {
        invoke('close_splashscreen').then(() =>
        {
            console.log('HurlEditor is ready');
        });
    }, []);

    return <div>app is running
        <Outlet/>
    </div>;
};