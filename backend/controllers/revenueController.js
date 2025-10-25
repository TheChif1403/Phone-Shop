exports.getRevenuePage = (req, res) => {
    try {
        // nếu có dữ liệu thực tế, load vào revenueData
        const revenueData = null; // placeholder

        res.render('revenue', {
            page: 'revenue',
            pageTitle: 'Doanh thu | Admin',
            revenueData,
            contentPage: 'revenueContent'
        });
    } catch (err) {
        res.status(500).send(err.message);
    }
};