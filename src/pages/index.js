import keywords from '@/hurl/keywords';
import theme from '@/hurl/theme';
import tokenizer from '@/hurl/tokenizer';
import Editor from '@monaco-editor/react';
import {useRef} from 'react';
import {useOutletContext} from 'umi';

const page = () =>
{
    const context = useOutletContext() || {};
    const {file, fileContent, onChange} = context;

    const editorRef = useRef(null);

    const handleEditorWillMount = monaco =>
    {
        monaco.languages.register({
            id: 'hurl'
        });

        //https://stackoverflow.com/questions/59377254/how-to-create-monaco-editor-custom-language-in-angular

        monaco.languages.setMonarchTokensProvider('hurl', {
            keywords,
            tokenizer
        });

        monaco.editor.defineTheme('hurl', theme);
    };

    const handleEditorDidMount = (editor, monaco) =>
    {
        editorRef.current = editor;
    };

    const handleEditorChange = (value, event) =>
    {
        if (onChange)
        {
            onChange(value);
        }
    };

    return <Editor defaultLanguage={'hurl'}
                   theme={'hurl'}
                   options={{
                       automaticLayout: true,
                       scrollBeyondLastLine: false,
                       minimap: {
                           enabled: false
                       }
                   }}
                   value={fileContent}
        /*defaultValue={Array.from({length: 20}, () => 'GET https://api.skitsanos.com/api/utils/headers\n#hello\n[Asserts]\n\n\n').join('\n')}*/
                   onChange={handleEditorChange}
                   beforeMount={handleEditorWillMount}
                   onMount={handleEditorDidMount}/>;
};

export default page;