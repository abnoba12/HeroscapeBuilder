import React from 'react';

const Printing: React.FC = () => {
    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-sm-12">
                    <h2 id="list-of-services-and-prices">List of Services and Prices</h2>

                    <p>Details about services and prices.</p>

                    <p><strong>Service:</strong> <a href="https://www.bestvaluecopy.com/color-copies.html">Best Value Copy</a></p>

                    <p><strong>Recomended Print settings for cards:</strong></p>
                    <ul>
                        <li><strong>Coloration:</strong> Color</li>
                        <li><strong>Sides:</strong> Double Sided</li>
                        <li><strong>Page Size:</strong> Letter</li>
                        <li><strong>Paper:</strong> 100# Coated Silk Cover</li>
                        <li><strong>Everything Else:</strong> None</li>
                    </ul>

                    <h2 id="formatting-tips-and-recommendations">Formatting Tips and Recommendations</h2>

                    <p>Details about formatting tips and recommendations.</p>

                    <p>Based on measurements of the Heroscape cards, they are approximately 300 GSM or 110 lb Cover Weight.</p>

                    <h2 id="downloads">Downloads</h2>

                    <h3 id="image-assets">Image Assets</h3>

                    <p>Image assets to assist you in creating your own custom Heroscape cards.</p>

                    <ul>
                        <li><a id="download-standard-assets" href="#">Download Standard Army Card Image Assets<span className="spinner"></span></a></li>
                        <li><a id="download-3x5-assets" href="#">Download 3x5 Army Card Image Assets<span className="spinner"></span></a></li>
                        <li><a id="download-4x6-assets" href="#">Download 4x6 Army Card Image Assets<span className="spinner"></span></a></li>
                    </ul>

                    <h3 id="download-executables-for-formatting-and-compressing-pdfs"><a href="/cardGenerator/printing/PDFUils.zip">Download executables for formatting and compressing PDFs</a></h3>

                    <h4 id="note">Note:</h4>
                    <p>All files are designed for use on Windows.</p>

                    <ul>
                        <li>BuildDoubleSidedPrints_Orig.exe
                            <ul>
                                <li><strong>Purpose:</strong> This script is designed to process PDFs formatted as standard army cards (each PDF should be exactly 2 pages).</li>
                                <li><strong>Usage:</strong> Place this script in a folder containing ONLY the relevant PDFs. The script will combine all PDFs in the folder into a single <code className="language-plaintext highlighter-rouge">compressed_combined.pdf</code> file.</li>
                                <li><strong>Output:</strong> The resulting PDF is formatted, compressed, and optimized for printing standard cards on letter-size paper, with two cards per page. Pages are laid out for double-sided printing and can be cut apart using a paper cutter following the provided cut lines. This script is also compatible with 4x6 index cards if two cards per page are desired.</li>
                                <li><strong>Note:</strong> The original PDFs are not modified, but any existing <code className="language-plaintext highlighter-rouge">compressed_combined.pdf</code> file in the folder will be overwritten.</li>
                            </ul>
                        </li>
                        <li>BuildDoubleSidedPrints_3x5.exe
                            <ul>
                                <li><strong>Purpose:</strong> This script is intended for PDFs formatted as 3x5 index cards (each PDF should be exactly 2 pages, each page measuring 3.25 x 5.25 inches to allow for bleed).</li>
                                <li><strong>Usage:</strong> Place this script in a folder containing ONLY the relevant PDFs. The script will combine all PDFs into a single <code className="language-plaintext highlighter-rouge">master.pdf</code> file.</li>
                                <li><strong>Output:</strong> The resulting PDF is formatted, compressed, and optimized for printing 3x5 index cards on letter-size paper, with four cards per page. Pages are laid out for double-sided printing and can be cut apart using a paper cutter following the provided cut lines.</li>
                                <li><strong>Note:</strong> The original PDFs are not modified, but any existing <code className="language-plaintext highlighter-rouge">master.pdf</code> file in the folder will be overwritten.</li>
                            </ul>
                        </li>
                        <li>CombineAndCompress_4x6.exe
                            <ul>
                                <li><strong>Purpose:</strong> This script is designed for PDFs formatted as 4x6 index cards (each PDF should be exactly 2 pages, each page measuring 4.25 x 6.25 inches to allow for bleed).</li>
                                <li><strong>Usage:</strong> Place this script in a folder containing ONLY the relevant PDFs. The script will combine all PDFs into a single <code className="language-plaintext highlighter-rouge">compressed_combined.pdf</code> file.</li>
                                <li><strong>Output:</strong> The resulting PDF is formatted, compressed, and optimized for printing 4x6 index cards. This script only combines the PDFs into a single file without placing multiple cards on a single page, allowing direct printing on 4x6 paper without cutting.</li>
                                <li><strong>Note:</strong> The original PDFs are not modified, but any existing <code className="language-plaintext highlighter-rouge">compressed_combined.pdf</code> file in the folder will be overwritten.</li>
                            </ul>
                        </li>
                        <li>CompressPDFs.exe
                            <ul>
                                <li><strong>Purpose:</strong> This script is designed to compress and optimize PDFs for printing.</li>
                                <li><strong>Usage:</strong> Place this script in a folder containing at least one PDF. The script will compress and optimize all PDFs in the folder.</li>
                                <li><strong>Note:</strong> This process WILL modify all PDFs in the folder. If uncompressed versions are needed, ensure you save copies elsewhere.</li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Printing;
