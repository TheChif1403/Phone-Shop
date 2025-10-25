exports.getPerformancePage = (req, res) => {
    try {
        const performanceData = null;

        res.render('performance', {
            page: 'performance',
            pageTitle: 'Hiệu suất | Admin',
            performanceData,
            contentPage: 'performanceContent'
        });
    } catch (err) {
        res.status(500).send(err.message);
    }
};