import CardGallery from '../../../components/CardGallery/card-gallery';

function DownloadStandard() {
    return (
        <div>
            <div className="row">
                <div className="col-12">
                    <p>
                        These cards come from various sources and some may have been modified. Each card carries a &#9651;R
                        mark next to the Hasbro logo to identify it as a reproduction.
                    </p>
                </div>
            </div>
            <CardGallery cardSize="Standard" />
        </div>
    );
}

export default DownloadStandard;
