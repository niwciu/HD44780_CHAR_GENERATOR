import { useState } from "react";
import PropTypes from "prop-types";
import { Clipboard, Download } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import vscDarkPlus from "react-syntax-highlighter/dist/cjs/styles/prism/vsc-dark-plus";
import "./CodePreview.css";

const CodePreview = ({ code, fileName }) => {
    const [copied, setCopied] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    const handleCopyCode = () => {
        navigator.clipboard.writeText(code).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const previewCode = code;
    
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
                <div className="code-scroll-container">
                    <SyntaxHighlighter
                        language="c"
                        style={vscDarkPlus}
                        showLineNumbers
                        customStyle={{
                            margin: 0,
                            padding: "1rem", // Używamy jednostek względnych
                            background: "#1e1e1e",
                            borderRadius: "4px",
                            overflowX: "auto", // Dodajemy przewijanie w poziomie
                            fontSize: "1rem", // Używamy jednostek względnych
                            width: "100%", // Pełna szerokość kontenera
                            maxWidth: "100%", // Maksymalna szerokość
                        }}
                    >
                        {previewCode}
                    </SyntaxHighlighter>
                </div>
            </div>
        </div>
    );
};

CodePreview.propTypes = {
    code: PropTypes.string.isRequired,
    fileName: PropTypes.string
};

export default CodePreview;