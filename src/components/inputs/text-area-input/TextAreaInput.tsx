import { InputProps } from "../__base__/Inputs.types";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { EditorState } from "lexical";
import { PlainTextPlugin } from "@lexical/react/LexicalPlainTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { enqueueSnackbar } from "notistack";

export default function TextAreaInput(props: InputProps<HTMLTextAreaElement>) {
  function handleEditorError(error: Error) {
    enqueueSnackbar({
      message: error.message || "An error occurred in editor",
      variant: "error",
    });
  }

  function handleChange(editor: EditorState) {
    props.onChange({
      value: JSON.stringify(editor.toJSON()),
      field: props.name,
    });
  }

  return (
    <div>
      <label
        className="flex items-center text-stone-500 text-sm gap-2 mb-1"
        htmlFor={props.id ?? props.name}
      >
        {props.label}
      </label>

      <div className="relative">
        <LexicalComposer
          initialConfig={{
            editorState: props.value ? (props.value as string) : null,
            namespace: "MessageArea",
            onError: handleEditorError,
          }}
        >
          <PlainTextPlugin
            contentEditable={
              <ContentEditable className="min-h-[100px] text-sm max-h-[350px] sm:max-h-[300px] border border-stone-200 overflow-auto rounded-lg py-3.5 px-4 text-stone-500 font-medium bg-white" />
            }
            placeholder={
              <span className="text-sm text-stone-300 absolute top-3.5 left-4 pointer-events-none">
                {props.placeholder}
              </span>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <OnChangePlugin onChange={handleChange} ignoreSelectionChange />
        </LexicalComposer>
      </div>
    </div>
  );
}
