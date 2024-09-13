import CardGallery from '../../../components/CardGallery/card-gallery';


function DownloadStandard() {
    return (
      <div>        
        <div className="row">
            <div className="col-12">
                <h3>Note: These cards have been obtained from various sources, and some may be of low quality. Additionally, some cards may have
                    been modified before I acquired them. During processing, I have added a &#9651;R symbol next to the Hasbro logo to clearly identify
                    these cards as reproductions. This measure helps prevent these cards from being produced and sold as originals. I am seeking
                    high-quality scans at 600 DPI or above. I would greatly appreciate anyone who is willing to scan and share high-quality images
                    of their cards. Please refer to this
                    <a href="https://docs.google.com/spreadsheets/d/1krZZ8-Vqw29URCuTV1TqgFdFICMtGWUQPmpFTLoKcZE/edit?usp=sharing">Google Sheet</a>
                    to see which card scans are still needed. You can contact me through the
                    <a href="https://github.com/abnoba12/HeroscapeIndexCardBuilder/discussions">discussion board on GitHub</a>
                </h3>
            </div>
        </div>
        <CardGallery cardSize="Standard" />
      </div>
  );
}

export default DownloadStandard;