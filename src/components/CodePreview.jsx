import { useState } from "react";
import PropTypes from "prop-types";
import { Clipboard, Download } from "lucide-react";
import { Highlight, themes } from "prism-react-renderer";
// import theme from "prism-react-renderer/themes/vsDark"; // Oficjalny import motywu
import "./CodePreview.css";

const CodePreview = ({ code, fileName }) => {
    const [copied, setCopied] = useState(false);
    // const theme = require('prism-react-renderer').themes.github

    const handleCopyCode = () => {
        navigator.clipboard.writeText(code).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
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
                                padding: "2vh",
                                borderRadius: "2vh",
                                overflowX: "auto",
                                fontSize: "1.9vh",
                                lineHeight: "1.5",
                                margin: 0,
                            }}
                        >
                            {tokens.map((line, i) => (
                                <div key={i} {...getLineProps({ line, key: i })}>
                                    {/* Numer linii */}
                                    <span
                                        style={{
                                            display: "inline-block",
                                            width: "2em",
                                            userSelect: "none",
                                            opacity: 0.5,
                                            paddingRight: "1em",
                                            color: "#858585",
                                            textAlign: "right"
                                        }}
                                    >
                                        {i + 1}
                                    </span>

                                    {/* Zawartość linii */}
                                    {line.map((token, key) => (
                                        <span key={key} {...getTokenProps({ token, key })} />
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
};

export default CodePreview;