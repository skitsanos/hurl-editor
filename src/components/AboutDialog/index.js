import {Divider} from '@arco-design/web-react';
import {arch, platform, version} from '@tauri-apps/api/os';
import {useAsyncEffect, useSetState} from 'ahooks';

const AboutDialog = () =>
{
    const [state, setState] = useSetState({
        arch: null,
        platform: null,
        version: null
    });

    useAsyncEffect(async () =>
    {
        setState({
            arch: await arch(),
            platform: await platform(),
            version: await version()
        });
    }, []);

    return <>
        <div>
            Hurl is a command line tool that runs HTTP requests defined in a simple plain text format. More details can
            be found at <a href={'https://hurl.dev/'}>https://hurl.dev/</a>
        </div>

        <Divider/>

        <div>
            {state.platform}/{state.arch}/kernel v.{state.version}
        </div>

    </>;
};

export default AboutDialog;