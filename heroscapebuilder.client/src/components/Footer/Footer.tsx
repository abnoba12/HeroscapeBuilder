import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="footer">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12 text-center">
                        <hr />
                        <p>This website is not affiliated with or endorsed by Heroscape, Hasbro, or Renegade Game Studios. It is solely a
                            fan site and does not represent or speak on behalf of any of these entities.</p>
                    </div>
                    <div className="credits ml-auto col-12 text-center">
                        &#169; 2024 HeroscapeBuilder.com
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
