import keywords from '@/hurl/keywords';
import theme from '@/hurl/theme';
import tokenizer from '@/hurl/tokenizer';
import Editor from '@monaco-editor/react';
import {useSetState} from 'ahooks';
import {useCallback, useRef} from 'react';
import {useOutletContext} from 'umi';

/*monaco.config({
 paths: {
 vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.20.0/min/vs"
 }
 });*/

const Page = ({isActive, saved}) =>
{
    const context = useOutletContext() || {};

    const [state, setState] = useSetState({
        changed: saved
    });

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

    const handleEditorChange = useCallback((value/*, event*/) =>
    {
        if (onChange)
        {
            onChange(value);
        }

        setState({changed: true});
    }, []);

    const handleEditorDidMount = useCallback((editor/*, monaco*/) =>
    {
        editorRef.current = editor;
    }, [handleEditorChange]);

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

export default Page;