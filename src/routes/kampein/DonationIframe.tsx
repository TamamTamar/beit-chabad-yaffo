const DonationIframe = () => {
    return (
        <div className="donation-container">
            <iframe
                src="https://secure.matara.pro/nedarimplus/iframe/Donation.aspx?Mosad=7013920&Amount=300"
                width="60%"
                height="800px"
                frameBorder="0"
                scrolling="no">
            </iframe>

        </div>
    );
};

export default DonationIframe;
