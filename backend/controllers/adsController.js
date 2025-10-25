exports.getAdsPage = (req, res) => {
    try {
        const adsData = null;

        res.render('ads', {
            page: 'ads',
            pageTitle: 'Quảng cáo | Admin',
            adsData,
            contentPage: 'adsContent'
        });
    } catch (err) {
        res.status(500).send(err.message);
    }
};