import {Checkbox, Form, Select} from '@arco-design/web-react';

const Settings = () =>
{
    return <>
        <Form layout={'vertical'}>
            <Form.Item label={'Font'}>
                <Select placeholder={'Please select'}
                        options={['IBM Plex Mono']}
                        value={['IBM plex Mono']}/>
            </Form.Item>
            <Form.Item>
                <Checkbox>Show Mini map</Checkbox>
            </Form.Item>
        </Form>
    </>;
};

export default Settings;