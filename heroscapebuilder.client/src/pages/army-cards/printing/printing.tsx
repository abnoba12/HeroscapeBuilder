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
                </div>
            </div>
        </div>
    );
};

export default Printing;
