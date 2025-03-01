import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Clipboard, Download } from "lucide-react";
import { Highlight, themes } from "prism-react-renderer";
import "./CodePreview.css";

const CodePreview = ({ code, fileName, onAddCommentsChange }) => {
    const [copied, setCopied] = useState(false);
    const [addComments, setAddComments] = useState(true);

    useEffect(() => {
        onAddCommentsChange?.(addComments);
    }, [addComments, onAddCommentsChange]);

    const toggleAddCommentsState = () => {
        setAddComments(prevState => !prevState);
    };

    const handleCopyCode = () => {
        navigator.clipboard.writeText(code)
            .then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            })
            .catch(err => {
                console.error('Failed to copy text:', err);
                alert('Failed to copy code to clipboard');
            });
    };

    const handleDownloadFile = () => {
        const blob = new Blob([code], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName || "code.txt";
        link.click();
    };

    return (
        <div className="code-preview-container">
            <div className="header-container">
                <h3 className="file-title">{fileName || "untitled.c"}</h3>
                <div className="toolbar-checkbox">
                    <input
                        className="toolbar-show-comments-checkobox"
                        type="checkbox"
                        checked={addComments}
                        onChange={toggleAddCommentsState}
                    />
                    <label className="toolbar-show-comments-checkobox-label">
                        Add comments
                    </label>
                </div>
                <div className="toolbar-buttons">
                    <button
                        className="icon-button"
                        onClick={handleCopyCode}
                        title={copied ? "Copied!" : "Copy to clipboard"}
                    >
                        <Clipboard size={18} color={copied ? "#4CAF50" : "#cccccc"} />
                    </button>
                    <button
                        className="icon-button"
                        onClick={handleDownloadFile}
                        title="Download file"
                    >
                        <Download size={18} color="#cccccc" />
                    </button>
                </div>
            </div>

            <div className="code-content-wrapper">
                <Highlight
                    code={code}
                    language="c"
                    theme={themes.vsDark}
                >
                    {({ className, style, tokens, getLineProps, getTokenProps }) => (
                        <pre
                            className={className}
                            style={{
                                ...style,
                                background: "#1e1e1e",
                                padding: "1vw",
                                borderRadius: "1vw",
                                overflowX: "auto",
                                fontSize: "1.3vh",
                                lineHeight: "1.5",
                                margin: 0,
                            }}
                        >
                            {tokens.map((line, i) => (
                                <div key={i} {...getLineProps({ line })}>
                                    <span
                                        style={{
                                            display: "inline-block",
                                            width: "1em",
                                            userSelect: "none",
                                            opacity: 0.5,
                                            paddingRight: "1em",
                                            color: "#858585",
                                            textAlign: "right"
                                        }}
                                    >
                                        {i + 1}
                                    </span>
                                    {line.map((token, key) => (
                                        <span key={key} {...getTokenProps({ token })} />
                                    ))}
                                </div>
                            ))}
                        </pre>
                    )}
                </Highlight>
            </div>
        </div>
    );
};

CodePreview.propTypes = {
    code: PropTypes.string.isRequired,
    fileName: PropTypes.string,
    onAddCommentsChange: PropTypes.func,
};

CodePreview.defaultProps = {
    fileName: "lcd_hd44780_def_char.h",
    onAddCommentsChange: null,
};

export default CodePreview;